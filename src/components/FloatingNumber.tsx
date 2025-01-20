import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingText = styled(motion.div)`
  position: absolute;
  pointer-events: none;
  font-weight: bold;
  color: #ffd700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  font-size: 24px;
  white-space: nowrap;
`;

interface FloatingNumber {
  id: string;
  value: number;
  x: number;
  y: number;
}

interface FloatingNumbersProps {
  numbers: FloatingNumber[];
}

const FloatingNumbers: React.FC<FloatingNumbersProps> = ({ numbers }) => {
  return (
    <AnimatePresence>
      {numbers.map((number) => (
        <FloatingText
          key={number.id}
          initial={{
            opacity: 0,
            scale: 0.5,
            x: number.x,
            y: number.y
          }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1.2, 1, 0.8],
            y: number.y - 100,
            x: number.x + (Math.random() * 40 - 20)
          }}
          transition={{
            duration: 1,
            ease: 'easeOut'
          }}
        >
          +{number.value.toLocaleString()}
        </FloatingText>
      ))}
    </AnimatePresence>
  );
};

interface FloatingNumberManagerProps {
  children: React.ReactNode;
  onNumber: (value: number) => void;
}

export const FloatingNumberManager: React.FC<FloatingNumberManagerProps> = ({
  children,
  onNumber
}) => {
  const [numbers, setNumbers] = React.useState<FloatingNumber[]>([]);
  const nextId = React.useRef(0);

  const addNumber = (value: number, x: number, y: number) => {
    const id = `number-${nextId.current++}`;
    setNumbers(prev => [...prev, { id, value, x, y }]);

    // Вызываем callback
    onNumber(value);

    // Удаляем число через 1 секунду
    setTimeout(() => {
      setNumbers(prev => prev.filter(n => n.id !== id));
    }, 1000);
  };

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    addNumber(1, x, y);
  };

  return (
    <div onClick={handleClick} style={{ position: 'relative' }}>
      {children}
      <FloatingNumbers numbers={numbers} />
    </div>
  );
};

export default FloatingNumbers; 