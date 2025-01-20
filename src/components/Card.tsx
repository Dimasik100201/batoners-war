import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Card as CardType } from '../types/cards';

const glowAnimation = keyframes`
  0%, 100% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.3); }
  50% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.6); }
`;

const progressAnimation = keyframes`
  from { width: 0%; }
  to { width: 100%; }
`;

interface CardContainerProps {
  rarity: string;
  isReady: boolean;
}

const StyledCardContainer = styled.div<CardContainerProps>`
  width: 200px;
  padding: 20px;
  background: rgba(255, 255, 255, ${props => props.isReady ? '0.25' : '0.15'});
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 2px solid ${({ rarity }) => {
    switch (rarity) {
      case 'common': return 'rgba(255, 255, 255, 0.3)';
      case 'rare': return '#4CAF50';
      case 'epic': return '#9C27B0';
      case 'legendary': return '#FFD700';
      default: return 'rgba(255, 255, 255, 0.3)';
    }
  }};
  cursor: pointer;
  user-select: none;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  
  ${props => props.isReady && `
    animation: ${glowAnimation} 2s ease-in-out infinite;
  `}

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${({ rarity }) => {
      switch (rarity) {
        case 'common': return 'linear-gradient(90deg, #fff, rgba(255,255,255,0.5))';
        case 'rare': return 'linear-gradient(90deg, #4CAF50, #81C784)';
        case 'epic': return 'linear-gradient(90deg, #9C27B0, #BA68C8)';
        case 'legendary': return 'linear-gradient(90deg, #FFD700, #FDB347)';
        default: return 'linear-gradient(90deg, #fff, rgba(255,255,255,0.5))';
      }
    }};
  }
`;

const CardTitle = styled.h3`
  margin: 0 0 10px 0;
  color: #fff;
  font-size: 20px;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  background: linear-gradient(45deg, #FFD700, #FDB347);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const CardDescription = styled.p`
  margin: 0 0 15px 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  text-align: center;
  line-height: 1.4;
`;

const CardStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const StatItem = styled.div`
  text-align: center;
  
  .label {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 4px;
  }
  
  .value {
    font-size: 16px;
    color: #fff;
    font-weight: bold;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const ProgressBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  margin-top: 10px;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.progress}%;
    background: linear-gradient(90deg, #FFD700, #FDB347);
    animation: ${progressAnimation} ${props => props.progress === 0 ? 0 : 1}s ease-out;
  }
`;

interface CardProps {
  card: CardType;
  onCollect: () => void;
}

type MotionDivProps = HTMLMotionProps<"div">;

const MotionDiv = styled(motion.div)<MotionDivProps>``;

export const Card: React.FC<CardProps> = ({ card, onCollect }) => {
  const timeLeft = Math.max(0, card.cooldown - (Date.now() - card.lastCollected) / 1000);
  const isReady = timeLeft === 0;
  const progress = ((card.cooldown - timeLeft) / card.cooldown) * 100;

  return (
    <MotionDiv
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={isReady ? onCollect : undefined}
      animate={{
        y: isReady ? [0, -5, 0] : 0,
      }}
      transition={{
        y: {
          duration: 0.8,
          repeat: isReady ? Infinity : 0,
          repeatType: "reverse"
        }
      }}
    >
      <StyledCardContainer rarity={card.rarity} isReady={isReady}>
        <CardTitle>{card.name}</CardTitle>
        <CardDescription>{card.description}</CardDescription>
        
        <CardStats>
          <StatItem>
            <div className="label">Уровень</div>
            <div className="value">✨ {card.level}</div>
          </StatItem>
          <StatItem>
            <div className="label">Доход</div>
            <div className="value">🍞 {card.baseIncome * card.level}</div>
          </StatItem>
          <StatItem>
            <div className="label">Готовность</div>
            <div className="value">
              {isReady ? '✅' : `${Math.ceil(timeLeft)}с`}
            </div>
          </StatItem>
        </CardStats>

        {!isReady && <ProgressBar progress={progress} />}
      </StyledCardContainer>
    </MotionDiv>
  );
}; 