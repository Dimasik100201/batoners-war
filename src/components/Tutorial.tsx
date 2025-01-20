import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const TutorialOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const TutorialCard = styled(motion.div)`
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  max-width: 80%;
  width: 400px;
  border: 2px solid #ffd700;
  color: white;
  text-align: center;
`;

const Title = styled.h2`
  color: #ffd700;
  margin: 0 0 20px 0;
  font-size: 1.5rem;
`;

const Description = styled.p`
  margin: 0 0 20px 0;
  font-size: 1.1rem;
  line-height: 1.5;
`;

const Button = styled(motion.button)`
  background: #ffd700;
  color: #1a1a1a;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  margin: 0 10px;
`;

const Highlight = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  border: 2px solid #ffd700;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.7);
  pointer-events: none;
`;

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  targetElement?: string;
  highlightSize?: number;
}

interface TutorialProps {
  steps: TutorialStep[];
  onComplete: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ steps, onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);
  const [highlightPosition, setHighlightPosition] = React.useState({ x: 0, y: 0 });

  const currentStep = steps[currentStepIndex];

  React.useEffect(() => {
    if (currentStep.targetElement) {
      const element = document.querySelector(currentStep.targetElement);
      if (element) {
        const rect = element.getBoundingClientRect();
        setHighlightPosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        });
      }
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <AnimatePresence>
      <TutorialOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {currentStep.targetElement && (
          <Highlight
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              left: highlightPosition.x,
              top: highlightPosition.y,
              width: currentStep.highlightSize || 200,
              height: currentStep.highlightSize || 200,
              transform: `translate(-50%, -50%)`
            }}
          />
        )}

        <TutorialCard
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <Title>{currentStep.title}</Title>
          <Description>{currentStep.description}</Description>
          <div>
            <Button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
            >
              {currentStepIndex < steps.length - 1 ? 'Далее' : 'Завершить'}
            </Button>
            {currentStepIndex < steps.length - 1 && (
              <Button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSkip}
                style={{ background: 'transparent', color: '#ffd700' }}
              >
                Пропустить
              </Button>
            )}
          </div>
        </TutorialCard>
      </TutorialOverlay>
    </AnimatePresence>
  );
};

// Хук для управления обучением
export const useTutorial = () => {
  const [showTutorial, setShowTutorial] = React.useState(false);
  const [completedTutorial, setCompletedTutorial] = React.useState(
    () => localStorage.getItem('tutorial_completed') === 'true'
  );

  const startTutorial = () => {
    setShowTutorial(true);
  };

  const completeTutorial = () => {
    setShowTutorial(false);
    setCompletedTutorial(true);
    localStorage.setItem('tutorial_completed', 'true');
  };

  return {
    showTutorial,
    completedTutorial,
    startTutorial,
    completeTutorial
  };
};

export default Tutorial; 