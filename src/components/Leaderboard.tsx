import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const LeaderboardContainer = styled.div`
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

const LeagueSelector = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const LeagueButton = styled(motion.button)<{ active: boolean }>`
  background: ${props => props.active ? '#ffd700' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.active ? '#1a1a1a' : '#ffd700'};
  border: 2px solid #ffd700;
  border-radius: 10px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: bold;
`;

const Table = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 2fr 1fr;
  padding: 15px;
  background: rgba(255, 215, 0, 0.2);
  font-weight: bold;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const TableRow = styled(motion.div)`
  display: grid;
  grid-template-columns: 0.5fr 2fr 1fr;
  padding: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const Position = styled.div<{ top3?: boolean }>`
  font-weight: bold;
  color: ${props => props.top3 ? '#ffd700' : 'inherit'};
`;

const PlayerName = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Score = styled.div`
  text-align: right;
`;

interface Player {
  id: string;
  name: string;
  score: number;
  league: string;
}

const Leaderboard: React.FC = () => {
  const [selectedLeague, setSelectedLeague] = React.useState<string>('bronze');
  const [players, setPlayers] = React.useState<Player[]>([]);

  // TODO: Заменить на реальные данные с сервера
  React.useEffect(() => {
    // Имитация загрузки данных
    const mockPlayers: Player[] = [
      { id: '1', name: 'Игрок 1', score: 1000000, league: 'bronze' },
      { id: '2', name: 'Игрок 2', score: 800000, league: 'bronze' },
      { id: '3', name: 'Игрок 3', score: 600000, league: 'bronze' },
      { id: '4', name: 'Игрок 4', score: 400000, league: 'bronze' },
      { id: '5', name: 'Игрок 5', score: 200000, league: 'bronze' },
    ];
    setPlayers(mockPlayers);
  }, [selectedLeague]);

  const leagues = [
    { id: 'bronze', name: 'Бронза' },
    { id: 'silver', name: 'Серебро' },
    { id: 'gold', name: 'Золото' },
    { id: 'platinum', name: 'Платина' },
    { id: 'diamond', name: 'Алмаз' },
    { id: 'master', name: 'Мастер' },
  ];

  return (
    <LeaderboardContainer>
      <SectionTitle>Таблица Лидеров</SectionTitle>
      
      <LeagueSelector>
        {leagues.map((league) => (
          <LeagueButton
            key={league.id}
            active={selectedLeague === league.id}
            onClick={() => setSelectedLeague(league.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {league.name}
          </LeagueButton>
        ))}
      </LeagueSelector>

      <Table>
        <TableHeader>
          <div>#</div>
          <div>Игрок</div>
          <div>Счёт</div>
        </TableHeader>
        {players.map((player, index) => (
          <TableRow
            key={player.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Position top3={index < 3}>{index + 1}</Position>
            <PlayerName>{player.name}</PlayerName>
            <Score>{player.score.toLocaleString()}</Score>
          </TableRow>
        ))}
      </Table>
    </LeaderboardContainer>
  );
};

export default Leaderboard; 