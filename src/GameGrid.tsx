import GridBox from "./GridBox";

import classes from "./styles/GameGrid.module.css";
import { GridCell } from "./GameBoard";

interface Props {
  grid: GridCell[][];
}

const GameGrid: React.FC<Props> = ({ grid }) => {
  const boardSize = grid.length;
  // // Detect game over.
  // useEffect(() => {
  //   if (didHitWall(snake, gridRef.current)) {
  //     console.log("GAME OVER");
  //   }
  // }, [snake]);

  // const didHitWall = (snakeState: SnakePiece[], grid: GridNode[][]) => {
  //   return (
  //     snakeState[0].row >= grid.length ||
  //     snakeState[0].col >= grid[0].length ||
  //     snakeState[0].row < 0 ||
  //     snakeState[0].col < 0
  //   );
  // };

  return (
    <div
      className={classes.gameGrid}
      style={{ gridTemplateColumns: `repeat(${boardSize}, auto)` }}
    >
      {grid.map((gridRow, row) =>
        gridRow.map((gridCell, col) => (
          <GridBox
            key={`${gridCell.row},${gridCell.col}`}
            row={row}
            col={col}
            hasSnakePiece={gridCell.hasSnake}
            hasFood={gridCell.hasFood}
          />
        ))
      )}
    </div>
  );
};

export default GameGrid;
