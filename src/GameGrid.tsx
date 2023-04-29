import { useEffect, useState } from "react";
import GridBox from "./GridBox";

import classes from "./styles/GameGrid.module.css";

interface GridNode {
  id: number;
  hasSnake: boolean;
  hasFood: boolean;
}

const BOARD_SIZE = 50;

const GameGrid: React.FC = () => {
  const [gridState, setGridState] = useState<GridNode[][]>([[]]);

  useEffect(() => {
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
  }, []);

  return (
    <div
      className={classes.gameGrid}
      style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)` }}
    >
      {gridState.map((gridRow) =>
        gridRow.map((gridItem) => <GridBox key={gridItem.id} />)
      )}
    </div>
  );
};

export default GameGrid;
