'use client';

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ModeToggle } from "./ModeToggle";
import { useSession } from "next-auth/react"

export default function Navbar() {
  const { data: session } = useSession();
  return (
    <header className="flex items-center justify-between h-16 px-6 border-b">
      <Button variant="ghost" className="md:hidden">
        <Menu />
      </Button>

      <h1 className="text-lg font-semibold">Dashboard</h1>

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
