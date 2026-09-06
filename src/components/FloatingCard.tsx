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
}

export default function FloatingCard({ 
  children, 
  className, 
  weight = 1, 
  initialX = 100, 
  initialY = 100 
}: FloatingCardProps) {
  const { engine } = useContext(PhysicsContext);
  const cardRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<Matter.Body | null>(null);

  useEffect(() => {
    if (!engine || !cardRef.current) return;

    // Ambil ukuran sesungguhnya dari elemen DOM hasil render React
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Buat objek fisik kotak di dalam Matter.js berdasarkan ukuran DOM
    const body = Matter.Bodies.rectangle(initialX + width / 2, initialY + height / 2, width, height, {
      mass: weight,
      frictionAir: 0.03, // Tahanan udara (friction) agar kartu melambat saat dilempar
      restitution: 0.7,  // Bounciness saat menabrak dinding atau elemen lain
      friction: 0.001,
      render: { visible: false } // Sembunyikan render bawaan Matter karena kita menggunakan DOM CSS
    });
    
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
