import React from "react";
import "./stylesheets/PlayerInput.css";

import FlipButton from "./FlipButton";
import TilesRemaining from "./TilesRemaining";
import Reset from "./Reset";
import Entry from "./Entry";

function PlayerInput(props) {
  return (
    <div className="player-input-container">
      <div className="actions-container">
        <FlipButton
          passedRef={props.passedRef}
          socket={props.socket}
          numTilesRemaining={props.numTilesRemaining}
          disabled={props.username !== props.currentPlayer}
        />
        <TilesRemaining numTilesRemaining={props.numTilesRemaining} />
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
