import { useCallback, useEffect, useState } from "react";
import GameGrid from "./GameGrid";
import useArrowKeyPress, { Direction } from "./hooks/useArrowKeyPress";
import { BOARD_SIZE } from "./const";
import GameOverDialog from "./GameOverDialog";
import classes from "./styles/GameBoard.module.css";

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
  const [isGameOver, setIsGameOver] = useState(false);
  const arrowPress = useArrowKeyPress();

  const handleRestart = () => {
    setSnake([{ row: 1, col: 1 }]);
    setFood({ row: 3, col: 3 });
    setIsGameOver(false);
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" })); // Keep initial direction consistent
  };

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

    const didHitWall = (snakeHead: GridItem): boolean => {
      return (
        snakeHead.row >= BOARD_SIZE ||
        snakeHead.col >= BOARD_SIZE ||
        snakeHead.row <= 0 ||
        snakeHead.col <= 0
      );
    };

    const updateFoodPosRandom = () => {
      setFood({
        row: getRandomInt(BOARD_SIZE - 1),
        col: getRandomInt(BOARD_SIZE - 1),
      });
    };

    const handleGameTick = () => {
      if (isGameOver) return;
      const newSnake = updateSnakePos(snake);

      if (didEatFood(newSnake[0], food)) {
        const tail = { ...snake[snake.length - 1] }; // Use prev state so looks like snake is growing.
        newSnake.push(tail);
        updateFoodPosRandom();
      } else if (didHitWall(newSnake[0])) {
        setIsGameOver(true);
      }

      setSnake(newSnake);
    };

    // Init game interval.
    const gameInterval = setInterval(handleGameTick, 500);

    return () => clearInterval(gameInterval);
  }, [updateSnakePos, food, snake, isGameOver]);

  return (
    <main className={classes.gameFrame}>
      <GameGrid snake={snake} food={food} />
      {isGameOver && (
        <GameOverDialog finalScore={snake.length} onRestart={handleRestart} />
      )}
    </main>
  );
};

export default GameBoard;
