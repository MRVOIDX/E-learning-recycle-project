import { useEffect, useState, useRef } from 'react';

// Hook for tracking mouse position
export function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return mousePosition;
}

// Hook for mouse-following parallax effect
export function useMouseParallax(intensity: number = 0.1) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!elementRef.current) return;
      
      const rect = elementRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) * intensity;
      const deltaY = (e.clientY - centerY) * intensity;
      
      setOffset({ x: deltaX, y: deltaY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [intensity]);

  return { elementRef, offset };
}

// Hook for tilt effect on hover
export function useMouseTilt(maxTilt: number = 15) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!elementRef.current) return;
      
      const rect = elementRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) / rect.width;
      const deltaY = (e.clientY - centerY) / rect.height;
      
      setTilt({
        x: deltaY * maxTilt,
        y: -deltaX * maxTilt
      });
    };

    const handleMouseLeave = () => {
      setTilt({ x: 0, y: 0 });
    };

    const element = elementRef.current;
    if (element) {
      element.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        element.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [maxTilt]);

  return { elementRef, tilt };
}

// Mouse position tracking for global use
export const mouseTracker = {
  x: 0,
  y: 0,
  listeners: new Set<(x: number, y: number) => void>(),
  
  init() {
    if (typeof window === 'undefined') return;
    
    window.addEventListener('mousemove', (e) => {
      this.x = e.clientX;
      this.y = e.clientY;
      this.listeners.forEach(listener => listener(this.x, this.y));
    });
  },
  
  subscribe(callback: (x: number, y: number) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }
};

// Initialize mouse tracker
if (typeof window !== 'undefined') {
  mouseTracker.init();
}

// Magnetic effect hook
export function useMagneticEffect(strength: number = 0.3) {
  const [transform, setTransform] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!elementRef.current) return;
      
      const rect = elementRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
      );
      
      // Magnetic effect only within 150px radius
      if (distance < 150) {
        const deltaX = (e.clientX - centerX) * strength;
        const deltaY = (e.clientY - centerY) * strength;
        setTransform({ x: deltaX, y: deltaY });
      } else {
        setTransform({ x: 0, y: 0 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [strength]);

  return { elementRef, transform };
}

// Utility functions for mouse effects
export const createParallaxEffect = (element: HTMLElement, intensity: number = 0.1) => {
  const unsubscribe = mouseTracker.subscribe((x, y) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (x - centerX) * intensity;
    const deltaY = (y - centerY) * intensity;
    
    element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
  });
  
  return unsubscribe;
};

export const createMagneticEffect = (element: HTMLElement, strength: number = 0.3, radius: number = 150) => {
  const unsubscribe = mouseTracker.subscribe((x, y) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distance = Math.sqrt(
      Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
    );
    
    if (distance < radius) {
      const deltaX = (x - centerX) * strength;
      const deltaY = (y - centerY) * strength;
      element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    } else {
      element.style.transform = 'translate(0px, 0px)';
    }
  });
  
  return unsubscribe;
};