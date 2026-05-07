import React from 'react';
import { Navbar } from './Navbar';
import { ToastProvider } from '../ui/Toast';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-bg-base text-text-primary flex flex-col">
      <Navbar />
      <div className="flex-1 flex w-full relative pt-[72px]">
        {children}
      </div>
      <ToastProvider />
    </div>
  );
}
