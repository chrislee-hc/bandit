import "./stylesheets/TilesRemaining.css";

function TilesRemaining(props) {
  return props.numTilesRemaining !== null ? (
    <div className="numTilesRemaining">
      Tiles Remaining: {props.numTilesRemaining}
    </div>
  ) : null;
}

export default TilesRemaining;
