import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function GeographicTextures() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.1, 0.3, 0.1]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  // Karachi street grid pattern (simplified)
  const karachiGrid = [
    { x: 10, y: 20, w: 80, h: 2 },
    { x: 30, y: 10, w: 2, h: 80 },
    { x: 50, y: 30, w: 2, h: 60 },
    { x: 70, y: 15, w: 2, h: 70 },
    { x: 15, y: 40, w: 70, h: 2 },
    { x: 25, y: 60, w: 60, h: 2 },
    { x: 20, y: 35, w: 2, h: 30 },
    { x: 60, y: 25, w: 2, h: 40 },
  ];

  // Lahore street grid pattern
  const lahoreGrid = [
    { x: 15, y: 15, w: 70, h: 2 },
    { x: 25, y: 25, w: 2, h: 70 },
    { x: 45, y: 10, w: 2, h: 80 },
    { x: 65, y: 20, w: 2, h: 65 },
    { x: 10, y: 35, w: 80, h: 2 },
    { x: 35, y: 50, w: 50, h: 2 },
    { x: 55, y: 70, w: 30, h: 2 },
  ];

  // Islamabad street grid pattern (more organized)
  const islamabadGrid = [
    { x: 20, y: 20, w: 60, h: 2 },
    { x: 20, y: 40, w: 60, h: 2 },
    { x: 20, y: 60, w: 60, h: 2 },
    { x: 20, y: 80, w: 60, h: 2 },
    { x: 30, y: 15, w: 2, h: 70 },
    { x: 50, y: 15, w: 2, h: 70 },
    { x: 70, y: 15, w: 2, h: 70 },
  ];

  const cities = [
    { name: 'karachi', grid: karachiGrid, opacity: 0.15 },
    { name: 'lahore', grid: lahoreGrid, opacity: 0.12 },
    { name: 'islamabad', grid: islamabadGrid, opacity: 0.1 },
  ];

  return (
    <div ref={ref} className="fixed inset-0 pointer-events-none overflow-hidden">
      <motion.div style={{ opacity, scale }}>
        {cities.map((city, cityIndex) => (
          <svg
            key={city.name}
            className="absolute inset-0 w-full h-full"
            style={{
              opacity: city.opacity,
              transform: `translateY(${cityIndex * 200}px)`,
            }}
          >
            {/* Street Grid */}
            {city.grid.map((line, lineIndex) => (
              <motion.rect
                key={`${city.name}-line-${lineIndex}`}
                x={`${line.x}%`}
                y={`${line.y}%`}
                width={`${line.w}%`}
                height={`${line.h}%`}
                fill="#E6D5B8"
                opacity={0.3}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1, 1], 
                  opacity: [0, 0.3, 0.3] 
                }}
                transition={{
                  duration: 2,
                  delay: cityIndex * 0.5 + lineIndex * 0.1,
                  ease: "easeOut",
                }}
              />
            ))}
            
            {/* Topographic contour lines */}
            {[...Array(5)].map((_, i) => (
              <motion.path
                key={`${city.name}-contour-${i}`}
                d={`M ${10 + i * 15} ${20 + i * 10} Q ${40 + i * 10} ${30 + i * 8} ${70 + i * 5} ${25 + i * 12}`}
                stroke="#E6D5B8"
                strokeWidth="0.5"
                fill="none"
                opacity={0.2}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: [0, 1], 
                  opacity: [0, 0.2] 
                }}
                transition={{
                  duration: 3,
                  delay: cityIndex * 0.5 + i * 0.3,
                  ease: "easeInOut",
                }}
              />
            ))}
            
            {/* Data points representing key locations */}
            {[...Array(8)].map((_, i) => (
              <motion.circle
                key={`${city.name}-point-${i}`}
                cx={`${15 + i * 10}%`}
                cy={`${25 + (i % 3) * 20}%`}
                r="1"
                fill="#F59E0B"
                opacity={0.4}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1, 1.5, 1], 
                  opacity: [0, 0.4, 0.6, 0.4] 
                }}
                transition={{
                  duration: 2,
                  delay: cityIndex * 0.5 + i * 0.2,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "easeInOut",
                }}
              />
            ))}
          </svg>
        ))}
        
        {/* Subtle city labels */}
        <div className="absolute top-10 left-10 text-[8px] text-soft-gold/20 font-mono tracking-widest uppercase">
          KARACHI
        </div>
        <div className="absolute top-1/2 left-1/4 text-[8px] text-soft-gold/15 font-mono tracking-widest uppercase">
          LAHORE
        </div>
        <div className="absolute bottom-20 right-20 text-[8px] text-soft-gold/10 font-mono tracking-widest uppercase">
          ISLAMABAD
        </div>
      </motion.div>
    </div>
  );
}
