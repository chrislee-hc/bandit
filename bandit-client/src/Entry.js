import React, { useState, useEffect } from "react";
import "./Entry.css";

function Entry(props) {
  let [message, setMessage] = useState("");

  useEffect(() => {
    const handleWordResponse = (b) => {
      if (b) {
        setMessage("");
      }
    };

    props.socket.on("wordResponse", handleWordResponse);

    return () => {
      props.socket.off("wordResponse", handleWordResponse);
    };
  }, [props.socket]);

  const handleSubmit = () => {
    let word = message;
    props.socket.emit("word", word);
  };

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="entry">
      <input
        className="answer"
        onKeyPress={(event) => handleKeyPress(event)}
        onChange={(event) => handleChange(event)}
        value={message}
        ref={props.passedRef}
      />
    </div>
  );
}

export default Entry;
