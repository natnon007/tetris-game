import { useState, useCallback, useEffect } from 'react';
import { Cell, TetrominoType } from '../types';
import { BOARD_HEIGHT, BOARD_WIDTH, TETROMINOES } from '../constants';



const createEmptyBoard = (): Cell[][] =>
  Array(BOARD_HEIGHT).fill(null).map(() =>
    Array(BOARD_WIDTH).fill(null).map(() => ({
      type: null,
      filled: false
    }))
  );

export const useGameLogic = () => {
  const [board, setBoard] = useState(createEmptyBoard());
  const [displayBoard, setDisplayBoard] = useState(createEmptyBoard());
  const [score, setScore] = useState(0);
  const [linesCleared, setLinesCleared] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(true);
  const [isGameStarted, setIsGameStarted] = useState(false);  // เพิ่ม state ใหม่
  const [currentPiece, setCurrentPiece] = useState<{
    type: TetrominoType;
    position: [number, number];
    rotation: number;
  } | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [nextPiece, setNextPiece] = useState<TetrominoType | null>(null);

  const getRandomPiece = (): TetrominoType => {
    const types: TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
    return types[Math.floor(Math.random() * types.length)];
  };

  const startGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setScore(0);
    setLinesCleared(0);
    setLevel(1);
    setGameOver(false);
    setIsPaused(false);
    setIsGameStarted(true);  // ตั้งค่าเมื่อเริ่มเกม
    setNextPiece(getRandomPiece());
    spawnPiece();
  }, []);

  const togglePause = useCallback(() => {
    if (!gameOver && currentPiece && isGameStarted) {  // เพิ่มเงื่อนไข isGameStarted
      setIsPaused(prev => !prev);
    }
  }, [gameOver, currentPiece, isGameStarted]);  // เพิ่ม isGameStarted ในรายการ dependencies

  const spawnPiece = useCallback(() => {
    if (!nextPiece) {
      // กรณีเริ่มเกมครั้งแรก
      const currentType = getRandomPiece();
      setCurrentPiece({
        type: currentType,
        position: [0, Math.floor(BOARD_WIDTH / 2) - 1],
        rotation: 0
      });
      setNextPiece(getRandomPiece());
      return;
    }
    // ใช้ nextPiece เป็น currentPiece และสุ่ม nextPiece ใหม่
    setCurrentPiece({
      type: nextPiece,
      position: [0, Math.floor(BOARD_WIDTH / 2) - 1],
      rotation: 0
    });
    setNextPiece(getRandomPiece());
  }, [nextPiece]);

  const getCurrentPieceMatrix = useCallback(() => {
    if (!currentPiece) return null;
    const { type, rotation } = currentPiece;
    const variations = TETROMINOES[type];
    return variations[rotation % variations.length];
  }, [currentPiece]);

  const isValidMove = useCallback((y: number, x: number, pieceMatrix: number[][]) => {
    for (let dy = 0; dy < pieceMatrix.length; dy++) {
      for (let dx = 0; dx < pieceMatrix[dy].length; dx++) {
        if (pieceMatrix[dy][dx]) {
          const newY = y + dy;
          const newX = x + dx;
          if (
            newY >= BOARD_HEIGHT ||
            newX < 0 ||
            newX >= BOARD_WIDTH ||
            (newY >= 0 && board[newY][newX].filled)
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }, [board]);

  const rotate = useCallback(() => {
    if (!currentPiece) return;

    const { type, position, rotation } = currentPiece;
    const variations = TETROMINOES[type];
    const newRotation = (rotation + 1) % variations.length;
    const newPieceMatrix = variations[newRotation];

    // Try normal rotation
    if (isValidMove(position[0], position[1], newPieceMatrix)) {
      setCurrentPiece({
        ...currentPiece,
        rotation: newRotation,
      });
      return;
    }

    // Try wall kick - move left
    if (isValidMove(position[0], position[1] - 1, newPieceMatrix)) {
      setCurrentPiece({
        ...currentPiece,
        position: [position[0], position[1] - 1],
        rotation: newRotation,
      });
      return;
    }

    // Try wall kick - move right
    if (isValidMove(position[0], position[1] + 1, newPieceMatrix)) {
      setCurrentPiece({
        ...currentPiece,
        position: [position[0], position[1] + 1],
        rotation: newRotation,
      });
      return;
    }
  }, [currentPiece, isValidMove]);

  const updateDisplayBoard = useCallback(() => {
    if (!currentPiece) return;

    const newDisplay = board.map(row => row.map(cell => ({ ...cell })));
    const pieceMatrix = getCurrentPieceMatrix();
    if (!pieceMatrix) return;

    const [y, x] = currentPiece.position;

    pieceMatrix.forEach((row, dy) => {
      row.forEach((cell, dx) => {
        if (cell && y + dy >= 0 && y + dy < BOARD_HEIGHT && x + dx >= 0 && x + dx < BOARD_WIDTH) {
          newDisplay[y + dy][x + dx] = {
            type: currentPiece.type,
            filled: true
          };
        }
      });
    });

    setDisplayBoard(newDisplay);
  }, [currentPiece, board, getCurrentPieceMatrix]);

  const checkLines = useCallback(() => {
    let newBoard = [...board];
    let cleared = 0;

    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (newBoard[y].every(cell => cell.filled)) {
        newBoard.splice(y, 1);
        newBoard.unshift(Array(BOARD_WIDTH).fill(null).map(() => ({
          type: null,
          filled: false
        })));
        cleared++;
        y++; // Check the same line again
      }
    }

    if (cleared > 0) {
      setBoard(newBoard);
      setLinesCleared(prev => {
        const newLines = prev + cleared;
        setLevel(Math.floor(newLines / 10) + 1);
        return newLines;
      });
      setScore(prev => prev + (cleared * 100 * level));
    }
  }, [board, level]);

  const moveDown = useCallback(() => {
    if (!currentPiece) return;
    
    const [y, x] = currentPiece.position;
    const pieceMatrix = getCurrentPieceMatrix();
    if (!pieceMatrix) return;

    if (!isValidMove(y + 1, x, pieceMatrix)) {
      // Lock piece
      const newBoard = [...board];
      pieceMatrix.forEach((row, dy) =>
        row.forEach((cell, dx) => {
          if (cell) {
            if (y + dy <= 0) {
              setGameOver(true);
              setIsGameStarted(false);  // เพิ่มบรรทัดนี้
              return;
            }
            newBoard[y + dy][x + dx] = {
              type: currentPiece.type,
              filled: true
            };
          }
        })
      );
      setBoard(newBoard);
      checkLines();
      spawnPiece();
      return;
    }
    
    setCurrentPiece({
      ...currentPiece,
      position: [y + 1, x]
    });
  }, [currentPiece, board, spawnPiece, checkLines, getCurrentPieceMatrix, isValidMove]);

  const hardDrop = useCallback(() => {
    if (!currentPiece || gameOver) return;
    
    const pieceMatrix = getCurrentPieceMatrix();
    if (!pieceMatrix) return;
    
    let [y, x] = currentPiece.position;
    let newY = y;
    
    // หาตำแหน่งต่ำสุดที่บล็อกสามารถตกลงไปได้
    while (isValidMove(newY + 1, x, pieceMatrix)) {
      newY++;
    }
    
    // วาง piece ที่ตำแหน่งนั้นทันที
    const newBoard = [...board];
    pieceMatrix.forEach((row, dy) =>
      row.forEach((cell, dx) => {
        if (cell) {
          if (newY + dy <= 0) {
            setGameOver(true);
            setIsGameStarted(false);  // เพิ่มบรรทัดนี้
            return;
          }
          newBoard[newY + dy][x + dx] = {
            type: currentPiece.type,
            filled: true
          };
        }
      })
    );
    
    setBoard(newBoard);
    checkLines();
    spawnPiece();
    
    // เพิ่มคะแนนพิเศษสำหรับ hard drop
    setScore(prev => prev + ((newY - y) * 2));
  }, [currentPiece, gameOver, board, getCurrentPieceMatrix, isValidMove, checkLines, spawnPiece]);

  // ปรับปรุง Game loop
  useEffect(() => {
    if (gameOver || isPaused) return;
    
    const interval = setInterval(() => {
      moveDown();
    }, 1000);

    return () => clearInterval(interval);
  }, [moveDown, gameOver, isPaused]);

  // Update display board
  useEffect(() => {
    updateDisplayBoard();
  }, [currentPiece, board, updateDisplayBoard]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // ถ้ากด Escape ให้ toggle pause
      if (e.key === 'Escape') {
        togglePause();
        e.preventDefault();
        return;
      }

      // ถ้าเกมถูก pause ไม่ให้ควบคุมได้
      if (!currentPiece || gameOver || isPaused) return;
      
      const [y, x] = currentPiece.position;
      const pieceMatrix = getCurrentPieceMatrix();
      if (!pieceMatrix) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          if (isValidMove(y, x - 1, pieceMatrix)) {
            setCurrentPiece({
              ...currentPiece,
              position: [y, x - 1]
            });
          }
          break;
        case 'ArrowRight':
          if (isValidMove(y, x + 1, pieceMatrix)) {
            setCurrentPiece({
              ...currentPiece,
              position: [y, x + 1]
            });
          }
          break;
        case 'ArrowDown':
          moveDown();
          e.preventDefault(); // ป้องกันการเลื่อนหน้า
          break;
        case 'ArrowUp':
          rotate();
          e.preventDefault(); // ป้องกันการเลื่อนหน้า
          break;
        case ' ': // Space bar for hard drop
          e.preventDefault(); // ป้องกันการเลื่อนหน้า
          hardDrop();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPiece, gameOver, isPaused, moveDown, rotate, getCurrentPieceMatrix, isValidMove, hardDrop, togglePause]);

  return { 
    board,
    displayBoard,
    score,
    gameOver,
    isPaused,
    isGameStarted,  // เพิ่ม state ใหม่ใน return object
    startGame,
    togglePause,
    linesCleared,
    level,
    nextPiece  // เพิ่ม nextPiece
  };
};