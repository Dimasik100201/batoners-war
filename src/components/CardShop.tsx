import React from 'react';
import styled from 'styled-components';
import { motion, HTMLMotionProps } from 'framer-motion';
import { CardTemplate } from '../types/cards';

const ShopContainer = styled.div`
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 15px;
  margin: 20px 0;
`;

const ShopTitle = styled.h2`
  color: #fff;
  text-align: center;
  margin-bottom: 20px;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

interface ShopCardProps {
  rarity: string;
}

const StyledShopCard = styled.div<ShopCardProps>`
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 2px solid ${({ rarity }) => {
    switch (rarity) {
      case 'common': return 'rgba(255, 255, 255, 0.2)';
      case 'rare': return '#4CAF50';
      case 'epic': return '#9C27B0';
      case 'legendary': return '#FFD700';
      default: return 'rgba(255, 255, 255, 0.2)';
    }
  }};
  cursor: pointer;
`;

const CardInfo = styled.div`
  text-align: center;
  margin-bottom: 15px;
  
  h3 {
    color: #fff;
    margin: 0 0 5px 0;
  }
  
  p {
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    margin: 0;
  }
`;

interface BuyButtonProps {
  canAfford: boolean;
  onClick: () => void;
}

const StyledBuyButton = styled.button<BuyButtonProps>`
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 8px;
  background: ${({ canAfford }) => canAfford ? '#FFD700' : '#666'};
  color: ${({ canAfford }) => canAfford ? '#000' : '#999'};
  font-weight: bold;
  cursor: ${({ canAfford }) => canAfford ? 'pointer' : 'not-allowed'};
  transition: all 0.2s ease;
`;

type MotionDivProps = HTMLMotionProps<"div">;

const MotionDiv = styled(motion.div)<MotionDivProps>``;

interface CardShopProps {
  templates: CardTemplate[];
  batons: number;
  onBuy: (templateId: string) => void;
}

export const CardShop: React.FC<CardShopProps> = ({ templates, batons, onBuy }) => {
  return (
    <ShopContainer>
      <ShopTitle>Магазин карточек</ShopTitle>
      <CardsGrid>
        {templates.map((template) => {
          const canAfford = batons >= template.cost;
          
          return (
            <MotionDiv
              key={template.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <StyledShopCard rarity={template.rarity}>
                <CardInfo>
                  <h3>{template.name}</h3>
                  <p>{template.description}</p>
                  <p>Базовый доход: 🍞 {template.baseIncome}/с</p>
                  <p>Перезарядка: {template.cooldown}с</p>
                </CardInfo>
                
                <MotionDiv
                  whileHover={canAfford ? { scale: 1.05 } : {}}
                  whileTap={canAfford ? { scale: 0.95 } : {}}
                >
                  <StyledBuyButton
                    canAfford={canAfford}
                    onClick={() => canAfford && onBuy(template.id)}
                  >
                    Купить за 🍞 {template.cost}
                  </StyledBuyButton>
                </MotionDiv>
              </StyledShopCard>
            </MotionDiv>
          );
        })}
      </CardsGrid>
    </ShopContainer>
  );
}; 