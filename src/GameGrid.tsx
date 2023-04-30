import { useEffect, useReducer, useRef } from "react";
import GridBox from "./GridBox";

import classes from "./styles/GameGrid.module.css";
import useArrowKeyPress from "./hooks/useArrowKeyPress";

interface GridNode {
  id: number;
  hasSnake: boolean;
  hasFood: boolean;
}

interface SnakePiece {
  row: number;
  col: number;
}

export enum Direction {
  Left,
  Right,
  Up,
  Down,
}
type SnakeAction = { type: "tick"; payload: Direction } | { type: "eat" };

const BOARD_SIZE = 15;

// Eventually, this can take a difficulty to change the size of the grid.
const createInitialGrid = () => {
  const grid = Array<GridNode[]>();
  let count = 0;

  for (let i = 0; i < BOARD_SIZE; i++) {
    const row = Array<GridNode>();

    for (let j = 0; j < BOARD_SIZE; j++) {
      row.push({
        id: count,
        hasSnake: false,
        hasFood: false,
      });
      count++;
    }

    grid.push(row);
  }
  return grid;
};

const snakeReducer = (
  state: SnakePiece[],
  action: SnakeAction
): SnakePiece[] => {
  switch (action.type) {
    case "tick":
      return moveSnakeOneUnit(state, action.payload);
    default:
      return state;
  }
};

const moveSnakeOneUnit = (
  snake: SnakePiece[],
  dir: Direction
): SnakePiece[] => {
  let prevHead = snake[0];

  return snake.map((piece, index) => {
    const newPiece = { ...piece };
    if (index == 0) {
      // First, move head based on dir.
      switch (dir) {
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
      prevHead = snake[index - 1];
      piece.row = prevHead.row;
      piece.col = prevHead.col;
    }

    return newPiece;
  });
};

const GameGrid: React.FC = () => {
  const gridRef = useRef<GridNode[][]>(createInitialGrid());
  const [snake, dispatch] = useReducer(snakeReducer, [{ row: 1, col: 1 }]);
  const arrowPress = useArrowKeyPress();

  useEffect(() => {
    // Init game interval.
    const gameInterval = setInterval(
      () => dispatch({ type: "tick", payload: arrowPress.current }),
      1000
    );

    return () => clearInterval(gameInterval);
  }, [arrowPress]);

  // Detect game over.
  useEffect(() => {
    if (didHitWall(snake, gridRef.current)) {
      console.log("GAME OVER");
    }
  }, [snake]);

  const nodeHasSnakePiece = (row: number, col: number) => {
    let hasPiece = false;

    for (const piece of snake) {
      if (row === piece.row && col === piece.col) {
        hasPiece = true;
        break;
      }
    }

    return hasPiece;
  };

  const didHitWall = (snakeState: SnakePiece[], grid: GridNode[][]) => {
    return (
      snakeState[0].row >= grid.length ||
      snakeState[0].col >= grid[0].length ||
      snakeState[0].row < 0 ||
      snakeState[0].col < 0
    );
  };

  return (
    <div
      className={classes.gameGrid}
      style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, auto)` }}
    >
      {gridRef.current.map((gridRow, row) =>
        gridRow.map((gridItem, col) => (
          <GridBox
            key={gridItem.id}
            row={row}
            col={col}
            hasSnakePiece={nodeHasSnakePiece(row, col)}
          />
        ))
      )}
    </div>
  );
};

export default GameGrid;
