import { useEffect, useReducer, useState } from "react";
import GridBox from "./GridBox";

import classes from "./styles/GameGrid.module.css";

interface GridNode {
  id: number;
  hasSnake: boolean;
  hasFood: boolean;
}

interface SnakePiece {
  row: number;
  col: number;
}

enum Direction {
  Left,
  Right,
  Up,
  Down,
}
type SnakeAction = { type: "tick"; payload: Direction } | { type: "eat" };

const BOARD_SIZE = 15;

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
      console.log(newPiece.col);
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
  const [gridState, setGridState] = useState<GridNode[][]>([[]]);
  const [snake, dispatch] = useReducer(snakeReducer, [{ row: 1, col: 1 }]);
  // const arrowPressed = useArrowKeyPress();

  useEffect(() => {
    // Init grid.
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
    setGridState(grid);

    // Init game interval.
    const gameInterval = setInterval(
      () => dispatch({ type: "tick", payload: Direction.Right }),
      1000
    );

    return () => clearInterval(gameInterval);
  }, []);

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

  return (
    <div
      className={classes.gameGrid}
      style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, auto)` }}
    >
      {gridState.map((gridRow, row) =>
        gridRow.map((gridItem, col) => (
          <GridBox
            key={gridItem.id}
            hasSnakePiece={nodeHasSnakePiece(row, col)}
          />
        ))
      )}
    </div>
  );
};

export default GameGrid;
