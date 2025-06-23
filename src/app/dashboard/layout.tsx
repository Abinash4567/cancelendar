// app/dashboard/layout.tsx
import { ReactNode, Suspense } from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Cancelendar',
  description: 'Dashboard',
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Navbar />

        <main className="flex-1 overflow-auto">
          {/* ← This is now a SERVER Suspense boundary */}
          <Suspense fallback={<div className="p-4 text-center">Loading calendar…</div>}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
