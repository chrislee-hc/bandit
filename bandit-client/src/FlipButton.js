import "./stylesheets/FlipButton.css";

function FlipButton(props) {
  const handleClick = () => {
    props.socket.emit("flip");
    props.passedRef.current.focus();
  };

  return (
    <button
      className="start"
      onClick={() => handleClick()}
      disabled={props.numTilesRemaining === 0}
    >
      Flip Tile
    </button>
  );
}

export default FlipButton;
