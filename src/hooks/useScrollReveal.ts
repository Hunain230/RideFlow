import { useEffect, useRef } from 'react';

/**
 * IntersectionObserver-based scroll reveal.
 * Adds .visible class to trigger CSS transitions defined in animations.css.
 */
export function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Optionally unobserve after reveal
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    // Observe element and all children with .scroll-reveal class
    const targets = el.querySelectorAll('.scroll-reveal');
    if (el.classList.contains('scroll-reveal')) {
      observer.observe(el);
    }
    targets.forEach((t) => observer.observe(t));

    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
