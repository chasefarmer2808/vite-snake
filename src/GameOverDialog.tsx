import classes from "./styles/GameOverDialog.module.css";

interface Props {
  finalScore: number;
  onRestart: () => void;
}

const GameOverDialog = ({ finalScore, onRestart }: Props) => {
  return (
    <div className={classes.container}>
      <p>Final Score: {finalScore}</p>
      <button onClick={() => onRestart()}>Restart</button>
    </div>
  );
};

export default GameOverDialog;
