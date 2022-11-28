import React, { useState, useEffect } from "react";
import "./Login.css";

function Login(props) {
  let [username, setUsername] = useState("");

  useEffect(() => {
    const handleUsernameResponse = (b) => {
      if (b && username.length > 0) {
        props.setUsername(username);
      } else if (!b) {
        props.setRejected(true);
      }
    };
    props.socket.on("usernameResponse", handleUsernameResponse);
    return () => {
      props.socket.off("usernameResponse", handleUsernameResponse);
    };
  }, [props.socket, username, props]);

  const handleChange = (event) => {
    setUsername(event.target.value);
    props.setRejected(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      props.socket.emit("username", username);
    }
  };

  return (
    <div className="login">
      <h2>Enter a Username</h2>
      <input
        className="answer"
        onKeyPress={(event) => handleKeyPress(event)}
        onChange={(event) => handleChange(event)}
        value={username}
      />
      {props.rejected && username.length > 0 ? (
        <div className="rejected">Username already taken.</div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Login;
