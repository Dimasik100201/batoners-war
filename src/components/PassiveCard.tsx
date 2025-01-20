import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const CardContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 15px;
  width: 150px;
  margin: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
`;

const CardTitle = styled.h3`
  margin: 0;
  color: #ffd700;
  font-size: 1.2rem;
  text-align: center;
`;

const CardStats = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  margin: 10px 0;
  width: 100%;
`;

const ProgressBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.progress}%;
    background: #ffd700;
    transition: width 0.3s ease;
  }
`;

const UpgradeButton = styled(motion.button)`
  background: #ffd700;
  color: #1a1a1a;
  border: none;
  border-radius: 10px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: bold;
  width: 100%;
  margin-top: 10px;

  &:disabled {
    background: #666;
    cursor: not-allowed;
  }
`;

interface PassiveCardProps {
  id: string;
  name: string;
  level: number;
  passiveIncome: number;
  cooldown: number;
  lastCollected: number;
  onUpgrade: (id: string) => void;
}

const PassiveCard: React.FC<PassiveCardProps> = ({
  id,
  name,
  level,
  passiveIncome,
  cooldown,
  lastCollected,
  onUpgrade,
}) => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const updateProgress = () => {
      const now = Date.now();
      const timePassed = now - lastCollected;
      const newProgress = Math.min((timePassed / (cooldown * 1000)) * 100, 100);
      setProgress(newProgress);
    };

    updateProgress();
    const interval = setInterval(updateProgress, 100);
    return () => clearInterval(interval);
  }, [lastCollected, cooldown]);

  return (
    <CardContainer
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <CardTitle>{name}</CardTitle>
      <CardStats>
        <div>Уровень: {level}</div>
        <div>💰 {passiveIncome.toFixed(1)}/сек</div>
        <ProgressBar progress={progress} />
      </CardStats>
      <UpgradeButton
        whileTap={{ scale: 0.95 }}
        onClick={() => onUpgrade(id)}
      >
        Улучшить
      </UpgradeButton>
    </CardContainer>
  );
};

export default PassiveCard; 