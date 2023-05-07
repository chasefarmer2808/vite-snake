import { GridItem } from "./GameBoard";
import GridBox from "./GridBox";
import { BOARD_SIZE } from "./const";

import classes from "./styles/GameGrid.module.css";

interface Props {
  snake: GridItem[];
  food: GridItem;
}

const GameGrid = ({ snake, food }: Props) => {
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

  const cells = Array<React.ReactNode>([]);

  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      const isSnake = snake.some(({ row, col }) => row === i && col === j);
      const isFood = food.row === i && food.col === j;
      cells.push(
        <GridBox
          key={`${i},${j}`}
          row={i}
          col={j}
          hasSnakePiece={isSnake}
          hasFood={isFood}
        />
      );
    }
  }

  return (
    <div
      className={classes.gameGrid}
      style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, auto)` }}
    >
      {cells}
    </div>
  );
};

export default GameGrid;
