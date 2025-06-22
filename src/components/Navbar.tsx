'use client';

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuRadioItem, DropdownMenuRadioGroup } from "@/components/ui/dropdown-menu";
import { ModeToggle } from "./ModeToggle";
import { useSession } from "next-auth/react";
import { ChevronRight, ChevronLeft, Search } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react";

export default function Navbar() {
  const [position, setPosition] = useState("bottom")
  const { data: session } = useSession();
  return (
    <header className="flex items-center justify-between h-16 px-6 border-b">
      <div className="flex gap-4">
        <div className="flex gap-2">
          <ChevronLeft />
          <ChevronRight />
        </div>
        <div className="text-xl">December 2025</div>
      </div>

      <div className="flex max-w-sm w-full items-center gap-2">
        <Input type="text" placeholder="Search Event" />
        <Button type="submit" variant="outline"><Search /></Button>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="rounded-xl">Month</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
            <DropdownMenuRadioItem value="top">Day</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="bottom">Week</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="right">Month</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>


      <div className="flex items-center space-x-4">
        <div className="cursor-pointer">
          <ModeToggle />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {session && <span className="rounded-full">Hi, {session.user?.name?.split(" ")[0]}</span>}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
