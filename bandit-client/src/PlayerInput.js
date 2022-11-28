import React, { useState, useEffect } from "react";
import "./PlayerInput.css";

import FlipButton from "./FlipButton";
import TilesRemaining from "./TilesRemaining";
import Reset from "./Reset";
import Entry from "./Entry";

function PlayerInput(props) {
  let [numTilesRemaining, setNumTilesRemaining] = useState(null);

  useEffect(() => {
    const numTilesListener = (n) => setNumTilesRemaining(n);
    props.socket.on("numTilesUpdate", numTilesListener);
    return () => {
      props.socket.off("numTilesUpdate", numTilesListener);
    };
  }, [props.socket]);

  return (
    <div className="player-input-container">
      <div className="actions-container">
        <span>
          <FlipButton
            passedRef={props.passedRef}
            socket={props.socket}
            numTilesRemaining={numTilesRemaining}
          />
        </span>
        <span>
          <TilesRemaining numTilesRemaining={numTilesRemaining} />
        </span>
        <span>
          <Reset socket={props.socket} />
        </span>
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
