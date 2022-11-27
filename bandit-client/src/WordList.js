import React, { useState, useEffect } from "react";
import "./WordList.css";

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

  const wordListElt = wordList.map((elt, idx) => (
    <div key={idx} className="word-container">
      {elt.toUpperCase()}
    </div>
  ));

  return (
    <div className="word-list-container">
      <div className="word-list-title">Words</div>
      <div className="word-list">{wordListElt}</div>
    </div>
  );
}

export default WordList;
