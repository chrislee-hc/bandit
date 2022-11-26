function Reset(props) {
  const handleClick = () => {
    props.socket.emit("reset");
  };

  return <button onClick={() => handleClick()}>Reset</button>;
}

export default Reset;
