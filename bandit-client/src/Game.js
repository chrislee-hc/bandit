import React, { useEffect, useState, useRef } from "react";
import "./Game.css";

import PlayerInput from "./PlayerInput";
import Board from "./Board";
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
    <div className="game-board">
      <PlayerInput passedRef={ref} socket={props.socket} />
      <Board
        flippedTiles={flippedTiles}
        socket={props.socket}
        passedRef={ref}
      />
      <div className="word-board">
        <WordList socket={props.socket} />
        <WordList socket={props.socket} />
        <WordList socket={props.socket} />
        <WordList socket={props.socket} />
      </div>
    </div>
  );
}

export default Game;
