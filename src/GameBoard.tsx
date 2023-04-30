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

const GameBoard: React.FC = () => {
  const [grid, setGrid] = useState<GridCell[][]>(createInitialGrid());
  const snakeRef = useRef<SnakePiece[]>([{ row: 1, col: 1 }]);
  const arrowPress = useArrowKeyPress();

  const updateSnakePos = useCallback(() => {
    const prevSnake = snakeRef.current;

    snakeRef.current = prevSnake.map((piece, index) => {
      if (index == 0) {
        // First, move head based on dir.
        switch (arrowPress.current) {
          case Direction.Left:
            piece.col--;
            break;
          case Direction.Right:
            piece.col++;
            break;
          case Direction.Up:
            piece.row--;
            break;
          case Direction.Down:
            piece.row++;
            break;
          default:
            break;
        }
      } else {
        // Next, move all child pieces to its parent's previous location.
        piece.row = prevSnake[index - 1].row;
        piece.col = prevSnake[index - 1].col;
      }

      return piece;
    });
  }, [arrowPress]);

  useEffect(() => {
    const handleGameTick = () => {
      updateSnakePos();

      setGrid((prevGrid) =>
        prevGrid.map((gridRow) =>
          gridRow.map((gridCell) => {
            const hasSnake =
              snakeRef.current.filter(
                (piece) =>
                  piece.row == gridCell.row && piece.col == gridCell.col
              ).length == 1;

            return { ...gridCell, hasSnake: hasSnake };
          })
        )
      );
    };

    // Init game interval.
    const gameInterval = setInterval(handleGameTick, 1000);

    return () => clearInterval(gameInterval);
  }, [updateSnakePos]);

  return (
    <main>
      <GameGrid grid={grid} />
    </main>
  );
};

export default GameBoard;
