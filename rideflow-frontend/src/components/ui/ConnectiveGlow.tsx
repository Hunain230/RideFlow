import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';

export function ConnectiveGlow() {
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
      
      mouseX.set(xPercent * 20);
      mouseY.set(yPercent * 20);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden z-5">
      {/* Interactive glow zones that connect background lines to UI elements */}
      
      {/* Hero canvas area glow */}
      <motion.div
        className="absolute top-1/2 left-3/4 w-[400px] h-[400px] rounded-full"
        style={{
          background: `
            radial-gradient(circle at center,
              rgba(245, 158, 11, 0.15) 0%,
              rgba(251, 191, 36, 0.08) 30%,
              transparent 70%
            )
          `,
          filter: 'blur(30px)',
          x: useTransform(springX, [-20, 20], [-10, 10]),
          y: useTransform(springY, [-20, 20], [-10, 10]),
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Connection lines to UI elements */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="connectGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0" />
            <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </linearGradient>
          <filter id="connectGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Lines that connect to hero area */}
        <motion.line
          x1="20%"
          y1="30%"
          x2="70%"
          y2="50%"
          stroke="url(#connectGradient1)"
          strokeWidth="1"
          filter="url(#connectGlow)"
          opacity={0.5}
          animate={{
            pathLength: [0, 1],
            opacity: [0, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            x: useTransform(springX, [-20, 20], [-5, 5]),
            y: useTransform(springY, [-20, 20], [-5, 5]),
          }}
        />
        
        <motion.line
          x1="80%"
          y1="20%"
          x2="65%"
          y2="45%"
          stroke="url(#connectGradient1)"
          strokeWidth="1"
          filter="url(#connectGlow)"
          opacity={0.4}
          animate={{
            pathLength: [0, 1],
            opacity: [0, 0.4, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            delay: 1,
            ease: 'easeInOut',
          }}
          style={{
            x: useTransform(springX, [-20, 20], [-3, 3]),
            y: useTransform(springY, [-20, 20], [-3, 3]),
          }}
        />
        
        {/* Pulsing connection points */}
        {[...Array(4)].map((_, i) => (
          <motion.circle
            key={`connect-point-${i}`}
            cx={`${30 + i * 15}%`}
            cy={`${40 + i * 5}%`}
            r="2"
            fill="#F59E0B"
            opacity={0.6}
            filter="url(#connectGlow)"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeInOut',
            }}
          />
        ))}
        
        {/* Interactive zones near UI elements */}
        <motion.rect
          x="15%"
          y="35%"
          width="30%"
          height="20%"
          fill="rgba(245, 158, 11, 0.05)"
          filter="blur(20px)"
          animate={{
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            x: useTransform(springX, [-20, 20], [-8, 8]),
            y: useTransform(springY, [-20, 20], [-8, 8]),
          }}
        />
      </svg>
      
      {/* Floating connection particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`connect-particle-${i}`}
          className="absolute w-1 h-1 rounded-full bg-amber-500/40"
          style={{
            left: `${25 + i * 8}%`,
            top: `${35 + i * 4}%`,
            filter: 'blur(1px)',
          }}
          animate={{
            x: [0, 20 - i * 5],
            y: [0, -10 - i * 2],
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
