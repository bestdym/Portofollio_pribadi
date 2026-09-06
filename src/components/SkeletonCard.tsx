import React from 'react';
import { cn } from './FloatingCard';

export default function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full max-w-sm mx-auto relative overflow-hidden",
        "rounded-3xl border border-soft-primary/20 bg-white/40 backdrop-blur-md shadow-sm",
        "p-6 flex flex-col items-center justify-center animate-pulse",
        className
      )}
    >
      <div className="w-full h-32 bg-soft-primary/20 rounded-2xl mb-4"></div>
      <div className="w-3/4 h-6 bg-soft-primary/20 rounded-md mb-2"></div>
      <div className="w-1/2 h-4 bg-soft-primary/10 rounded-md"></div>
    </div>
  );
}
