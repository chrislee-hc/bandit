import "./Reset.css";

function Reset(props) {
  const handleClick = () => {
    props.socket.emit("reset");
  };

  return (
    <button className="reset" onClick={() => handleClick()}>
      Reset
    </button>
  );
}

export default Reset;
