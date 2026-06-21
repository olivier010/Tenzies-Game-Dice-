export default function Die(props) {
  const pipMap = {
    1: [5],
    2: [1, 9],
    3: [1, 5, 9],
    4: [1, 3, 7, 9],
    5: [1, 3, 5, 7, 9],
    6: [1, 3, 4, 6, 7, 9],
  };

  return (
    <button
      className={`die-face ${props.isHeld ? "held" : ""}`}
      onClick={props.hold}
      aria-pressed={props.isHeld}
      aria-label={`Die with value ${props.value}, ${
        props.isHeld ? "held" : "not held"
      }`}
    >
      {Array.from({ length: 9 }, (_, index) => (
        <span
          key={index}
          className={`pip ${
            pipMap[props.value].includes(index + 1) ? "visible" : ""
          }`}
        />
      ))}
    </button>
  );
}