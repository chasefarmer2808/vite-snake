import classes from "./styles/GridBox.module.css";

interface Props {
  row: number;
  col: number;
  hasSnakePiece: boolean;
  hasFood?: boolean;
}

const GridBox: React.FC<Props> = ({
  row,
  col,
  hasSnakePiece,
  hasFood = false,
}) => {
  return (
    <div
      className={`${classes.gridBox} ${hasSnakePiece && classes.snakeBox}`}
      role="gridcell"
      aria-label={`row ${row} col ${col}`}
    ></div>
  );
};

export default GridBox;
