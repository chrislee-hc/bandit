import WordList from "./WordList";
import "./stylesheets/WordListBoard.css";

function WordListBoard(props) {
  return (
    <div className="word-lists-container">
      {Object.keys(props.wordLists).map((username, idx) => (
        <WordList
          socket={props.socket}
          username={username}
          isCurrent={username === props.currentPlayer}
          wordList={props.wordLists[username]}
          key={idx}
        />
      ))}
    </div>
  );
}

export default WordListBoard;
