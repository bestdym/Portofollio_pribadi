import React from 'react';
import { cn } from './FloatingCard';

export default function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full max-w-sm mx-auto relative overflow-hidden",
        "rounded-2xl border border-[#E7E1D8] bg-[#FFFDF9]/80 backdrop-blur-md shadow-xs",
        "p-6 flex flex-col items-center justify-center animate-pulse",
        className
      )}
    >
      <div className="w-full h-36 bg-[#EAE4DC] rounded-xl mb-4"></div>
      <div className="w-3/4 h-5 bg-[#EAE4DC] rounded-md mb-2.5"></div>
      <div className="w-1/2 h-3.5 bg-[#F0EBE3] rounded-md"></div>
    </div>
  );
}
