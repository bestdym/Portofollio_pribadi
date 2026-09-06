import React, { useEffect, useRef, useState, createContext } from 'react';
import * as Matter from 'matter-js';

type PhysicsContextType = {
  engine: Matter.Engine | null;
};

export const PhysicsContext = createContext<PhysicsContextType>({ engine: null });

interface AntiGravityContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function AntiGravityContainer({ children, className = '' }: AntiGravityContainerProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const [engineReady, setEngineReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setEngineReady(true);
      return;
    }

    if (!sceneRef.current) return;

    // 1. Inisialisasi Engine & World
    const engine = Matter.Engine.create();
    
    // Matikan gravitasi untuk efek "mengapung di ruang hampa"
    engine.world.gravity.y = 0;
    engine.world.gravity.x = 0;
    engineRef.current = engine;

    const renderWidth = sceneRef.current.clientWidth;
    const renderHeight = sceneRef.current.clientHeight;

    // 2. Setup Dinding Pembatas (Bounding Box / Viewport)
    const wallOptions = { 
      isStatic: true, 
      render: { visible: false },
      friction: 0,
      restitution: 0.8 // Efek memantul ringan
    };
    
    const thickness = 200; 
    const walls = [
      Matter.Bodies.rectangle(renderWidth / 2, -thickness / 2, renderWidth * 2, thickness, wallOptions),
      Matter.Bodies.rectangle(renderWidth / 2, renderHeight + thickness / 2, renderWidth * 2, thickness, wallOptions),
      Matter.Bodies.rectangle(-thickness / 2, renderHeight / 2, thickness, renderHeight * 2, wallOptions),
      Matter.Bodies.rectangle(renderWidth + thickness / 2, renderHeight / 2, thickness, renderHeight * 2, wallOptions),
    ];
    Matter.Composite.add(engine.world, walls);

    const handleResize = () => {
      if (!sceneRef.current) return;
      const newWidth = sceneRef.current.clientWidth;
      const newHeight = sceneRef.current.clientHeight;
      
      Matter.Body.setPosition(walls[0], { x: newWidth / 2, y: -thickness / 2 });
      Matter.Body.setPosition(walls[1], { x: newWidth / 2, y: newHeight + thickness / 2 });
      Matter.Body.setPosition(walls[2], { x: -thickness / 2, y: newHeight / 2 });
      Matter.Body.setPosition(walls[3], { x: newWidth + thickness / 2, y: newHeight / 2 });
    };
    window.addEventListener('resize', handleResize);

    // 3. Setup Drag and Throw
    const mouse = Matter.Mouse.create(sceneRef.current);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.1,
        render: { visible: false }
      }
    });
    
    mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
    mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);
    Matter.Composite.add(engine.world, mouseConstraint);

    // 4. Idle Floating & Repulsion
    Matter.Events.on(engine, 'beforeUpdate', () => {
      const bodies = Matter.Composite.allBodies(engine.world);
      bodies.forEach((body) => {
        if (!body.isStatic) {
          const speed = Matter.Vector.magnitude(body.velocity);
          if (speed < 0.2 && !mouseConstraint.body) {
            Matter.Body.applyForce(body, body.position, {
              x: (Math.random() - 0.5) * 0.0001 * body.mass,
              y: (Math.random() - 0.5) * 0.0001 * body.mass
            });
          }

          if (mouse.position.x && mouse.position.y && !mouseConstraint.body) {
            const dx = body.position.x - mouse.position.x;
            const dy = body.position.y - mouse.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            const repulsionRadius = 150; 
            if (distance < repulsionRadius) {
              const forceMagnitude = (0.0002 * (repulsionRadius - distance)) / repulsionRadius;
              Matter.Body.applyForce(body, body.position, {
                x: (dx / distance) * forceMagnitude * body.mass,
                y: (dy / distance) * forceMagnitude * body.mass
              });
            }
          }
        }
      });
    });

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    setEngineReady(true);

    return () => {
      window.removeEventListener('resize', handleResize);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
    };
  }, [isMobile]);

  if (isMobile) {
    return (
      <PhysicsContext.Provider value={{ engine: null }}>
        <div className={`w-full flex flex-col gap-6 p-4 items-center ${className}`}>
          {engineReady && children}
        </div>
      </PhysicsContext.Provider>
    );
  }

  return (
    <PhysicsContext.Provider value={{ engine: engineRef.current }}>
      <div 
        ref={sceneRef} 
        className={`relative overflow-hidden w-full h-full min-h-[80vh] ${className}`}
      >
        {engineReady && children}
      </div>
    </PhysicsContext.Provider>
  );
}
