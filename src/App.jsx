import Die from "./components/Die";

export default function App() {

  function generateNewDie() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      const rand = Math.floor(Math.random() * 6) + 1;
      newDice.push(rand);
    }
    return newDice;
  }

  return (

    <main className="main">
      <div className="dice-container">
        <Die value={1} />
        <Die value={2} />
        <Die value={3} />
        <Die value={4} />
        <Die value={5} />
        <Die value={6} />
        <Die value={1} />
        <Die value={2} />
        <Die value={3} />
        <Die value={4} />
      </div>
    </main>
  );
}
