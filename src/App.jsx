import { useState, useRef, useEffect } from "react";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import Die from "./components/Die";

export default function App() {
  function generateAllNewDice() {
    return new Array(10).fill(0).map(() => ({
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    }));
  }

  const [dice, setDice] = useState(generateAllNewDice);

  const [rollCount, setRollCount] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const [bestTime, setBestTime] = useState(
    () => Number(localStorage.getItem("bestTime")) || null
  );

  const [bestRolls, setBestRolls] = useState(
    () => Number(localStorage.getItem("bestRolls")) || null
  );

  const buttonRef = useRef(null);

  const gameWon =
    dice.every((die) => die.isHeld) &&
    dice.every((die) => die.value === dice[0].value);

  useEffect(() => {
    let interval;

    if (isTimerRunning && !gameWon) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, gameWon]);

  useEffect(() => {
    if (gameWon) {
      buttonRef.current.focus();
      setIsTimerRunning(false);

      if (!bestTime || seconds < bestTime) {
        setBestTime(seconds);
        localStorage.setItem("bestTime", seconds);
      }

      if (!bestRolls || rollCount < bestRolls) {
        setBestRolls(rollCount);
        localStorage.setItem("bestRolls", rollCount);
      }
    }
  }, [gameWon]);

  function rollDice() {
    if (!gameWon) {
      if (rollCount === 0) {
        setIsTimerRunning(true);
      }

      setRollCount((prev) => prev + 1);

      setDice((oldDice) =>
        oldDice.map((die) =>
          die.isHeld
            ? die
            : {
                ...die,
                value: Math.ceil(Math.random() * 6),
              }
        )
      );
    } else {
      setDice(generateAllNewDice());
      setRollCount(0);
      setSeconds(0);
      setIsTimerRunning(false);
    }
  }

  function hold(id) {
    setDice((oldDice) =>
      oldDice.map((die) =>
        die.id === id
          ? {
              ...die,
              isHeld: !die.isHeld,
            }
          : die
      )
    );
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      hold={() => hold(die.id)}
    />
  ));

  return (
    <main>
      {gameWon && <Confetti />}

      <div aria-live="polite" className="sr-only">
        {gameWon && (
          <p>
            Congratulations! You won! Press New Game to start another round.
          </p>
        )}
      </div>

      <h1 className="title">🎲 Tenzies</h1>

      <p className="instructions">
        Roll until all dice are the same. Click a die to freeze it at its
        current value between rolls.
      </p>

      <div className="stats">
        <div className="stat-card">
          <span>Rolls</span>
          <strong>{rollCount}</strong>
        </div>

        <div className="stat-card">
          <span>Time</span>
          <strong>{seconds}s</strong>
        </div>
      </div>

      <div className="best-stats">
        <span>🏆 Best Time: {bestTime ?? "--"}s</span>
        <span>⭐ Best Rolls: {bestRolls ?? "--"}</span>
      </div>

      {gameWon && (
        <div className="win-message">
          🎉 You won in {rollCount} rolls and {seconds} seconds!
        </div>
      )}

      <div className="dice-container">{diceElements}</div>

      <button
        ref={buttonRef}
        className="roll-dice"
        onClick={rollDice}
      >
        {gameWon ? "New Game" : "Roll"}
      </button>
    </main>
  );
}