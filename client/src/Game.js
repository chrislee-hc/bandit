import React, { useEffect, useState, useRef } from "react";
import "./stylesheets/Game.css";

import Login from "./Login";
import PlayerInput from "./PlayerInput";
import Board from "./Board";
import WordListBoard from "./WordListBoard";

function Game(props) {
  let [flippedTiles, setFlippedTiles] = useState([]);
  let [username, setUsername] = useState(null);
  let [wordLists, setWordLists] = useState({});
  let [rejected, setRejected] = useState(false);
  let [currentPlayer, setCurrentPlayer] = useState(null);
  let ref = useRef(null);

  useEffect(() => {
    const flipListener = (newFlippedTiles) => {
      setFlippedTiles(newFlippedTiles);
    };
    const handleUpdateWordLists = (newWordLists) => {
      setWordLists(newWordLists);
    };
    const handleReset = () => {
      setUsername(null);
      setRejected(false);
    };
    const currentPlayerListener = (un) => setCurrentPlayer(un);

    props.socket.on("updateFlippedTiles", flipListener);
    props.socket.on("updateWordLists", handleUpdateWordLists);
    props.socket.on("serverRestart", handleReset);
    props.socket.on("currentPlayer", currentPlayerListener);

    return () => {
      props.socket.off("updateFlippedTiles", flipListener);
      props.socket.off("updateWordLists", handleUpdateWordLists);
      props.socket.off("serverRestart", handleReset);
      props.socket.off("currentPlayer", currentPlayerListener);
    };
  }, [props.socket]);

  return username === null ? (
    <div className="login-screen">
      <Login
        socket={props.socket}
        setUsername={setUsername}
        rejected={rejected}
        setRejected={setRejected}
      />
    </div>
  ) : (
    <div className="game-board">
      <h1>{username.toLowerCase()}</h1>
      <PlayerInput
        passedRef={ref}
        socket={props.socket}
        username={username}
        currentPlayer={currentPlayer}
      />
      <Board
        flippedTiles={flippedTiles}
        socket={props.socket}
        passedRef={ref}
      />
      <div className="word-list-board">
        <WordListBoard
          wordLists={wordLists}
          socket={props.socket}
          currentPlayer={currentPlayer}
        />
      </div>
    </div>
  );
}

export default Game;
