import { useMousePosition } from "@/lib/mouse-interactions";
import { useState, useEffect, useRef } from "react";

export function MouseFollower() {
  const mousePosition = useMousePosition();
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [trail, setTrail] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number; timestamp: number }>>([]);
  const [particles, setParticles] = useState<Array<{ x: number; y: number; id: number; vx: number; vy: number }>>([]);
  const trailRef = useRef<number>(0);
  const rippleRef = useRef<number>(0);
  const particleRef = useRef<number>(0);

  useEffect(() => {
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseDown = () => {
      setIsClicking(true);
      createRipple();
      createParticles();
    };
    const handleMouseUp = () => setIsClicking(false);

    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Create mouse trail effect
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setTrail(prev => {
        const newTrail = [
          { x: mousePosition.x, y: mousePosition.y, id: trailRef.current++ },
          ...prev.slice(0, 8)
        ];
        return newTrail;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [mousePosition.x, mousePosition.y, isVisible]);

  const createRipple = () => {
    const newRipple = {
      x: mousePosition.x,
      y: mousePosition.y,
      id: rippleRef.current++,
      timestamp: Date.now()
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 1500);
  };

  const createParticles = () => {
    const newParticles = Array.from({ length: 8 }, () => ({
      x: mousePosition.x,
      y: mousePosition.y,
      id: particleRef.current++,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4
    }));
    
    setParticles(prev => [...prev, ...newParticles]);
    
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.some(np => np.id === p.id)));
    }, 2000);
  };

  return (
    <>
      {/* Mouse Trail */}
      {trail.map((point, index) => (
        <div
          key={point.id}
          className="fixed pointer-events-none z-40 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20"
          style={{
            left: point.x,
            top: point.y,
            width: Math.max(2, 12 - index),
            height: Math.max(2, 12 - index),
            transform: 'translate(-50%, -50%)',
            opacity: Math.max(0.1, 1 - index * 0.15),
            transition: 'all 0.2s ease-out',
          }}
        />
      ))}

      {/* Click Ripples */}
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="fixed pointer-events-none z-45 rounded-full border-2 border-accent/50 animate-ping"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: '80px',
            height: '80px',
            transform: 'translate(-50%, -50%)',
            animationDuration: '1.5s',
          }}
        />
      ))}

      {/* Click Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="fixed pointer-events-none z-45 rounded-full bg-gradient-to-r from-accent to-primary animate-bounce"
          style={{
            left: particle.x + particle.vx * 20,
            top: particle.y + particle.vy * 20,
            width: '4px',
            height: '4px',
            transform: 'translate(-50%, -50%)',
            opacity: 0.8,
            animationDuration: '2s',
          }}
        />
      ))}

      {/* Main Cursor - Large Glow */}
      <div
        className={`fixed pointer-events-none z-50 transition-all duration-300 ${
          isVisible ? 'opacity-30' : 'opacity-0'
        } ${isClicking ? 'scale-150' : 'scale-100'}`}
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className={`
          w-16 h-16 rounded-full blur-xl animate-pulse
          ${isClicking 
            ? 'bg-gradient-to-r from-accent/60 to-primary/60' 
            : 'bg-gradient-to-r from-primary/40 to-secondary/40'
          }
        `}></div>
      </div>

      {/* Main Cursor - Medium Ring */}
      <div
        className={`fixed pointer-events-none z-50 transition-all duration-200 ${
          isVisible ? 'opacity-60' : 'opacity-0'
        } ${isClicking ? 'scale-125' : 'scale-100'}`}
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className={`
          w-8 h-8 rounded-full border-2 animate-spin-slow
          ${isClicking 
            ? 'border-accent/80 bg-accent/20' 
            : 'border-primary/60 bg-primary/10'
          }
        `}></div>
      </div>
      
      {/* Main Cursor - Inner Dot */}
      <div
        className={`fixed pointer-events-none z-50 transition-all duration-150 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } ${isClicking ? 'scale-75' : 'scale-100'}`}
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className={`
          w-2 h-2 rounded-full
          ${isClicking 
            ? 'bg-gradient-to-r from-accent to-primary animate-ping' 
            : 'bg-gradient-to-r from-secondary to-primary animate-pulse'
          }
        `}></div>
      </div>

      {/* Magnetic Field Effect */}
      <div
        className={`fixed pointer-events-none z-40 transition-all duration-500 ${
          isVisible ? 'opacity-10' : 'opacity-0'
        }`}
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 blur-2xl animate-pulse"></div>
      </div>

      {/* Orbital Elements */}
      <div
        className={`fixed pointer-events-none z-45 transition-all duration-300 ${
          isVisible ? 'opacity-70' : 'opacity-0'
        }`}
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-accent rounded-full animate-ping"
            style={{
              left: Math.cos((Date.now() / 1000 + i * 2) * Math.PI) * (20 + i * 5) + 'px',
              top: Math.sin((Date.now() / 1000 + i * 2) * Math.PI) * (20 + i * 5) + 'px',
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${1.5 + i * 0.5}s`,
            }}
          />
        ))}
      </div>
    </>
  );
}