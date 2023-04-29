import classes from "./styles/GridBox.module.css";

interface Props {
  hasSnakePiece: boolean;
  hasFood?: boolean;
}

const GridBox: React.FC<Props> = ({ hasSnakePiece, hasFood = false }) => {
  return (
    <div
      className={`${classes.gridBox} ${hasSnakePiece && classes.snakeBox}`}
    ></div>
  );
};

export default GridBox;
