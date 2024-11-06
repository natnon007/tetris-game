import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { GameBoard } from './components/GameBoard';
import { HighScores } from './components/HighScores';
import { ScoreModal } from './components/ScoreModal';
import { NextPiece } from './components/NextPiece';
import { useGameLogic } from './hooks/useGameLogic';

const Container = styled.div`
  display: flex;
  height: 100vh;
  padding: 1rem;
  background: #282c34;
  color: white;
  justify-content: center;
  gap: 2rem;
  align-items: center;
`;

const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 240px;
`;

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 240px;
`;

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #4CAF50;
  margin-bottom: 1rem;
  text-align: center;
`;

const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 240px;
`;

const Score = styled.div`
  font-size: 1.25rem;
  padding: 1rem;
  background: #1a1d23;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  
  h3 {
    margin: 0 0 0.5rem 0;
    color: #4CAF50;
    font-size: 1rem;
  }
`;

const Controls = styled.div`
  background: #1a1d23;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  
  h3 {
    margin: 0 0 0.75rem 0;
    color: #4CAF50;
    font-size: 1rem;
  }

  p {
    margin: 0.5rem 0;
    font-size: 0.9rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  kbd {
    background: #333;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-family: monospace;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background: #45a049;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }

  &:active {
    background: #3d8b40;
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const StatsPanel = styled.div`
  background: #1a1d23;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  
  h3 {
    margin: 0 0 0.75rem 0;
    color: #4CAF50;
    font-size: 1rem;
  }
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0.5rem 0;
  font-size: 0.9rem;
  
  span:first-child {
    color: #888;
  }

  span:last-child {
    font-weight: bold;
  }
`;

const StartButton = styled(Button)<{ $gameOver: boolean }>`
  ${props => props.$gameOver && `
    animation: pulse 2s infinite;
    @keyframes pulse {
      0% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
      }
      70% {
        transform: scale(1.05);
        box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
      }
      100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
      }
    }
  `}
`;

const App: React.FC = () => {
  const { 
    board, 
    score, 
    gameOver,
    isPaused,
    startGame,
    togglePause, 
    displayBoard, 
    linesCleared, 
    level,
    nextPiece
  } = useGameLogic();
  
  const [showScoreModal, setShowScoreModal] = useState(false);

  useEffect(() => {
    if (gameOver && score > 0) {
      setShowScoreModal(true);
    }
  }, [gameOver, score]);

  const handleScoreSubmitted = () => {
    setShowScoreModal(false);
  };

  return (
    <Container>
      <LeftPanel>
        <Button onClick={startGame} disabled={showScoreModal}>
          {gameOver ? "Start New Game" : "Restart Game"}
        </Button>
        
        {!gameOver && (
          <Button onClick={togglePause}>
            {isPaused ? "Resume Game" : "Pause Game"}
          </Button>
        )}
        
        <Score>
          <h3>Score</h3>
          {score.toLocaleString()}
        </Score>
        
        <StatsPanel>
          <h3>Statistics</h3>
          <StatItem>
            <span>Lines:</span>
            <span>{linesCleared}</span>
          </StatItem>
          <StatItem>
            <span>Level:</span>
            <span>{level}</span>
          </StatItem>
        </StatsPanel>

        <Controls>
          <h3>Controls</h3>
          <p>
            <span>Move Left/Right</span>
            <kbd>←</kbd> <kbd>→</kbd>
          </p>
          <p>
            <span>Soft Drop</span>
            <kbd>↓</kbd>
          </p>
          <p>
            <span>Rotate</span>
            <kbd>↑</kbd>
          </p>
          <p>
            <span>Hard Drop</span>
            <kbd>Space</kbd>
          </p>
          <p>
            <span>Pause Game</span>
            <kbd>Esc</kbd>
          </p>
        </Controls>
      </LeftPanel>

      <GameContainer>
        <Title>TETRIS</Title>
        {isPaused && (
          <PauseOverlay>
            <PauseText>PAUSED</PauseText>
            <SubText>Press ESC to resume</SubText>
          </PauseOverlay>
        )}
        <GameBoard board={displayBoard} />
      </GameContainer>

      <RightPanel>
        <NextPiece piece={nextPiece} />
        <HighScores />
      </RightPanel>

      {showScoreModal && (
        <ScoreModal
          score={score}
          onSubmitted={handleScoreSubmitted}
        />
      )}
    </Container>
  );
};


// เพิ่ม styled components สำหรับ Pause overlay
const PauseOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  z-index: 10;
`;

const PauseText = styled.div`
  font-size: 2rem;
  color: #4CAF50;
  margin-bottom: 1rem;
`;

const SubText = styled.div`
  font-size: 1rem;
  color: #fff;
`;

export default App;