import React, { useState, useEffect } from "react";

function Login(props) {
  let [username, setUsername] = useState("");

  useEffect(() => {
    const handleUsernameResponse = (b) => {
      if (b && username.length > 0) {
        props.setUsername(username);
      }
    };
    props.socket.on("usernameResponse", handleUsernameResponse);
    return () => {
      props.socket.off("usernameResponse", handleUsernameResponse);
    };
  }, [props.socket, username, props]);

  const handleChange = (event) => {
    setUsername(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      props.socket.emit("username", username);
    }
  };

  return (
    <div className="login">
      <input
        className="answer"
        onKeyPress={(event) => handleKeyPress(event)}
        onChange={(event) => handleChange(event)}
        value={username}
      />
    </div>
  );
}

export default Login;
