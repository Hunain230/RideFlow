import React from 'react';
import { Navbar } from './Navbar';
import { ToastProvider } from '../ui/Toast';
import { CinematicBackground } from '../ui/CinematicBackground';
import { GeographicTextures } from '../ui/GeographicTextures';
import { MotionTrails } from '../ui/MotionTrails';
import { DynamicSpotlight } from '../ui/DynamicSpotlight';
import { ConnectiveGlow } from '../ui/ConnectiveGlow';
import { AnimatedParticles } from '../ui/AnimatedParticles';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-white via-soft-beige to-ivory text-text-primary overflow-x-hidden relative">
      {/* Visual Layers from Landing Page */}
      <CinematicBackground />
      <GeographicTextures />
      <MotionTrails />
      <DynamicSpotlight />
      <ConnectiveGlow />
      <AnimatedParticles />
      
      <Navbar />
      <div className="flex-1 flex w-full relative pt-[72px]">
        {children}
      </div>
      <ToastProvider />
    </div>
  );
}
