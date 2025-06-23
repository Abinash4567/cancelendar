'use client';

import { ReactNode, Suspense } from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

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
          {/* Suspense boundary catches your useSearchParams() in CalendarMonth */}
          <Suspense fallback={<div className="p-4 text-center">Loading dashboard…</div>}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
