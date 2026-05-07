import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function MagneticButton({ children, className = '', onClick }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springX = useSpring(mouseX, { stiffness: 150, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current || !isHovered) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = rect.width / 2;
    
    if (distance < maxDistance) {
      const strength = (maxDistance - distance) / maxDistance;
      mouseX.set(deltaX * strength * 0.3);
      mouseY.set(deltaY * strength * 0.3);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const buttonScale = useTransform(
    [springX, springY],
    ([x, y]) => {
      const numX = x as number;
      const numY = y as number;
      return 1 + Math.sqrt(numX * numX + numY * numY) * 0.001;
    }
  );

  return (
    <motion.button
      ref={ref}
      className={`relative ${className}`}
      style={{
        x: springX,
        y: springY,
        scale: buttonScale,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      {children}
    </motion.button>
  );
}
