import { useCallback, useEffect, useState } from "react";
import GameGrid from "./GameGrid";
import useArrowKeyPress, { Direction } from "./hooks/useArrowKeyPress";
import { BOARD_SIZE } from "./const";

export interface GridItem {
  row: number;
  col: number;
}

const getRandomInt = (max: number): number => {
  return Math.floor(Math.random() * max);
};

const GameBoard: React.FC = () => {
  const [snake, setSnake] = useState<GridItem[]>([{ row: 1, col: 1 }]);
  const [food, setFood] = useState<GridItem>({ row: 3, col: 3 }); // TODO: Randomize food position.
  const arrowPress = useArrowKeyPress();

  const updateSnakePos = useCallback(
    (oldSnake: GridItem[]) => {
      return oldSnake.map((piece, index) => {
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
          newPiece.row = oldSnake[index - 1].row;
          newPiece.col = oldSnake[index - 1].col;
        }

        return newPiece;
      });
    },
    [arrowPress]
  );

  useEffect(() => {
    const didEatFood = (snakeHead: GridItem, food: GridItem): boolean => {
      return snakeHead.row == food.row && snakeHead.col == food.col;
    };

    const updateFoodPosRandom = () => {
      setFood({
        row: getRandomInt(BOARD_SIZE - 1),
        col: getRandomInt(BOARD_SIZE - 1),
      });
    };

    const handleGameTick = () => {
      setSnake((s) => {
        const newSnake = updateSnakePos(s);

        if (didEatFood(newSnake[0], food)) {
          const tail = { ...s[s.length - 1] }; // Use prev state so looks like snake is growing.
          newSnake.push(tail);
          updateFoodPosRandom();
        }

        return newSnake;
      });
    };

    // Init game interval.
    const gameInterval = setInterval(handleGameTick, 1000);

    return () => clearInterval(gameInterval);
  }, [updateSnakePos, food, snake]);

  return (
    <main>
      <GameGrid snake={snake} food={food} />
    </main>
  );
};

export default GameBoard;
