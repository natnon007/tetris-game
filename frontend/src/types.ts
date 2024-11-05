export type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export interface Cell {
  type: TetrominoType | null;
  filled: boolean;
}