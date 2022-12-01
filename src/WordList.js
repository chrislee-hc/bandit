import classNames from "classnames";
import WordListWordTiles from "./WordListWordTiles";

import "./stylesheets/WordList.css";

function WordList(props) {
  const wordListElt = props.wordList.map((elt, idx) => (
    <div className="word-container" key={idx}>
      <WordListWordTiles word={elt} />
    </div>
  ));

  let score = 0;
  for (let i = 0; i < props.wordList.length; i++) {
    score += props.wordList[i].length;
  }

  const usernameClass = classNames("WordList", {
    "user-name": !props.isCurrent,
    "user-name-current": props.isCurrent && !props.isThisPlayer,
    "user-name-this-player": props.isCurrent && props.isThisPlayer,
  });

  return (
    <div className="word-list-container">
      <div className="word-list-title">
        <div className={usernameClass}>{props.username}</div>
        <div className="user-score">{score}</div>
      </div>
      <div className="word-list">{wordListElt}</div>
    </div>
  );
}

export default WordList;
