import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { submitScore } from '../services/api';
import { useAuth } from '../hooks/useAuth';  // เพิ่ม import useAuth

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000; // เพิ่ม z-index ให้อยู่ด้านบนสุด
`;

const Modal = styled.div`
  background: #1a1d23;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 400px;
  text-align: center;
  max-height: calc(100vh - 4rem); // ป้องกันไม่ให้สูงเกินหน้าจอ
  overflow-y: auto; // เพิ่ม scroll ถ้าเนื้อหาเกิน
  
  /* จัดให้อยู่กลางแนวตั้งและแนวนอน */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Title = styled.h2`
  margin: 0 0 1rem 0;
  color: #4CAF50;
  font-size: 2rem;
`;

const ScoreDisplay = styled.div`
  font-size: 3rem;
  margin: 1.5rem 0;
  color: #fff;
  font-weight: bold;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 1rem;
  border-radius: 4px;
  border: 2px solid #4CAF50;
  background: #282c34;
  color: white;
  font-size: 1.2rem;
  text-align: center;

  &:focus {
    outline: none;
    border-color: #45a049;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }

  &::placeholder {
    color: #666;
  }
`;

const Button = styled.button`
  padding: 1rem;
  border-radius: 4px;
  border: none;
  background: #4CAF50;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 1rem;

  &:hover {
    background: #45a049;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #666;
    cursor: not-allowed;
    transform: none;
  }
`;

const Message = styled.div<{ $isError?: boolean }>`
  color: ${props => props.$isError ? '#ff4444' : '#4CAF50'};
  margin-top: 1rem;
  font-size: 0.9rem;
`;

// เพิ่ม styled components สำหรับแสดงข้อมูลผู้ใช้ Google
const PlayerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #282c34;
  color: white;
  font-size: 1.2rem;
  text-align: center;
  border-radius: 4px;
  border: 2px solid #4CAF50;
`;

const PlayerPhoto = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #4CAF50;
`;

interface Props {
  score: number;
  onSubmitted: () => void;
}

export const ScoreModal: React.FC<Props> = ({ score, onSubmitted }) => {
  // เพิ่ม user จาก useAuth
  const { user } = useAuth();
  const [playerName, setPlayerName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // เมื่อมี user จาก Google, ใช้ชื่อจาก Google
  useEffect(() => {
    if (user?.displayName) {
      setPlayerName(user.displayName);
    }
  }, [user]);

  useEffect(() => {
    const preventGameKeys = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener('keydown', preventGameKeys, true);
    return () => {
      window.removeEventListener('keydown', preventGameKeys, true);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }
  
    setSubmitting(true);
    setError('');
  
    try {
      // ดึง IP ของผู้เล่น
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      const playerIP = ipData.ip;
  
      await submitScore(playerName.trim(), score, playerIP);
      setSuccess(true);
      setTimeout(() => {
        onSubmitted();
      }, 1500);
    } catch (error) {
      setError('Failed to submit score. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <Overlay>
      <Modal>
        <Title>Game Over!</Title>
        <ScoreDisplay>{score.toLocaleString()}</ScoreDisplay>
        <Form onSubmit={handleSubmit}>
          {user ? (
            // แสดงข้อมูลผู้ใช้ Google
            <PlayerInfo>
              {user.photoURL && (
                <PlayerPhoto src={user.photoURL} alt={user.displayName || ''} />
              )}
              {user.displayName}
            </PlayerInfo>
          ) : (
            // แสดง input สำหรับใส่ชื่อ
            <Input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => {
                setError('');
                setPlayerName(e.target.value);
              }}
              maxLength={50}
              required
              autoFocus
              disabled={submitting || success}
            />
          )}
          <Button type="submit" disabled={submitting || success || !playerName.trim()}>
            {submitting ? 'Submitting...' : success ? 'Score Saved!' : 'Save Score'}
          </Button>
          {error && <Message $isError>{error}</Message>}
          {success && <Message>Click 'Start New Game' to play again!</Message>}
        </Form>
      </Modal>
    </Overlay>
  );
};