import { useRef, useEffect } from "react";
import { Direction } from "../GameGrid";

const useArrowKeyPress = () => {
  const keyPressRef = useRef<Direction>(Direction.Right);

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          keyPressRef.current = Direction.Up;
          break;
        case "ArrowDown":
          keyPressRef.current = Direction.Down;
          break;
        case "ArrowLeft":
          keyPressRef.current = Direction.Left;
          break;
        case "ArrowRight":
          keyPressRef.current = Direction.Right;
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", keyDownHandler);

    return () => {
      window.removeEventListener("keydown", keyDownHandler);
    };
  }, []);

  return keyPressRef;
};

export default useArrowKeyPress;
