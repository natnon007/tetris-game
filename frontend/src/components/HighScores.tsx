// src/components/HighScores.tsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getHighScores } from '../services/api';

const Container = styled.div`
  background: #1a1d23;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  width: 100%; // ให้ใช้ความกว้างเต็ม parent
  height: 250px; // กำหนดความสูงคงที่
  // margin-top: 1rem;
  overflow-y: auto; // เพิ่ม scroll เมื่อเนื้อหาเกิน
`;

const Title = styled.h3`
  margin: 0 0 0.75rem 0;
  color: #4CAF50;
  font-size: 1rem;
  text-align: center;
`;

const ScoreList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const PlayerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  overflow: hidden;
`;

const Flag = styled.img`
  width: 20px;
  height: 15px;
  border-radius: 2px;
  object-fit: cover;
`;

const ScoreItem = styled.div<{ $isNewScore?: boolean }>`
  display: grid;
  grid-template-columns: 2rem 1fr auto;
  gap: 0.5rem;
  padding: 0.5rem;
  background: ${props => props.$isNewScore ? 'rgba(76, 175, 80, 0.1)' : 'transparent'};
  border-radius: 4px;
  transition: background-color 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const Rank = styled.span`
  color: #888;
  font-weight: bold;
`;

const PlayerName = styled.span`
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Score = styled.span`
  color: #4CAF50;
  font-weight: bold;
`;

const LoadingText = styled.div`
  text-align: center;
  color: #888;
  padding: 1rem;
`;

const NoScoresText = styled.div`
  text-align: center;
  color: #888;
  padding: 1rem;
`;

interface Score {
  id: string;
  player_name: string;
  score: number;
  created_at: string;
  rank: number;
  country_code: string;
}

export const HighScores: React.FC = () => {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const data = await getHighScores();
        setScores(data);
      } catch (error) {
        console.error('Failed to fetch high scores:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
    const interval = setInterval(fetchScores, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Container>
        <Title>High Scores</Title>
        <LoadingText>Loading...</LoadingText>
      </Container>
    );
  }

  if (scores.length === 0) {
    return (
      <Container>
        <Title>High Scores</Title>
        <NoScoresText>No scores yet. Be the first!</NoScoresText>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Top 5 High Scores</Title>
      <ScoreList>
        {scores.map((score) => (
          <ScoreItem key={score.id}>
            <Rank>#{score.rank}</Rank>
            <PlayerInfo>
              <PlayerName title={score.player_name}>
                {score.player_name}
              </PlayerName>
              <Flag 
                src={`https://flagcdn.com/w40/${score.country_code.toLowerCase()}.png`}
                alt={score.country_code}
                title={score.country_code}
                onError={(e) => {
                  // ถ้าโหลดธงไม่สำเร็จ ใช้ธง UN แทน
                  (e.target as HTMLImageElement).src = 'https://flagcdn.com/w40/un.png';
                }}
              />
            </PlayerInfo>
            <Score>{score.score.toLocaleString()}</Score>
          </ScoreItem>
        ))}
      </ScoreList>
    </Container>
  );
};