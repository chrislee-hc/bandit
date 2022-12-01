import "./stylesheets/WordListWordTiles.css";

function WordListWordTiles(props) {
  return (
    <div className="word-list-word-tiles">
      {props.word.split("").map((letter, idx) => (
        <div className="word-list-letter-tile" key={idx}>
          {letter.toUpperCase()}
        </div>
      ))}
    </div>
  );
}

export default WordListWordTiles;
