"use client";

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
import { useState } from "react";

export default function Sidebar() {
  const today: Date = new Date();
  const [open, setOpen] = useState(false)

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
            <EventForm onSuccess={() => setOpen(false)}/>
          </DialogContent>
        </Dialog>

        <Calendar today={today} mode="single" />
      </div>
    </aside>
  );
}
