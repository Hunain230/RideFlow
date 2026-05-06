import { useEffect, useRef } from 'react';

/**
 * 3D tilt effect on mousemove for a card element.
 * Perspective: 1200px, max rotation: ±6deg
 */
export function useTilt<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      const rotateX = ((y - cy) / cy) * -6;
      const rotateY = ((x - cx) / cx) *  6;

      el.style.willChange = 'transform';
      el.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      el.style.transition = 'transform 0.15s ease';
    };

    const handleMouseLeave = () => {
      el.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)';
      el.style.transition = 'transform 0.4s ease';
      setTimeout(() => {
        el.style.willChange = 'auto';
      }, 400);
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return ref;
}
