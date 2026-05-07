import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';

export function CinematicBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const xPercent = (clientX / innerWidth - 0.5) * 2;
      const yPercent = (clientY / innerHeight - 0.5) * 2;
      
      mouseX.set(xPercent * 10);
      mouseY.set(yPercent * 10);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Multi-layered depth effect */}
      
      {/* Far background - Blurred city skyline */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(230, 213, 184, 0.1) 0%, 
              rgba(247, 231, 206, 0.15) 25%, 
              rgba(245, 242, 237, 0.1) 50%, 
              rgba(255, 248, 231, 0.15) 75%, 
              rgba(247, 231, 206, 0.1) 100%
            )
          `,
          filter: 'blur(80px)',
          x: useTransform(springX, [-10, 10], [-5, 5]),
          y: useTransform(springY, [-10, 10], [-5, 5]),
        }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Mid layer - City silhouette */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, 
              rgba(245, 158, 11, 0.1) 0%, 
              transparent 50%
            ),
            radial-gradient(ellipse at 80% 70%, 
              rgba(251, 191, 36, 0.1) 0%, 
              transparent 50%
            ),
            linear-gradient(180deg, 
              rgba(255, 254, 249, 0.05) 0%, 
              rgba(230, 213, 184, 0.1) 50%, 
              rgba(255, 248, 231, 0.05) 100%
            )
          `,
          filter: 'blur(40px)',
          x: useTransform(springX, [-10, 10], [-8, 8]),
          y: useTransform(springY, [-10, 10], [-8, 8]),
        }}
        animate={{
          scale: [1, 1.02, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Close layer - Frosted glass effect */}
      <motion.div
        className="absolute inset-0 backdrop-blur-3xl"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(255, 255, 255, 0.02) 0%, 
              rgba(255, 255, 255, 0.05) 50%, 
              rgba(255, 255, 255, 0.02) 100%
            )
          `,
          x: useTransform(springX, [-10, 10], [-3, 3]),
          y: useTransform(springY, [-10, 10], [-3, 3]),
        }}
      />
      
      {/* Warm sunset overlay */}
      <motion.div
        className="absolute inset-0 opacity-40"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, 
              rgba(245, 158, 11, 0.2) 0%, 
              transparent 60%
            ),
            radial-gradient(ellipse at 70% 80%, 
              rgba(251, 191, 36, 0.15) 0%, 
              transparent 60%
            )
          `,
          mixBlendMode: 'soft-light',
          x: useTransform(springX, [-10, 10], [-2, 2]),
          y: useTransform(springY, [-10, 10], [-2, 2]),
        }}
        animate={{
          opacity: [0.4, 0.5, 0.4],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Subtle vignette for depth */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at center, 
              transparent 0%, 
              rgba(230, 213, 184, 0.05) 70%, 
              rgba(245, 242, 237, 0.1) 100%
            ),
            radial-gradient(ellipse at 80% 20%, 
              rgba(217, 119, 6, 0.08) 0%, 
              transparent 50%
            )
          `,
        }}
      />
      
      {/* Animated light rays */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`ray-${i}`}
          className="absolute h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent"
          style={{
            width: '200%',
            left: '-50%',
            top: `${20 + i * 12}%`,
            transform: `rotate(${15 + i * 5}deg)`,
            x: useTransform(springX, [-10, 10], [i * 2, -i * 2]),
            y: useTransform(springY, [-10, 10], [i * 2, -i * 2]),
          }}
          animate={{
            opacity: [0, 0.3, 0],
            scaleX: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            delay: i * 1.5,
            ease: 'easeInOut',
          }}
        />
      ))}
      
      {/* Floating glass shards for extra depth */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`shard-${i}`}
          className="absolute backdrop-blur-xl bg-glass-white/5 border border-glass-border/20"
          style={{
            width: `${100 + i * 50}px`,
            height: `${2 + i}px`,
            left: `${10 + i * 20}%`,
            top: `${30 + i * 15}%`,
            transform: `rotate(${i * 15}deg)`,
            x: useTransform(springX, [-10, 10], [i * 3, -i * 3]),
            y: useTransform(springY, [-10, 10], [i * 3, -i * 3]),
          }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            delay: i * 0.8,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
