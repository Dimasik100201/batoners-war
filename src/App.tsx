import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, HTMLMotionProps, AnimatePresence } from 'framer-motion';
import { useGameStore } from './store/gameStore';
import { Card } from './components/Card';
import { CardShop } from './components/CardShop';
import { telegram } from './utils/telegram';
import PassiveCards from './components/PassiveCards';
import SkinShop from './components/SkinShop';
import Leaderboard from './components/Leaderboard';
import Achievements from './components/Achievements';
import { ParticleManager } from './components/ParticleEffect';
import Notifications, { useNotifications } from './components/Notifications';
import { FloatingNumberManager } from './components/FloatingNumber';
import Tutorial, { useTutorial } from './components/Tutorial';
import AnimatedBaton from './components/AnimatedBaton';
import { useTelegram } from './hooks/useTelegram';

const shine = keyframes`
  0% {
    background-position: -100% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
`;

const sparkle = keyframes`
  0%, 100% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1); opacity: 1; }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  color: #ffd700;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  padding-bottom: env(safe-area-inset-bottom);
`;

const Navigation = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  padding: 10px;
  display: flex;
  justify-content: space-around;
  z-index: 1000;
  padding-bottom: calc(10px + env(safe-area-inset-bottom));
`;

const NavButton = styled(motion.button)<{ active: boolean }>`
  background: none;
  border: none;
  color: ${props => props.active ? '#ffd700' : 'rgba(255, 255, 255, 0.6)'};
  font-size: 24px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;

  span {
    font-size: 12px;
  }
`;

const GlassCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 20px;
  margin: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const BatonWrapper = styled(motion.div)`
  cursor: pointer;
  user-select: none;
  padding: 20px;
`;

const StatsContainer = styled(GlassCard)`
  width: 90%;
  max-width: 400px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2rem;
  font-weight: bold;
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  max-width: 800px;
  width: 100%;
  margin: 20px 0;
`;

const Sparkle = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  background: #FFD700;
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  animation: ${sparkle} 1s ease-in-out infinite;
  pointer-events: none;
`;

type MotionDivProps = HTMLMotionProps<"div">;

const MotionDiv = styled(motion.div)<MotionDivProps>``;

const ContentContainer = styled(motion.div)`
  width: 100%;
  margin-bottom: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const tutorialSteps = [
  {
    id: 'welcome',
    title: 'Добро пожаловать в Batoners War!',
    description: 'Давайте я покажу вам, как играть в эту увлекательную игру.'
  },
  {
    id: 'click',
    title: 'Кликайте на батон',
    description: 'Нажимайте на батон, чтобы получать очки. Чем больше кликаете, тем больше батонов!',
    targetElement: '.baton-button',
    highlightSize: 250
  },
  {
    id: 'passive',
    title: 'Пассивный доход',
    description: 'Приобретайте карточки для получения пассивного дохода. Они будут приносить батоны даже когда вы не играете!',
    targetElement: '.passive-cards',
    highlightSize: 300
  },
  {
    id: 'shop',
    title: 'Магазин скинов',
    description: 'Зарабатывайте батоны и покупайте уникальные скины для вашего батона!',
    targetElement: '.nav-shop',
    highlightSize: 100
  },
  {
    id: 'achievements',
    title: 'Достижения',
    description: 'Выполняйте достижения, чтобы получать награды и открывать новые возможности!',
    targetElement: '.nav-achievements',
    highlightSize: 100
  }
];

const LoadingScreen = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-size: 1.5em;
  color: #2c3e50;
  gap: 20px;
`;

const App: React.FC = () => {
  const telegram = useTelegram();
  const {
    initialize,
    isInitialized,
    batons,
    batonsPerClick,
    passiveIncome,
    currentSkin,
    addBatons,
    cards,
    buyCard,
    collectCard
  } = useGameStore();
  const [activeTab, setActiveTab] = React.useState('game');
  const { notifications, addNotification, removeNotification } = useNotifications();
  const { showTutorial, completedTutorial, startTutorial, completeTutorial } = useTutorial();
  const [isHappy, setIsHappy] = React.useState(false);

  useEffect(() => {
    if (telegram.user) {
      initialize(telegram.user.id.toString(), telegram.user.username || 'unknown');
    }
  }, [telegram.user, initialize]);

  // Запускаем обучение при первом входе
  React.useEffect(() => {
    if (!completedTutorial) {
      startTutorial();
    }
  }, [completedTutorial, startTutorial]);

  // Отслеживаем достижения
  React.useEffect(() => {
    // Примеры достижений
    if (batons >= 1000 && !localStorage.getItem('achievement_1000')) {
      localStorage.setItem('achievement_1000', 'true');
      addNotification({
        type: 'achievement',
        title: 'Достижение разблокировано!',
        message: 'Начинающий пекарь: заработано 1,000 батонов'
      });
    }

    if (batons >= 1000000 && !localStorage.getItem('achievement_1000000')) {
      localStorage.setItem('achievement_1000000', 'true');
      addNotification({
        type: 'achievement',
        title: 'Достижение разблокировано!',
        message: 'Мастер выпечки: заработан 1,000,000 батонов'
      });
    }
  }, [batons, addNotification]);

  const handleClick = () => {
    addBatons(batonsPerClick);
    setIsHappy(true);
    setTimeout(() => setIsHappy(false), 500);
  };

  const handleBuyCard = (templateId: string) => {
    buyCard(templateId);
    telegram.hapticFeedback.notificationOccurred('success');
  };

  const handleCollectCard = (cardId: string) => {
    collectCard(cardId);
    telegram.hapticFeedback.impactOccurred('medium');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'game':
        return (
          <>
            <StatsContainer>
              <div>🥖 {batons.toFixed(0)} батонов</div>
              <div>💪 {batonsPerClick} за клик</div>
              <div>⏰ Пассивный доход: {passiveIncome}/сек</div>
            </StatsContainer>

            <ParticleManager>
              <FloatingNumberManager onNumber={addBatons}>
                <BatonWrapper className="baton-button">
                  <AnimatedBaton
                    rarity={currentSkin}
                    isHappy={isHappy}
                    onClick={handleClick}
                  />
                </BatonWrapper>
              </FloatingNumberManager>
            </ParticleManager>

            <CardsContainer>
              {cards.map((card) => (
                <Card
                  key={card.id}
                  card={card}
                  onCollect={() => handleCollectCard(card.id)}
                />
              ))}
            </CardsContainer>

            <div className="passive-cards">
              <PassiveCards />
            </div>
          </>
        );
      case 'shop':
        return <SkinShop />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'achievements':
        return <Achievements />;
      default:
        return null;
    }
  };

  if (!isInitialized) {
    return (
      <LoadingScreen>
        <AnimatedBaton rarity="common" isHappy={false} />
        <div>Загрузка...</div>
      </LoadingScreen>
    );
  }

  return (
    <AppContainer>
      <Notifications
        notifications={notifications}
        onRemove={removeNotification}
      />

      {showTutorial && (
        <Tutorial
          steps={tutorialSteps}
          onComplete={completeTutorial}
        />
      )}

      <AnimatePresence mode="wait">
        <ContentContainer
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {renderContent()}
        </ContentContainer>
      </AnimatePresence>

      <Navigation>
        <NavButton
          active={activeTab === 'game'}
          onClick={() => setActiveTab('game')}
          whileTap={{ scale: 0.9 }}
        >
          🥖
          <span>Игра</span>
        </NavButton>
        <NavButton
          className="nav-shop"
          active={activeTab === 'shop'}
          onClick={() => setActiveTab('shop')}
          whileTap={{ scale: 0.9 }}
        >
          🎨
          <span>Магазин</span>
        </NavButton>
        <NavButton
          active={activeTab === 'leaderboard'}
          onClick={() => setActiveTab('leaderboard')}
          whileTap={{ scale: 0.9 }}
        >
          🏆
          <span>Рейтинг</span>
        </NavButton>
        <NavButton
          className="nav-achievements"
          active={activeTab === 'achievements'}
          onClick={() => setActiveTab('achievements')}
          whileTap={{ scale: 0.9 }}
        >
          ⭐
          <span>Достижения</span>
        </NavButton>
      </Navigation>
    </AppContainer>
  );
};

export default App; 