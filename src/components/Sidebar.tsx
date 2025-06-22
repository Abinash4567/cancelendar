import Link from "next/link";
import { Home, Settings, Users } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 border-r flex flex-col">
      <div className="p-4 text-xl font-bold">Cancelendar</div>
      <nav className="flex-1 px-2 space-y-1">
        <Link href="/dashboard" className="flex items-center gap-2 p-2 rounded hover:bg-gray-100">
          <Home size={18} /> Dashboard
        </Link>
        <Link href="/dashboard/users" className="flex items-center gap-2 p-2 rounded hover:bg-gray-100">
          <Users size={18} /> Users
        </Link>
        <Link href="/dashboard/settings" className="flex items-center gap-2 p-2 rounded hover:bg-gray-100">
          <Settings size={18} /> Settings
        </Link>
      </nav>
    </aside>
  );
}
