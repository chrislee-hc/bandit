import "./stylesheets/WordList.css";

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

  return (
    <div className="word-list-container">
      <div className="word-list-title">
        <div className="user-name">{props.username}</div>
        <div className="user-score">{score}</div>
      </div>
      <div className="word-list">{wordListElt}</div>
    </div>
  );
}

export default WordList;
