import React, { useState, useEffect } from "react";

function WordList(props) {
  let [wordList, setWordList] = useState([]);

  useEffect(() => {
    const handleUpdateWordList = (lst) => {
      setWordList(lst);
    };
    props.socket.on("updateWordList", handleUpdateWordList);
    return () => {
      props.socket.off("updateWordList", handleUpdateWordList);
    };
  }, [props.socket]);

  const wordListElt = wordList.map((elt, idx) => <li key={idx}>{elt}</li>);

  return (
    <div>
      <h2>Words:</h2>
      <ul>{wordListElt}</ul>
    </div>
  );
}

export default WordList;
