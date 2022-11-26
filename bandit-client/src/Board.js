import { useState, useEffect } from "react";

function Board(props) {
  let [numTilesRemaining, setNumTilesRemaining] = useState(null);
  props.socket.emit("requestUpdate");

  useEffect(() => {
    const numTilesListener = (n) => setNumTilesRemaining(n);
    props.socket.on("numTilesUpdate", numTilesListener);
    return () => {
      props.socket.off("numTilesUpdate", numTilesListener);
    };
  }, [props.socket]);

  const handleClick = () => {
    props.socket.emit("flip");
    props.passedRef.current.focus();
  };

  return (
    <div>
      <button
        className="start"
        onClick={() => handleClick()}
        disabled={numTilesRemaining === 0}
      >
        Flip Tile
      </button>
      {numTilesRemaining !== null ? (
        <h2>{numTilesRemaining} tiles remaining</h2>
      ) : (
        ""
      )}
      <p>{props.flippedTiles.join(" ")}</p>
    </div>
  );
}

export default Board;
