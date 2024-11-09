// src/components/NextPiece.tsx
import React from 'react';
import styled from 'styled-components';
import { TetrominoType } from '../types';

const Container = styled.div`
  background: #1a1d23;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  width: 100%; // ให้ใช้ความกว้างเต็ม parent
`;

const Title = styled.h3`
  margin: 0 0 0.75rem 0;
  color: #4CAF50;
  font-size: 1rem;
  text-align: center;
`;

const PreviewArea = styled.div`
  display: grid;
  grid-template-rows: repeat(4, 30px); // เพิ่มขนาดจาก 25px
  grid-template-columns: repeat(4, 30px); // เพิ่มขนาดจาก 25px
  gap: 1px;
  background: #111;
  padding: 10px;
  border-radius: 4px;
  margin: 0 auto;
  justify-content: center;
`;

const Cell = styled.div<{ $filled: boolean; $type: TetrominoType | null }>`
  background: ${({ $filled, $type }) => 
    $filled ? getPieceColor($type) : '#222'};
  border: 1px solid #333;
  border-radius: 2px;
`;

const getPieceColor = (type: TetrominoType | null) => {
  switch (type) {
    case 'I': return '#00f0f0';
    case 'J': return '#0000f0';
    case 'L': return '#f0a000';
    case 'O': return '#f0f000';
    case 'S': return '#00f000';
    case 'T': return '#a000f0';
    case 'Z': return '#f00000';
    default: return '#222';
  }
};

// สร้าง preview matrix สำหรับแต่ละชิ้น
const PREVIEW_LAYOUTS: Record<TetrominoType, boolean[][]> = {
  I: [
    [false, false, false, false],
    [false, false, false, false],
    [true, true, true, true],
    [false, false, false, false]
  ],
  J: [
    [false, false, false, false],
    [true, false, false, false],
    [true, true, true, false],
    [false, false, false, false]
  ],
  L: [
    [false, false, false, false],
    [false, false, true, false],
    [true, true, true, false],
    [false, false, false, false]
  ],
  O: [
    [false, false, false, false],
    [false, true, true, false],
    [false, true, true, false],
    [false, false, false, false]
  ],
  S: [
    [false, false, false, false],
    [false, true, true, false],
    [true, true, false, false],
    [false, false, false, false]
  ],
  T: [
    [false, false, false, false],
    [false, true, false, false],
    [true, true, true, false],
    [false, false, false, false]
  ],
  Z: [
    [false, false, false, false],
    [true, true, false, false],
    [false, true, true, false],
    [false, false, false, false]
  ]
};

interface Props {
  piece: TetrominoType | null;
}

export const NextPiece: React.FC<Props> = ({ piece }) => {
  const previewMatrix = piece ? PREVIEW_LAYOUTS[piece] : Array(4).fill(Array(4).fill(false));

  return (
    <Container>
      <Title>Next Piece</Title>
      <PreviewArea>
        {previewMatrix.map((row, y) =>
          row.map((filled, x) => (
            <Cell
              key={`${y}-${x}`}
              $filled={filled}
              $type={piece}
            />
          ))
        )}
      </PreviewArea>
    </Container>
  );
};