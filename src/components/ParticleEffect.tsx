import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const ParticleContainer = styled(motion.div)`
  position: absolute;
  pointer-events: none;
  width: 100%;
  height: 100%;
`;

const Particle = styled(motion.div)`
  position: absolute;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  pointer-events: none;
`;

interface ParticleEffectProps {
  x: number;
  y: number;
  amount: number;
}

const ParticleEffect: React.FC<ParticleEffectProps> = ({ x, y, amount }) => {
  const particles = React.useMemo(() => {
    return Array.from({ length: amount }, (_, i) => ({
      id: i,
      angle: (360 / amount) * i + Math.random() * 30 - 15,
      distance: 100 + Math.random() * 50,
      emoji: ['🥖', '✨', '💫'][Math.floor(Math.random() * 3)]
    }));
  }, [amount]);

  return (
    <AnimatePresence>
      <ParticleContainer
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {particles.map((particle) => {
          const angleInRadians = (particle.angle * Math.PI) / 180;
          const targetX = Math.cos(angleInRadians) * particle.distance;
          const targetY = Math.sin(angleInRadians) * particle.distance;

          return (
            <Particle
              key={particle.id}
              initial={{
                x,
                y,
                scale: 1,
                opacity: 1
              }}
              animate={{
                x: x + targetX,
                y: y + targetY,
                scale: 0,
                opacity: 0
              }}
              transition={{
                duration: 0.5,
                ease: 'easeOut'
              }}
            >
              {particle.emoji}
            </Particle>
          );
        })}
      </ParticleContainer>
    </AnimatePresence>
  );
};

interface ParticleManagerProps {
  children: React.ReactNode;
}

export const ParticleManager: React.FC<ParticleManagerProps> = ({ children }) => {
  const [particles, setParticles] = React.useState<Array<{
    id: number;
    x: number;
    y: number;
  }>>([]);
  const nextId = React.useRef(0);

  const addParticleEffect = (x: number, y: number) => {
    const id = nextId.current++;
    setParticles(prev => [...prev, { id, x, y }]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== id));
    }, 1000);
  };

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    addParticleEffect(
      e.clientX - rect.left,
      e.clientY - rect.top
    );
  };

  return (
    <div onClick={handleClick} style={{ position: 'relative' }}>
      {children}
      {particles.map(particle => (
        <ParticleEffect
          key={particle.id}
          x={particle.x}
          y={particle.y}
          amount={8}
        />
      ))}
    </div>
  );
}; 