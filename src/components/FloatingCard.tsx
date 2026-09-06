import React, { useEffect, useRef, useContext } from 'react';
import * as Matter from 'matter-js';
import { PhysicsContext } from './AntiGravityContainer';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FloatingCardProps {
  children: React.ReactNode;
  className?: string;
  weight?: number;
  initialX?: number;
  initialY?: number;
  shape?: 'rectangle' | 'circle';
}

export default function FloatingCard({ 
  children, 
  className, 
  weight = 1, 
  initialX = 100, 
  initialY = 100,
  shape = 'rectangle'
}: FloatingCardProps) {
  const { engine } = useContext(PhysicsContext);
  const cardRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<Matter.Body | null>(null);

  useEffect(() => {
    if (!engine || !cardRef.current) return;

    // Ambil ukuran sesungguhnya dari elemen DOM hasil render React
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width || 64;
    const height = rect.height || 64;

    // Buat objek fisik di dalam Matter.js berdasarkan ukuran DOM
    const options = {
      mass: weight,
      frictionAir: 0.03, // Tahanan udara (friction) agar kartu melambat saat dilempar
      restitution: 0.7,  // Bounciness saat menabrak dinding atau elemen lain
      friction: 0.001,
      render: { visible: false } // Sembunyikan render bawaan Matter karena kita menggunakan DOM CSS
    };

    let body: Matter.Body;
    if (shape === 'circle') {
      const radius = Math.max(width, height) / 2;
      body = Matter.Bodies.circle(initialX + width / 2, initialY + height / 2, radius, options);
    } else {
      body = Matter.Bodies.rectangle(initialX + width / 2, initialY + height / 2, width, height, options);
    }
    
    bodyRef.current = body;
    Matter.Composite.add(engine.world, body);

    // Sinkronisasi posisi Body Matter.js ke CSS Transform elemen DOM
    let animationFrameId: number;
    
    const updatePosition = () => {
      if (cardRef.current && bodyRef.current) {
        const { x, y } = bodyRef.current.position;
        const angle = bodyRef.current.angle;
        
        // Offset (x - width/2) diperlukan karena Matter.js memosisikan objek dari titik tengah (center), 
        // sedangkan CSS transform memosisikan dari kiri atas (top-left) origin.
        cardRef.current.style.transform = `translate(${x - width / 2}px, ${y - height / 2}px) rotate(${angle}rad)`;
      }
      animationFrameId = requestAnimationFrame(updatePosition);
    };
    
    updatePosition();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (bodyRef.current) {
        Matter.Composite.remove(engine.world, bodyRef.current);
      }
    };
  }, [engine, initialX, initialY, weight]);

  if (!engine) {
    // Fallback statis untuk mobile
    return (
      <div
        className={cn(
          "w-full max-w-sm mx-auto relative",
          "rounded-3xl border border-soft-primary/30 bg-soft-surface/80 backdrop-blur-md shadow-lg",
          "p-6 flex flex-col items-center justify-center",
          className
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      className={cn(
        "absolute top-0 left-0 cursor-grab active:cursor-grabbing",
        // Desain UI sesuai permintaan (rounded besar, shadow, pastel transparan)
        "rounded-3xl border border-soft-primary/30 bg-soft-surface/80 backdrop-blur-md shadow-xl",
        "transition-shadow duration-300 hover:shadow-soft-primary/40 hover:border-soft-primary/60",
        // Menambahkan sedikit padding bawaan agar konten tidak menempel ke border
        "p-6 flex items-center justify-center",
        className
      )}
      style={{
        // Mencegah gangguan visual (select teks / drag image) saat melempar kartu
        userSelect: 'none',
        WebkitUserSelect: 'none',
        willChange: 'transform' // Optimasi render browser
      }}
    >
      {children}
    </div>
  );
}
