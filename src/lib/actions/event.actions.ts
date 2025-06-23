'use server';

import { db } from "@/lib/prisma";
import { parseISO, startOfMonth, addMonths, startOfDay, endOfDay } from 'date-fns';
import { Recurrence, Priority, } from "@/generated/prisma";
import { Prisma } from "@/generated/prisma";

export async function getEventsInMonth(month: string, userId: string) {
  const monthStart = startOfMonth(parseISO(`${month}-01`));
  const nextMonthStart = startOfMonth(addMonths(monthStart, 1));
  return db.event.findMany({
    where: {
      userId,
      start: { gte: monthStart, lt: nextMonthStart }
    },
    orderBy: { start: 'asc' }
  });
}

export async function createEvent(
  details: {
    title: string;
    description?: string;
    date: string;
    startTime: string;
    endTime: string;
    recurrence: Recurrence;
    customRecurrence?: string;
    priority: Priority;
  },
  userEmail: string
) {
  const user = await db.user.findUnique({ where: { email: userEmail } });
  if (!user) throw new Error(`User with email ${userEmail} not found.`);

  const { date, startTime, endTime, ...rest } = details;
  const start = parseISO(`${date}T${startTime}`);
  const end = parseISO(`${date}T${endTime}`);

  return db.event.create({
    data: {
      ...rest,
      start,
      end,
      user: { connect: { id: user.id } }
    }
  });
}

export async function editEvent(
  eventId: string,
  updateData: Partial<{
    title: string;
    description?: string;
    date: string;
    startTime: string;
    endTime: string;
    recurrence: Recurrence;
    customRecurrence?: string;
    priority: Priority;
  }>
) {
  const existing = await db.event.findUnique({ where: { id: eventId } });
  if (!existing) throw new Error(`Event ${eventId} not found.`);

  const data: Prisma.EventUpdateInput = {};
  if (updateData.title) data.title = updateData.title;
  if ('description' in updateData) data.description = updateData.description;
  if (updateData.date && updateData.startTime) {
    data.start = parseISO(`${updateData.date}T${updateData.startTime}`);
  }
  if (updateData.date && updateData.endTime) {
    data.end = parseISO(`${updateData.date}T${updateData.endTime}`);
  }
  if (updateData.recurrence) data.recurrence = updateData.recurrence;
  if ('customRecurrence' in updateData) data.customRecurrence = updateData.customRecurrence;
  if (updateData.priority) data.priority = updateData.priority;

  // Update this event
  await db.event.update({ where: { id: eventId }, data });

  // Replicate to all recurring events with same pattern
  if (existing.recurrence !== Recurrence.NONE) {
    await db.event.updateMany({
      where: {
        userId: existing.userId,
        recurrence: existing.recurrence,
        customRecurrence: existing.customRecurrence
      },
      data
    });
  }
}

export async function deleteEvent(eventId: string) {
  const existing = await db.event.findUnique({ where: { id: eventId } });
  if (!existing) throw new Error(`Event ${eventId} not found.`);

  if (existing.recurrence !== Recurrence.NONE) {
    await db.event.deleteMany({
      where: {
        userId: existing.userId,
        recurrence: existing.recurrence,
        customRecurrence: existing.customRecurrence
      }
    });
  } else {
    await db.event.delete({ where: { id: eventId } });
  }
}

// 5. Get events in a particular day (e.g., '2025-09-09')
export async function getEventsInDay(day: string, userId: string) {
  const dayStart = startOfDay(parseISO(day));
  const dayEnd = endOfDay(parseISO(day));
  return db.event.findMany({
    where: {
      userId,
      start: { gte: dayStart, lte: dayEnd }
    },
    orderBy: { start: 'asc' }
  });
}

export async function searchEvents(query: string, email: string) {
  if (!email)
    return []

  return db.event.findMany({
    where: {
      user: {
        email: email,
      },
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    },
    orderBy: { start: 'asc' },
  });
}


export async function changeEventDate(
  eventId: string,
  newDate: string
): Promise<boolean> {
  const existing = await db.event.findUnique({ where: { id: eventId } });
  if (!existing) throw new Error(`Event ${eventId} not found.`);

  const startTime = existing.start.toISOString().split('T')[1];
  const endTime = existing.end.toISOString().split('T')[1];
  const newStart = parseISO(`${newDate}T${startTime}`);
  const newEnd = parseISO(`${newDate}T${endTime}`);

  // Check for collisions on that day
  const collisions = await db.event.findMany({
    where: {
      userId: existing.userId,
      OR: [
        { AND: [{ start: { lte: newStart } }, { end: { gt: newStart } }] },
        { AND: [{ start: { lt: newEnd } }, { end: { gte: newEnd } }] },
        { AND: [{ start: { gte: newStart } }, { end: { lte: newEnd } }] }
      ],
      id: { not: eventId }
    }
  });

  if (collisions.length > 0) return false;

  await db.event.update({
    where: { id: eventId },
    data: { start: newStart, end: newEnd }
  });
  return true;
}