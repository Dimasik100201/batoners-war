import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import AnimatedBaton from './AnimatedBaton';

const ShopContainer = styled.div`
  width: 100%;
  max-width: 800px;
  padding: 20px;
`;

const SectionTitle = styled.h2`
  color: #ffd700;
  text-align: center;
  margin: 20px 0;
  font-size: 1.5rem;
`;

const SkinsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
`;

const SkinCard = styled(motion.div)<{ rarity: string }>`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  border: 2px solid ${props => {
    switch (props.rarity) {
      case 'legendary': return '#ffd700';
      case 'epic': return '#ff44ff';
      case 'rare': return '#4444ff';
      default: return '#ffffff';
    }
  }};
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
`;

const SkinPreview = styled.div`
  width: 150px;
  height: 150px;
  margin: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: scale(0.75);
`;

const SkinName = styled.h3`
  margin: 10px 0;
  color: #ffd700;
  text-align: center;
`;

const RarityBadge = styled.span<{ rarity: string }>`
  padding: 4px 8px;
  border-radius: 10px;
  font-size: 0.8rem;
  background: ${props => {
    switch (props.rarity) {
      case 'legendary': return 'linear-gradient(45deg, #ffd700, #ff8c00)';
      case 'epic': return 'linear-gradient(45deg, #ff44ff, #ff00ff)';
      case 'rare': return 'linear-gradient(45deg, #4444ff, #0000ff)';
      default: return 'linear-gradient(45deg, #ffffff, #cccccc)';
    }
  }};
  color: #ffffff;
  text-transform: uppercase;
  font-weight: bold;
`;

const ActionButton = styled(motion.button)<{ owned: boolean }>`
  background: ${props => props.owned ? '#666' : '#ffd700'};
  color: ${props => props.owned ? '#fff' : '#1a1a1a'};
  border: none;
  border-radius: 10px;
  padding: 8px 16px;
  cursor: ${props => props.owned ? 'default' : 'pointer'};
  font-weight: bold;
  width: 100%;
  margin-top: 10px;
`;

const Price = styled.div`
  font-size: 1.1rem;
  color: #ffd700;
  margin: 10px 0;
`;

interface SkinData {
  id: string;
  name: string;
  rarity: string;
  price: number;
  owned: boolean;
}

const defaultSkins: SkinData[] = [
  {
    id: 'common',
    name: 'Обычный батон',
    rarity: 'common',
    price: 0,
    owned: true
  },
  {
    id: 'rare',
    name: 'Французский багет',
    rarity: 'rare',
    price: 1000,
    owned: false
  },
  {
    id: 'epic',
    name: 'Радужный батон',
    rarity: 'epic',
    price: 10000,
    owned: false
  },
  {
    id: 'legendary',
    name: 'Золотой батон',
    rarity: 'legendary',
    price: 100000,
    owned: false
  }
];

const SkinShop: React.FC = () => {
  const { batons, skins, purchaseSkin, equipSkin, currentSkin } = useGameStore();
  const [hoveredSkin, setHoveredSkin] = React.useState<string | null>(null);

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

  const handlePurchase = (skin: SkinData) => {
    if (batons >= skin.price) {
      purchaseSkin(skin.id);
    }
  };

  return (
    <ShopContainer>
      <SectionTitle>Магазин Скинов</SectionTitle>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <SkinsGrid>
          {defaultSkins.map((skin) => (
            <motion.div key={skin.id} variants={cardVariants}>
              <SkinCard
                rarity={skin.rarity}
                onMouseEnter={() => setHoveredSkin(skin.id)}
                onMouseLeave={() => setHoveredSkin(null)}
              >
                <RarityBadge rarity={skin.rarity}>
                  {skin.rarity}
                </RarityBadge>
                <SkinPreview>
                  <AnimatedBaton
                    rarity={skin.rarity}
                    isHappy={hoveredSkin === skin.id}
                  />
                </SkinPreview>
                <SkinName>{skin.name}</SkinName>
                {!skin.owned && <Price>💰 {skin.price.toLocaleString()} батонов</Price>}
                {skin.owned ? (
                  <ActionButton
                    owned={true}
                    onClick={() => equipSkin(skin.id)}
                    whileTap={currentSkin !== skin.id ? { scale: 0.95 } : {}}
                  >
                    {currentSkin === skin.id ? 'Выбран' : 'Выбрать'}
                  </ActionButton>
                ) : (
                  <ActionButton
                    owned={false}
                    onClick={() => handlePurchase(skin)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={batons < skin.price}
                  >
                    {batons >= skin.price ? 'Купить' : 'Недостаточно батонов'}
                  </ActionButton>
                )}
              </SkinCard>
            </motion.div>
          ))}
        </SkinsGrid>
      </motion.div>
    </ShopContainer>
  );
};

export default SkinShop; 