import { GridItem } from "./GameBoard";
import GridBox from "./GridBox";
import { BOARD_SIZE } from "./const";

import classes from "./styles/GameGrid.module.css";

interface Props {
  snake: GridItem[];
  food: GridItem;
}

const GameGrid = ({ snake, food }: Props) => {
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
