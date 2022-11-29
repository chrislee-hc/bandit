import "./stylesheets/WordList.css";
import classNames from "classnames";

function WordList(props) {
  const wordListElt = props.wordList.map((elt, idx) => (
    <div key={idx} className="word-container">
      {elt.toUpperCase()}
    </div>
  ));

  let score = 0;
  for (let i = 0; i < props.wordList.length; i++) {
    score += props.wordList[i].length;
  }

  const usernameClass = classNames("WordList", {
    "user-name": !props.isCurrent,
    "user-name-current": props.isCurrent,
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
