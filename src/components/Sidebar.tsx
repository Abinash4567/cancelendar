'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EventForm from "@/components/EventForm";

type CalendarValue = Date | undefined;

export default function Sidebar() {
  const today = new Date();
  const router = useRouter();

  // track selected date if you want to highlight it in the UI
  const [selectedDate, setSelectedDate] = useState<CalendarValue>(today);
  const [open, setOpen] = useState(false);

  const handleDateSelect = (date: CalendarValue) => {
    if (!date) return;
    setSelectedDate(date);
    const iso = date.toISOString().slice(0, 10);
    router.replace(`?view=day&date=${iso}`);
  };

  return (
    <aside className="border-r flex flex-col w-fit">
      <div className="p-4 text-xl font-bold">Cancelendar</div>
      <div className="flex flex-col gap-4 p-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Create an Event</Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Create Event</DialogTitle>
            </DialogHeader>
            <EventForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>

        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          today={today}
        />
      </div>
    </aside>
  );
}
