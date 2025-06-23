'use client';

import React, { useEffect, useState, useMemo, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import {
  parseISO,
  format,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  setHours,
  formatISO,
  isSameMonth,
} from 'date-fns';
import { getEventsInDay } from '@/lib/actions/event.actions';

export interface DayEvent {
  id: string;
  title: string;
  start: string; // ISO datetime
  end: string;   // ISO datetime
}

const ROW_HEIGHT_PX = 64;      
const LABEL_WIDTH_PX = 48;     
const HORIZONTAL_PADDING = 16; 

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

const parseMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

// Move the component that uses useSearchParams into its own component
function CalendarMonth() {
  const { data: session } = useSession();
  const params = useSearchParams();
  const viewParam = params.get('view');
  const dateParam = params.get('date');

  const view = viewParam === 'day' ? 'day' : 'month';
  const currentDate = useMemo(()=>dateParam ? parseISO(dateParam) : new Date(), [dateParam]);
  const email = session?.user?.email as string;

  // Combined events for the selected range
  const [events, setEvents] = useState<DayEvent[]>([]);

  useEffect(() => {
    if (!email) 
        return;
    async function fetchEvents() {
      let rangeStart: Date, rangeEnd: Date;
      if (view === 'day') {
        rangeStart = startOfDay(currentDate);
        rangeEnd   = endOfDay(currentDate);
      } else {
        rangeStart = startOfMonth(currentDate);
        rangeEnd   = endOfMonth(currentDate);
      }
      const startIso = formatISO(rangeStart);
      const endIso   = formatISO(rangeEnd);

      const data = await getEventsInDay(startIso, endIso, email);
      console.log("resposne: ", data)
      const mapped = data.map(ev => ({
        id:    ev.id,
        title: ev.title,
        start: ev.start.toISOString(),
        end:   ev.end?.toISOString(),
      }));
      setEvents(mapped);
    }
    fetchEvents();
  }, [view, dateParam, email, currentDate]);

  // DAY VIEW
  if (view === 'day') {
    const offsetMin = -currentDate.getTimezoneOffset();
    const sign      = offsetMin >= 0 ? '+' : '-';
    const abs       = Math.abs(offsetMin);
    const hh        = String(Math.floor(abs / 60)).padStart(2, '0');
    const mm        = String(abs % 60).padStart(2, '0');
    const offsetStr = `GMT${sign}${hh}:${mm}`;

    return (
      <div className="w-full h-full bg-gray-900 text-white rounded-lg flex flex-col overflow-y-auto">
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700">
          <div className="text-xs text-gray-400">{offsetStr}</div>
          <div className="text-right">
            <div className="text-xs uppercase text-gray-400">{format(currentDate, 'EEE')}</div>
            <div className="text-2xl font-semibold">{format(currentDate, 'd')}</div>
          </div>
        </div>
        <div className="relative flex-1">
          {HOURS.map(h => (
            <div key={h} className="flex items-center h-16 px-4">
              <div className="w-12 text-right pr-4 text-sm text-gray-400">
                {format(setHours(currentDate, h), 'h a')}
              </div>
              <div className="flex-1 border-t border-gray-700" />
            </div>
          ))}
          {events.map((ev, idx) => {
            const startMin = parseMinutes(format(parseISO(ev.start), 'HH:mm'));
            const endMin   = parseMinutes(format(parseISO(ev.end),   'HH:mm'));
            const top      = (startMin / 60) * ROW_HEIGHT_PX;
            const height   = ((endMin - startMin) / 60) * ROW_HEIGHT_PX;
            return (
              <div
                key={idx}
                className="absolute bg-blue-500 bg-opacity-70 rounded text-xs p-1 overflow-hidden"
                style={{ top, height, left: LABEL_WIDTH_PX + HORIZONTAL_PADDING, right: HORIZONTAL_PADDING }}
              >
                {ev.title}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // MONTH VIEW
  const monthDate     = new Date(currentDate.getFullYear(), currentDate.getMonth());
  const monthStart    = startOfMonth(monthDate);
  const monthEnd      = endOfMonth(monthDate);
  const calStart      = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calEnd        = endOfWeek(monthEnd,   { weekStartsOn: 0 });
  const days: Date[]  = [];
  for (let d = calStart; d <= calEnd; d = addDays(d, 1)) days.push(d);
  const rows = days.length / 7;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="grid grid-cols-7 text-center mt-3">
        {WEEKDAYS.map(wd => (
          <div key={wd} className="text-xs font-semibold text-gray-400 uppercase">{wd}</div>
        ))}
      </div>
      <div
        className="grid grid-cols-7 text-center flex-1"
        style={{ gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}
      >
        {days.map((dayDate, i) => {
          const isCurr = isSameMonth(dayDate, monthDate);
          const key = format(dayDate, 'yyyy-MM-dd');
          const todays = events.filter(ev => format(parseISO(ev.start), 'yyyy-MM-dd') === key);
          return (
            <div key={i} className={`py-2 border transition-colors ${isCurr ? 'text-white' : 'text-gray-600'}`}>
              {format(dayDate, 'd')}
              <div className="flex flex-col gap-1">
                {todays.slice(0, 3).map((ev, j) => (
                  <div key={j} className="text-xs rounded-xl cursor-pointer mx-2 text-white hover:bg-slate-900">
                    {format(parseISO(ev.start), 'h:mma')} <span className="font-semibold">{ev.title}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Wrap the component that uses useSearchParams in Suspense
export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Loading calendar…</div>}>
      <CalendarMonth />
    </Suspense>
  );
}