import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef } from 'react';

export function DynamicSpotlight() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springX = useSpring(mouseX, { stiffness: 200, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 200, damping: 25 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Convert to percentage-based coordinates
      const xPercent = (clientX / innerWidth) * 100;
      const yPercent = (clientY / innerHeight) * 100;
      
      mouseX.set(xPercent);
      mouseY.set(yPercent);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {/* Main spotlight gradient */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: `
            radial-gradient(circle at center,
              rgba(245, 158, 11, 0.15) 0%,
              rgba(251, 191, 36, 0.1) 20%,
              rgba(230, 213, 184, 0.05) 40%,
              transparent 70%
            )
          `,
          left: `${springX}%`,
          top: `${springY}%`,
          translateX: '-50%',
          translateY: '-50%',
          filter: 'blur(40px)',
        }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      />
      
      {/* Secondary spotlight for depth */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background: `
            radial-gradient(circle at center,
              rgba(255, 254, 249, 0.2) 0%,
              rgba(247, 231, 206, 0.1) 30%,
              transparent 60%
            )
          `,
          left: `${springX}%`,
          top: `${springY}%`,
          translateX: '-50%',
          translateY: '-50%',
          filter: 'blur(20px)',
        }}
        transition={{ type: 'spring', stiffness: 150, damping: 25 }}
      />
      
      {/* Tertiary highlight */}
      <motion.div
        className="absolute w-[200px] h-[200px] rounded-full"
        style={{
          background: `
            radial-gradient(circle at center,
              rgba(245, 158, 11, 0.3) 0%,
              rgba(251, 191, 36, 0.15) 20%,
              transparent 50%
            )
          `,
          left: `${springX}%`,
          top: `${springY}%`,
          translateX: '-50%',
          translateY: '-50%',
          filter: 'blur(10px)',
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 30 }}
      />
      
      {/* Animated pulse effect */}
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full border border-soft-gold/20"
        style={{
          left: `${springX}%`,
          top: `${springY}%`,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.1, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Light rays emanating from cursor */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`ray-${i}`}
          className="absolute w-px h-32 bg-gradient-to-b from-amber-500/30 to-transparent"
          style={{
            left: `${springX}%`,
            top: `${springY}%`,
            translateX: '-50%',
            translateY: '-100%',
            transform: `rotate(${i * 45}deg)`,
            transformOrigin: 'center bottom',
          }}
          animate={{
            opacity: [0, 0.5, 0],
            scaleY: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
