import React, { useState, useEffect } from "react";
import "./stylesheets/PlayerInput.css";

import FlipButton from "./FlipButton";
import TilesRemaining from "./TilesRemaining";
import Reset from "./Reset";
import Entry from "./Entry";

function PlayerInput(props) {
  let [numTilesRemaining, setNumTilesRemaining] = useState(null);

  useEffect(() => {
    const numTilesListener = (n) => {
      setNumTilesRemaining(n);
    };
    props.socket.on("numTilesUpdate", numTilesListener);
    return () => {
      props.socket.off("numTilesUpdate", numTilesListener);
    };
  }, [props.socket]);

  return (
    <div className="player-input-container">
      <div className="actions-container">
        <FlipButton
          passedRef={props.passedRef}
          socket={props.socket}
          numTilesRemaining={numTilesRemaining}
          disabled={props.username !== props.currentPlayer}
        />
        <TilesRemaining numTilesRemaining={numTilesRemaining} />
        <Reset socket={props.socket} />
      </div>
      <div className="entry-container">
        <Entry
          passedRef={props.passedRef}
          socket={props.socket}
          username={props.username}
        />
      </div>
    </div>
  );
}

export default PlayerInput;
