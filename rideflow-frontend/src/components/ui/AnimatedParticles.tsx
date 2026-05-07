import { motion } from 'framer-motion';

export function AnimatedParticles() {
  const particles = [...Array(25)].map((_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
    pathX: Math.random() * 100 - 50,
    pathY: Math.random() * 100 - 50,
    opacity: Math.random() * 0.4 + 0.1, // Reduced for softer texture
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Enhanced texture particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.id % 3 === 0 ? '#F59E0B' : '#FFFEF9',
            boxShadow: `0 0 ${particle.size * 1.5}px ${particle.id % 3 === 0 ? '#F59E0B' : '#FFFEF9'}`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: particle.opacity,
            filter: 'blur(0.5px)', // Softer texture
          }}
          animate={{
            x: [0, particle.pathX, 0],
            y: [0, particle.pathY - 20, 0],
            opacity: [0, particle.opacity, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
      
      {/* Floating dust motes */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`dust-${i}`}
          className="absolute w-0.5 h-0.5 rounded-full bg-soft-gold/20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            filter: 'blur(0.3px)',
          }}
          animate={{
            x: [0, Math.random() * 30 - 15],
            y: [0, -Math.random() * 40 - 15],
            opacity: [0, 0.2, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: 'easeInOut',
          }}
        />
      ))}
      
      {/* Slow-moving light orbs */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(245, 158, 11, 0.6) 0%, rgba(251, 191, 36, 0.3) 50%, transparent 70%)`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            filter: 'blur(0.8px)',
          }}
          animate={{
            x: [0, 80 - Math.random() * 160],
            y: [0, -40 - Math.random() * 80],
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.4, 0.15],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
