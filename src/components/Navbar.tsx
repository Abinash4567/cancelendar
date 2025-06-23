'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ChevronRight, ChevronLeft, Search } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";

import { ModeToggle } from "./ModeToggle";
import { searchEvents } from "@/lib/actions/event.actions";

type Event = {
  id: string;
  title: string;
  description: string | null;
  start: Date;
  end: Date;
  recurrence: 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM';
  customRecurrence: string | null;
  priority: 'P0' | 'P1' | 'P2';
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export default function Navbar() {
  const router = useRouter();
  const params = useSearchParams();
  const { data: session } = useSession();

  // Parse date from query or default to today
  const dateParam = params.get('date');
  const initial = dateParam ? new Date(dateParam) : new Date();
  const [currentDate, setCurrentDate] = useState<Date>(
    new Date(initial.getFullYear(), initial.getMonth(), 1)
  );

  // Update URL when currentDate changes
  useEffect(() => {
    const isoDate = currentDate.toISOString().slice(0, 10);
    router.replace(`?view=month&date=${isoDate}`);
  }, [currentDate, router]);

  // Navigation handlers
  const prevMonth = () =>
    setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () =>
    setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const email = session?.user?.email;

  const handleSearch = async () => {
    const term = searchTerm.trim();
    if (!term || !email) return;
    try {
      const results = await searchEvents(term, email);
      setEvents(results);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  return (
    <header className="flex items-center justify-between h-12 px-6 border-b">
      {/* Month navigation */}
      <div className="flex gap-4">
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            aria-label="Previous month"
            className="p-2 rounded-full hover:bg-slate-900 active:scale-95 transition"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={nextMonth}
            aria-label="Next month"
            className="p-2 rounded-full hover:bg-slate-900 active:scale-95 transition"
          >
            <ChevronRight />
          </button>
        </div>
        <div className="text-xl pt-1">
          {currentDate.toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          })}
        </div>
      </div>

      {/* Search input */}
      <div className="relative flex max-w-sm w-full items-center gap-2">
        <Input
          type="text"
          placeholder="Search Event"
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            setEvents([]);
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') handleSearch();
          }}
        />
        <Button variant="outline" onClick={handleSearch}>
          <Search />
        </Button>
        {events.length > 0 && (
          <ul className="absolute top-12 left-0 right-0 border bg-slate-950 rounded shadow-md z-50">
            {events.map(event => (
              <li
                key={event.id}
                className="p-2 border-b last:border-b-0 cursor-pointer"
              >
                <div className="font-medium">{event.title}</div>
                <div className="text-xs text-gray-500">
                  {new Date(event.start).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* View dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="rounded-xl">
            Month
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value="month" onValueChange={() => {}}>
            <DropdownMenuRadioItem value="week">Week</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="month">Month</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Profile and theme */}
      <div className="flex items-center space-x-4">
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {session && (
              <span className="rounded-full">
                Hi, {session?.user?.name?.split(" ")[0]}
              </span>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
