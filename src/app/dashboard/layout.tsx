
import { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
export const metadata = {
  title: "Cancelendar",
  description: "Dashboard",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />

      {/* main content area */}
      <div className="flex flex-col flex-1">
        {/* top navbar */}
        <Navbar />

        {/* page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
