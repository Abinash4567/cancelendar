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

// Define the possible views
type View = 'day' | 'week' | 'month';

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

  // Read view and date from URL, with sensible defaults
  const initialView = (params.get('view') as View) || 'month';
  const dateParam = params.get('date');
  const initialDate = dateParam ? new Date(dateParam) : new Date();

  const [view, setView] = useState<View>(initialView);
  const [currentDate, setCurrentDate] = useState<Date>(initialDate);

  // Sync view & date into URL parameters
  useEffect(() => {
    // For month view, always show the first of the month
    const d = view === 'month'
      ? new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      : currentDate;
    const isoDate = d.toISOString().slice(0, 10);
    router.replace(`?view=${view}&date=${isoDate}`);
  }, [view, currentDate, router]);

  // Navigation handlers: move by one unit of the current view
  const prev = () => {
    if (view === 'month') {
      setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    } else if (view === 'week') {
      setCurrentDate(d => new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7));
    } else {
      setCurrentDate(d => new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1));
    }
  };

  const next = () => {
    if (view === 'month') {
      setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
    } else if (view === 'week') {
      setCurrentDate(d => new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7));
    } else {
      setCurrentDate(d => new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1));
    }
  };

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
      {/* Navigation controls */}
      <div className="flex gap-4">
        <div className="flex gap-2">
          <button onClick={prev} aria-label="Previous" className="p-2 rounded-full hover:bg-slate-900 active:scale-95 transition">
            <ChevronLeft />
          </button>
          <button onClick={next} aria-label="Next" className="p-2 rounded-full hover:bg-slate-900 active:scale-95 transition">
            <ChevronRight />
          </button>
        </div>
        <div className="text-xl pt-1">
          {view === 'month'
            ? currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })
            : view === 'week'
              ? `Week of ${currentDate.toLocaleDateString()}`
              : currentDate.toLocaleDateString()
          }
        </div>
      </div>

      {/* Search input */}
      <div className="relative flex max-w-sm w-full items-center gap-2">
        <Input
          type="text"
          placeholder="Search Event"
          value={searchTerm}
          onChange={e => { setSearchTerm(e.target.value); setEvents([]); }}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <Button variant="outline" onClick={handleSearch}>
          <Search />
        </Button>
        {events.length > 0 && (
          <ul className="absolute top-12 left-0 right-0 border bg-slate-950 rounded shadow-md z-50">
            {events.map(event => (
              <li key={event.id} className="p-2 border-b last:border-b-0 cursor-pointer">
                <div className="font-medium">{event.title}</div>
                <div className="text-xs text-gray-500">{new Date(event.start).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* View selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="rounded-xl">
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={view} onValueChange={(value: string) => setView(value as View)}>
            <DropdownMenuRadioItem value="day">Day</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="month">Month</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Profile & theme toggle */}
      <div className="flex items-center space-x-4">
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {session && <span className="rounded-full">Hi, {session?.user?.name?.split(' ')[0]}</span>}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
