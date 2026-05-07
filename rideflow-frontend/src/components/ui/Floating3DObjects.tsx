import { motion } from 'framer-motion';
import { useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';

export function Floating3DObjects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Calculate mouse position as a percentage of viewport
      const xPercent = (clientX / innerWidth - 0.5) * 2;
      const yPercent = (clientY / innerHeight - 0.5) * 2;
      
      mouseX.set(xPercent * 20);
      mouseY.set(yPercent * 20);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const rotateX = useTransform(springY, [-20, 20], [10, -10]);
  const rotateY = useTransform(springX, [-20, 20], [-10, 10]);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Floating Gradient Spheres */}
      <motion.div
        className="absolute top-20 left-20 w-64 h-64 rounded-full bg-gradient-radial from-soft-gold/30 to-champagne/20 blur-xl"
        style={{
          x: useTransform(springX, [-20, 20], [-30, 30]),
          y: useTransform(springY, [-20, 20], [-30, 30]),
        }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      <motion.div
        className="absolute bottom-32 right-32 w-48 h-48 rounded-full bg-gradient-radial from-champagne/25 to-soft-gold/15 blur-xl"
        style={{
          x: useTransform(springX, [-20, 20], [30, -30]),
          y: useTransform(springY, [-20, 20], [30, -30]),
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Floating 3D Elements */}
      <motion.div
        className="absolute top-1/3 right-1/4 w-32 h-32"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        <motion.div
          className="w-full h-full rounded-2xl bg-gradient-to-br from-soft-gold/20 to-champagne/20 backdrop-blur-xl border border-soft-gold/30"
          animate={{
            rotateZ: [0, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </motion.div>

      <motion.div
        className="absolute bottom-1/4 left-1/3 w-24 h-24"
        style={{
          rotateX: useTransform(springY, [-20, 20], [-5, 5]),
          rotateY: useTransform(springX, [-20, 20], [5, -5]),
          transformStyle: 'preserve-3d',
        }}
      >
        <motion.div
          className="w-full h-full rounded-full bg-gradient-to-br from-champagne/25 to-soft-gold/15 backdrop-blur-xl border border-champagne/30"
          animate={{
            rotateZ: [360, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </motion.div>

      {/* Particle Effects */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-soft-gold/60"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
