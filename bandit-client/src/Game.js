import React, { useEffect, useState, useRef } from "react";
import "./Game.css";

import Login from "./Login";
import PlayerInput from "./PlayerInput";
import Board from "./Board";
import WordListBoard from "./WordListBoard";

function Game(props) {
  let [flippedTiles, setFlippedTiles] = useState([]);
  let [username, setUsername] = useState(null);
  let [wordLists, setWordLists] = useState({});
  let ref = useRef(null);

  useEffect(() => {
    const flipListener = (newFlippedTiles) => {
      setFlippedTiles(newFlippedTiles);
    };
    const handleUpdateWordLists = (newWordLists) => {
      setWordLists(newWordLists);
    };

    props.socket.on("updateFlippedTiles", flipListener);
    props.socket.on("updateWordLists", handleUpdateWordLists);

    return () => {
      props.socket.off("updateFlippedTiles", flipListener);
      props.socket.off("updateWordLists", handleUpdateWordLists);
    };
  }, [props.socket]);

  return username === null ? (
    <div className="login-screen">
      <Login socket={props.socket} setUsername={setUsername} />
    </div>
  ) : (
    <div className="game-board">
      <h1>{username.toLowerCase()}</h1>
      <PlayerInput passedRef={ref} socket={props.socket} username={username} />
      <Board
        flippedTiles={flippedTiles}
        socket={props.socket}
        passedRef={ref}
      />
      <div className="word-list-board">
        <WordListBoard wordLists={wordLists} socket={props.socket} />
      </div>
    </div>
  );
}

export default Game;
