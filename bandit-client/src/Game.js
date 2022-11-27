import React, { useEffect, useState, useRef } from "react";

import Reset from "./Reset";
import Board from "./Board";
import Entry from "./Entry";
import WordList from "./WordList";

function Game(props) {
  let [flippedTiles, setFlippedTiles] = useState([]);
  let ref = useRef(null);

  useEffect(() => {
    const flipListener = (newFlippedTiles) => {
      setFlippedTiles(newFlippedTiles);
    };

    props.socket.on("updateFlippedTiles", flipListener);

    return () => {
      props.socket.off("updateFlippedTiles");
    };
  }, [props.socket]);

  return (
    <div>
      <Reset socket={props.socket} />
      <Board
        flippedTiles={flippedTiles}
        socket={props.socket}
        passedRef={ref}
      />
      <Entry passedRef={ref} socket={props.socket} />
      <WordList socket={props.socket} />
    </div>
  );
}

export default Game;
