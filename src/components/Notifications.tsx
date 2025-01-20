import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
`;

const NotificationCard = styled(motion.div)`
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 15px;
  color: #ffffff;
  border: 2px solid #ffd700;
  min-width: 250px;
  max-width: 300px;
  display: flex;
  align-items: center;
  gap: 10px;
  pointer-events: auto;
`;

const Icon = styled.div`
  font-size: 24px;
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  flex: 1;
`;

const Title = styled.div`
  font-weight: bold;
  color: #ffd700;
  margin-bottom: 4px;
`;

const Message = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
`;

export interface Notification {
  id: string;
  type: 'achievement' | 'reward' | 'info';
  title: string;
  message: string;
  icon?: string;
}

interface NotificationsProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

const getIcon = (type: Notification['type'], customIcon?: string) => {
  if (customIcon) return customIcon;
  switch (type) {
    case 'achievement':
      return '⭐';
    case 'reward':
      return '🎁';
    case 'info':
      return 'ℹ️';
    default:
      return '📢';
  }
};

const Notifications: React.FC<NotificationsProps> = ({
  notifications,
  onRemove
}) => {
  return (
    <NotificationContainer>
      <AnimatePresence>
        {notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 40
            }}
            onClick={() => onRemove(notification.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Icon>{getIcon(notification.type, notification.icon)}</Icon>
            <Content>
              <Title>{notification.title}</Title>
              <Message>{notification.message}</Message>
            </Content>
          </NotificationCard>
        ))}
      </AnimatePresence>
    </NotificationContainer>
  );
};

// Хук для управления уведомлениями
export const useNotifications = () => {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = { ...notification, id };
    setNotifications(prev => [...prev, newNotification]);

    // Автоматически удаляем уведомление через 5 секунд
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return {
    notifications,
    addNotification,
    removeNotification
  };
};

export default Notifications; 