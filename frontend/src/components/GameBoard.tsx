import React from 'react';
import styled from 'styled-components';
import { Cell as CellType } from '../types';

const CELL_SIZE = '1.5rem';

const StyledBoard = styled.div`
  display: grid;
  grid-template-rows: repeat(20, ${CELL_SIZE});
  grid-template-columns: repeat(10, ${CELL_SIZE});
  gap: 1px;
  background: #111;
  padding: 0.5rem;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  margin: 0 auto; // จัดให้อยู่กึ่งกลาง
`;

const Cell = styled.div<{ $filled: boolean; $type: string | null }>`
  background: ${({ $filled, $type }) => 
    $filled ? getTetrominoColor($type) : '#222'};
  border: 1px solid #333;
  border-radius: 2px;
  transition: background-color 0.1s;
`;

const getTetrominoColor = (type: string | null) => {
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

interface Props {
  board: CellType[][];
}

export const GameBoard: React.FC<Props> = ({ board }) => (
  <StyledBoard>
    {board.map((row, y) =>
      row.map((cell, x) => (
        <Cell 
          key={`${y}-${x}`}
          $filled={cell.filled}
          $type={cell.type}
        />
      ))
    )}
  </StyledBoard>
);