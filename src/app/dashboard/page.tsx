'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  isSameMonth,
  setHours,
} from 'date-fns';

export interface DayEvent {
  event: string;
  start: string; // "HH:mm"
  end: string;   // "HH:mm"
}

const dummyEvents: DayEvent[] = [
  { event: '📝 Write report', start: '09:30', end: '10:15' },
  { event: '🍕 Lunch with Sarah', start: '11:00', end: '13:00' },
  { event: '🏋️ Gym', start: '18:00', end: '19:30' },
  { event: '📞 Call with Tom', start: '20:15', end: '21:00' },
];

const ROW_HEIGHT_PX = 64;       // 4rem = 64px (h-16)
const LABEL_WIDTH_PX = 48;      // 3rem = 48px (w-12)
const HORIZONTAL_PADDING = 16;  // 1rem = 16px (px-4)

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

const parseMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

export default function CalendarMonth() {
  const params = useSearchParams();
  const viewParam = params.get('view');
  const dateParam = params.get('date');

  const view = viewParam === 'day' ? 'day' : 'month';
  const currentDate = dateParam ? new Date(dateParam) : new Date();

  // Month boundaries and calendar grid
  const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth());
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days: Date[] = [];
  for (let d = calendarStart; d <= calendarEnd; d = addDays(d, 1)) {
    days.push(d);
  }
  const numRows = days.length / 7;

  // Day view events
  const [dayEvents, setDayEvents] = useState<DayEvent[]>([]);
  useEffect(() => {
    if (view === 'day') {
      // Mimic backend fetch
      (async () => {
        // e.g. const res = await fetch(`/api/events?date=${dateParam}`);
        // const data = await res.json();
        const data = dummyEvents;
        setDayEvents(data);
      })();
    }
  }, [view, dateParam]);

  if (view === 'day') {
    const offsetMin = -currentDate.getTimezoneOffset();
    const sign = offsetMin >= 0 ? '+' : '-';
    const abs = Math.abs(offsetMin);
    const hh = String(Math.floor(abs / 60)).padStart(2, '0');
    const mm = String(abs % 60).padStart(2, '0');
    const offsetStr = `GMT${sign}${hh}:${mm}`;

    return (
      <div className="w-full h-full bg-gray-900 text-white rounded-lg flex flex-col overflow-y-auto">
        {/* header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700">
          <div className="text-xs text-gray-400">{offsetStr}</div>
          <div className="text-right">
            <div className="text-xs uppercase text-gray-400">{format(currentDate, 'EEE')}</div>
            <div className="text-2xl font-semibold">{format(currentDate, 'd')}</div>
          </div>
        </div>
        {/* timeline + events */}
        <div className="relative flex-1">
          {HOURS.map(h => (
            <div key={h} className="flex items-center h-16 px-4">
              <div className="w-12 text-right pr-4 text-sm text-gray-400">{format(setHours(currentDate, h), 'h a')}</div>
              <div className="flex-1 border-t border-gray-700" />
            </div>
          ))}
          {dayEvents.map((ev, idx) => {
            const startMin = parseMinutes(ev.start);
            const endMin = parseMinutes(ev.end);
            const top = (startMin / 60) * ROW_HEIGHT_PX;
            const height = ((endMin - startMin) / 60) * ROW_HEIGHT_PX;
            return (
              <div
                key={idx}
                className="absolute bg-blue-500 bg-opacity-70 rounded text-xs p-1 overflow-hidden"
                style={{ top, height, left: LABEL_WIDTH_PX + HORIZONTAL_PADDING, right: HORIZONTAL_PADDING }}
              >
                {ev.event}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Month view fallback
  return (
    <div className="w-full h-full flex flex-col">
      <div className="grid grid-cols-7 text-center mt-3">
        {WEEKDAYS.map(wd => (
          <div key={wd} className="text-xs font-semibold text-gray-400 uppercase">{wd}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 text-center flex-1" style={{ gridTemplateRows: `repeat(${numRows}, minmax(0, 1fr))` }}>
        {days.map((dayDate, i) => {
          const isCurr = isSameMonth(dayDate, monthDate);
          return (
            <div key={i} className={`py-2 border transition-colors ${isCurr ? 'text-white' : 'text-gray-600'}`}>
              {format(dayDate, 'd')}
              <div className="flex flex-col gap-1">
                {/* placeholder events */}
                {dummyEvents.slice(0, 3).map((ev, j) => (
                  <div key={j} className="text-xs rounded-xl cursor-pointer mx-2 text-white hover:bg-slate-900">
                    {ev.start} <span className="font-semibold">{ev.event}</span>
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
