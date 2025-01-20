import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const blink = keyframes`
  0%, 45%, 55%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(0.1); }
`;

const BatonContainer = styled(motion.div)`
  position: relative;
  width: 200px;
  height: 200px;
  animation: ${bounce} 2s ease-in-out infinite;
`;

const BatonBody = styled.div<{ rarity: string }>`
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #FFE5B4, #FFD700);
  border-radius: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  border: 3px solid ${props => {
    switch (props.rarity) {
      case 'legendary': return '#FFD700';
      case 'epic': return '#FF44FF';
      case 'rare': return '#4444FF';
      default: return '#8B4513';
    }
  }};
`;

const Face = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Eyes = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
`;

const Eye = styled.div`
  width: 12px;
  height: 20px;
  background: #000;
  border-radius: 50%;
  animation: ${blink} 3s infinite;
`;

const Mouth = styled.div<{ happy?: boolean }>`
  width: ${props => props.happy ? '30px' : '20px'};
  height: ${props => props.happy ? '20px' : '10px'};
  border: 3px solid #000;
  border-radius: ${props => props.happy ? '0 0 30px 30px' : '30px'};
  border-top: ${props => props.happy ? 'none' : '3px solid #000'};
`;

const Blush = styled.div`
  position: absolute;
  width: 15px;
  height: 8px;
  background: rgba(255, 150, 150, 0.4);
  border-radius: 50%;
  
  &.left {
    left: -20px;
    top: 15px;
  }
  
  &.right {
    right: -20px;
    top: 15px;
  }
`;

const Sparkles = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const Sparkle = styled(motion.div)`
  position: absolute;
  width: 10px;
  height: 10px;
  background: #FFD700;
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
`;

interface AnimatedBatonProps {
  rarity: string;
  isHappy?: boolean;
  onClick?: () => void;
}

const AnimatedBaton: React.FC<AnimatedBatonProps> = ({
  rarity = 'common',
  isHappy = false,
  onClick
}) => {
  return (
    <BatonContainer
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <BatonBody rarity={rarity}>
        <Face>
          <Eyes>
            <Eye />
            <Eye />
          </Eyes>
          <Mouth happy={isHappy} />
          <Blush className="left" />
          <Blush className="right" />
        </Face>
      </BatonBody>
      <Sparkles>
        {rarity !== 'common' && Array.from({ length: 5 }).map((_, i) => (
          <Sparkle
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: Math.random() * 200,
              y: Math.random() * 200,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4,
            }}
          />
        ))}
      </Sparkles>
    </BatonContainer>
  );
};

export default AnimatedBaton; 