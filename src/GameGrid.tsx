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

type SnakeAction = "tick" | "eat";

const BOARD_SIZE = 15;

const snakeReducer = (
  state: SnakePiece[],
  action: SnakeAction
): SnakePiece[] => {
  switch (action) {
    case "tick":
      return state.map((piece) => ({ ...piece, col: piece.col++ }));
    default:
      return state;
  }
};

const GameGrid: React.FC = () => {
  const [gridState, setGridState] = useState<GridNode[][]>([[]]);
  const [snake, dispatch] = useReducer(snakeReducer, [{ row: 1, col: 1 }]);

  useEffect(() => {
    // Init game interval.
    const gameInterval = setInterval(() => dispatch("tick"), 1000);

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
