import { useCallback, useEffect, useRef, useState } from "react";
import GameGrid from "./GameGrid";
import useArrowKeyPress, { Direction } from "./hooks/useArrowKeyPress";

const BOARD_SIZE = 15;

export interface GridCell {
  row: number;
  col: number;
  hasSnake: boolean;
  hasFood: boolean;
}

interface SnakePiece {
  row: number;
  col: number;
}

interface FoodPiece {
  row: number;
  col: number;
}

// Eventually, this can take a difficulty to change the size of the grid.
const createInitialGrid = () => {
  const grid = Array<GridCell[]>();

  for (let i = 0; i < BOARD_SIZE; i++) {
    const row = Array<GridCell>();

    for (let j = 0; j < BOARD_SIZE; j++) {
      row.push({
        row: i,
        col: j,
        hasSnake: false,
        hasFood: false,
      });
    }

    grid.push(row);
  }
  return grid;
};

const getRandomInt = (max: number): number => {
  return Math.floor(Math.random() * max);
};

const GameBoard: React.FC = () => {
  const [grid, setGrid] = useState<GridCell[][]>(createInitialGrid());
  const snakeRef = useRef<SnakePiece[]>([
    { row: 1, col: 1 },
    { row: 1, col: 0 },
  ]);
  const foodRef = useRef<FoodPiece>({ row: 3, col: 3 }); // TODO: Randomize food position.
  const arrowPress = useArrowKeyPress();

  const updateSnakePos = useCallback(() => {
    snakeRef.current = snakeRef.current.map((piece, index) => {
      const newPiece = { ...piece };

      if (index == 0) {
        // First, move head based on dir.
        switch (arrowPress.current) {
          case Direction.Left:
            newPiece.col--;
            break;
          case Direction.Right:
            newPiece.col++;
            break;
          case Direction.Up:
            newPiece.row--;
            break;
          case Direction.Down:
            newPiece.row++;
            break;
          default:
            break;
        }
      } else {
        // Next, move all child pieces to its parent's previous location.
        newPiece.row = snakeRef.current[index - 1].row;
        newPiece.col = snakeRef.current[index - 1].col;
      }
      return newPiece;
    });
  }, [arrowPress]);

  const updateFoodPosRandom = useCallback(() => {
    foodRef.current = {
      row: getRandomInt(grid.length - 1),
      col: getRandomInt(grid.length - 1),
    };
  }, [grid.length]);

  useEffect(() => {
    const didEatFood = (): boolean => {
      const snakeHead = snakeRef.current[0];
      return (
        snakeHead.row == foodRef.current.row &&
        snakeHead.col == foodRef.current.col
      );
    };

    const handleGameTick = () => {
      const tail = { ...snakeRef.current[snakeRef.current.length - 1] };
      updateSnakePos();

      if (didEatFood()) {
        snakeRef.current.push(tail);
        updateFoodPosRandom();
      }

      setGrid((prevGrid) =>
        prevGrid.map((gridRow) =>
          gridRow.map((gridCell) => {
            const hasSnake =
              snakeRef.current.filter(
                (piece) =>
                  piece.row == gridCell.row && piece.col == gridCell.col
              ).length == 1;

            const hasFood =
              foodRef.current.row == gridCell.row &&
              foodRef.current.col == gridCell.col;

            return { ...gridCell, hasSnake, hasFood };
          })
        )
      );
    };

    // Init game interval.
    const gameInterval = setInterval(handleGameTick, 500);

    return () => clearInterval(gameInterval);
  }, [updateSnakePos, updateFoodPosRandom]);

  return (
    <main>
      <GameGrid grid={grid} />
    </main>
  );
};

export default GameBoard;
