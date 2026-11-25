import React from 'react';
import { cn } from './FloatingCard';

export default function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full max-w-sm mx-auto relative overflow-hidden",
        "rounded-2xl border border-neutral-200 bg-neutral-50/80 backdrop-blur-md shadow-xs",
        "p-6 flex flex-col items-center justify-center animate-pulse",
        className
      )}
    >
      <div className="w-full h-36 bg-neutral-200/80 rounded-xl mb-4"></div>
      <div className="w-3/4 h-5 bg-neutral-200/80 rounded-md mb-2.5"></div>
      <div className="w-1/2 h-3.5 bg-neutral-100 rounded-md"></div>
    </div>
  );
}
