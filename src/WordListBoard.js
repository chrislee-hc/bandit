import WordList from "./WordList";
import "./stylesheets/WordListBoard.css";

function WordListBoard(props) {
  return (
    <div className="word-lists-container">
      {Object.keys(props.wordLists).map((username, idx) => (
        <WordList
          socket={props.socket}
          username={username}
          isThisPlayer={
            username === props.thisPlayer && props.numTilesRemaining > 0
          }
          isCurrent={
            username === props.currentPlayer && props.numTilesRemaining > 0
          }
          wordList={props.wordLists[username]}
          key={idx}
        />
      ))}
    </div>
  );
}

export default WordListBoard;
