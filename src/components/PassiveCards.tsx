import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import PassiveCard from './PassiveCard';

const CardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  color: #ffd700;
  text-align: center;
  margin: 20px 0;
  font-size: 1.5rem;
`;

const PassiveCards: React.FC = () => {
  const { cards, upgradeCard } = useGameStore();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <>
      <SectionTitle>Пассивный Доход</SectionTitle>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <CardsContainer>
          {cards.map((card) => (
            <motion.div key={card.id} variants={cardVariants}>
              <PassiveCard
                {...card}
                onUpgrade={upgradeCard}
              />
            </motion.div>
          ))}
        </CardsContainer>
      </motion.div>
    </>
  );
};

export default PassiveCards; 