import WordList from "./WordList";
import "./WordListBoard.css";

function WordListBoard(props) {
  return (
    <div className="word-lists-container">
      {Object.keys(props.wordLists).map((username, idx) => (
        <WordList
          socket={props.socket}
          username={username}
          wordList={props.wordLists[username]}
          key={idx}
        />
      ))}
    </div>
  );
}

export default WordListBoard;
