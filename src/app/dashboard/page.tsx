// src/components/CalendarMonth.tsx
import React from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  isSameMonth,
  setHours
} from 'date-fns';

interface CalendarMonthProps {
  year: number;
  month: number; // 1-12
}

const dummyEvents: DayEvent[] = [
  { event: '📝 Write report', start: '09:30', end: '10:15' },
  { event: '🍕 Lunch with Sarah', start: '11:00', end: '13:00' },
  { event: '🏋️ Gym', start: '18:00', end: '19:30' },
  { event: '📞 Call with Tom', start: '20:15', end: '21:00' },
];

export interface DayEvent {
  event: string;
  start: string; // "HH:mm"
  end: string;   // "HH:mm"
}

interface TimelineDayProps {
  date?: Date;
  events: DayEvent[];
}

const ROW_HEIGHT_PX = 64;       // 4rem = 64px (h-16)
const LABEL_WIDTH_PX = 48;      // 3rem = 48px (w-12)
const HORIZONTAL_PADDING = 16;  // 1rem = 16px (px-4)

const parseMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};



const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CalendarMonth: React.FC<CalendarMonthProps> = ({ year = 2025, month = 6 }) => {
  // 1. Calculate month boundaries
  const monthDate = new Date(year, month - 1);
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  // 2. Build an array of every day in the calendar view
  const date = new Date();
  const days: Date[] = [];
  let cursor = calendarStart;
  while (cursor <= calendarEnd) {
    days.push(cursor);
    cursor = addDays(cursor, 1);
  }

  // 3. How many rows (weeks) do we actually need?
  const numRows = days.length / 7;








  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const abs = Math.abs(offsetMinutes);
  const hh = String(Math.floor(abs / 60)).padStart(2, '0');
  const mm = String(abs % 60).padStart(2, '0');
  const offsetStr = `GMT${sign}${hh}:${mm}`;

  // build an array [0,1,2...23]
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="w-full h-full flex flex-col">

      {/* Weekday Header */}
      <div className="grid grid-cols-7 text-center mt-3">
        {WEEKDAYS.map((wd) => (
          <div key={wd} className="text-xs font-semibold text-gray-400 uppercase">{wd}</div>
        ))}
      </div>

      {/* Days Grid (dynamic rows) */}
      <div
        className="grid grid-cols-7 text-center flex-1"
        style={{ gridTemplateRows: `repeat(${numRows}, minmax(0, 1fr))` }}
      >
        {days.map((dayDate, idx) => {
          const isCurrentMonth = isSameMonth(dayDate, monthDate);
          return (
            <div
              key={idx}
              className={`
                py-2
                border
                transition-colors
                ${isCurrentMonth ? 'text-white' : 'text-gray-600'}
              `}
            >
              {format(dayDate, 'd')}
              <div className='flex flex-col gap-1'>
                <div className='text-xs bg-green-900 rounded-xl cursor-pointer mx-2 text-black font-semibold'>Event1</div>
                <div className='text-xs bg-green-900 rounded-xl cursor-pointer mx-2 text-black font-semibold'>Event1</div>
                <div className='text-xs bg-green-900 rounded-xl cursor-pointer mx-2 text-black font-semibold'>Event1</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>

    // <div className="w-full h-full bg-gray-900 text-white rounded-lg flex flex-col overflow-y-auto">
    //   {/* header */}
    //   <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700">
    //     <div className="text-xs text-gray-400">{offsetStr}</div>
    //     <div className="text-right">
    //       <div className="text-xs uppercase text-gray-400">{format(date, 'EEE')}</div>
    //       <div className="text-2xl font-semibold">{format(date, 'd')}</div>
    //     </div>
    //   </div>

    //   {/* timeline grid + events */}
    //   <div className="relative flex-1">
    //     {/* Hour rows */}
    //     {hours.map((h) => (
    //       <div key={h} className="flex items-center h-16 px-4">
    //         <div className="w-12 text-right pr-4 text-sm text-gray-400">
    //           {format(setHours(date, h), 'h a')}
    //         </div>
    //         <div className="flex-1 border-t border-gray-700" />
    //       </div>
    //     ))}

    //     {/* Event blocks */}
    //     {dummyEvents.map((ev, idx) => {
    //       const startMin = parseMinutes(ev.start);
    //       const endMin = parseMinutes(ev.end);
    //       const topPx = (startMin / 60) * ROW_HEIGHT_PX;
    //       const heightPx = ((endMin - startMin) / 60) * ROW_HEIGHT_PX;

    //       return (
    //         <div
    //           key={idx}
    //           className="absolute bg-blue-500 bg-opacity-70 rounded text-xs p-1 overflow-hidden"
    //           style={{
    //             top: topPx,
    //             height: heightPx,
    //             left: LABEL_WIDTH_PX + HORIZONTAL_PADDING,
    //             right: HORIZONTAL_PADDING,
    //           }}
    //         >
    //           {ev.event}
    //         </div>
    //       );
    //     })}
    //   </div>
    // </div>
  );
};

export default CalendarMonth;
