import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const AchievementsContainer = styled.div`
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

const CategoryTabs = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const CategoryTab = styled(motion.button)<{ active: boolean }>`
  background: ${props => props.active ? '#ffd700' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.active ? '#1a1a1a' : '#ffd700'};
  border: 2px solid #ffd700;
  border-radius: 10px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: bold;
`;

const AchievementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 10px;
`;

const AchievementCard = styled(motion.div)<{ completed: boolean }>`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 15px;
  border: 2px solid ${props => props.completed ? '#ffd700' : 'rgba(255, 255, 255, 0.2)'};
  opacity: ${props => props.completed ? 1 : 0.7};
`;

const AchievementIcon = styled.div`
  width: 50px;
  height: 50px;
  background: rgba(255, 215, 0, 0.2);
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 10px;
`;

const AchievementTitle = styled.h3`
  margin: 0;
  color: #ffd700;
  font-size: 1.1rem;
`;

const AchievementDescription = styled.p`
  margin: 5px 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
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
    background: #ffd700;
    transition: width 0.3s ease;
  }
`;

interface Achievement {
  id: string;
  category: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  completed: boolean;
}

const Achievements: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = React.useState('progress');
  const [achievements, setAchievements] = React.useState<Achievement[]>([]);

  // TODO: Заменить на реальные данные
  React.useEffect(() => {
    const mockAchievements: Achievement[] = [
      {
        id: '1',
        category: 'progress',
        title: 'Начинающий пекарь',
        description: 'Заработайте 1,000 батонов',
        icon: '🥖',
        progress: 750,
        target: 1000,
        completed: false
      },
      {
        id: '2',
        category: 'progress',
        title: 'Мастер выпечки',
        description: 'Заработайте 1,000,000 батонов',
        icon: '👨‍🍳',
        progress: 1000000,
        target: 1000000,
        completed: true
      },
      {
        id: '3',
        category: 'collection',
        title: 'Коллекционер',
        description: 'Соберите 5 разных скинов',
        icon: '🎨',
        progress: 3,
        target: 5,
        completed: false
      },
      {
        id: '4',
        category: 'social',
        title: 'Социальная бабочка',
        description: 'Пригласите 3 друзей',
        icon: '🦋',
        progress: 2,
        target: 3,
        completed: false
      }
    ];
    setAchievements(mockAchievements);
  }, []);

  const categories = [
    { id: 'progress', name: 'Прогресс' },
    { id: 'collection', name: 'Коллекция' },
    { id: 'social', name: 'Социальные' },
    { id: 'league', name: 'Лиги' }
  ];

  const filteredAchievements = achievements.filter(
    achievement => achievement.category === selectedCategory
  );

  return (
    <AchievementsContainer>
      <SectionTitle>Достижения</SectionTitle>
      
      <CategoryTabs>
        {categories.map((category) => (
          <CategoryTab
            key={category.id}
            active={selectedCategory === category.id}
            onClick={() => setSelectedCategory(category.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category.name}
          </CategoryTab>
        ))}
      </CategoryTabs>

      <AchievementsGrid>
        {filteredAchievements.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            completed={achievement.completed}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AchievementIcon>{achievement.icon}</AchievementIcon>
            <AchievementTitle>{achievement.title}</AchievementTitle>
            <AchievementDescription>{achievement.description}</AchievementDescription>
            {!achievement.completed && (
              <ProgressBar
                progress={(achievement.progress / achievement.target) * 100}
              />
            )}
          </AchievementCard>
        ))}
      </AchievementsGrid>
    </AchievementsContainer>
  );
};

export default Achievements; 