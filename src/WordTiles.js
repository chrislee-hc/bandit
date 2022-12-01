import TextTile from "./TextTile.js";
import "./stylesheets/WordTiles.css";

function WordTiles(props) {
  return (
    <div className="text-word-tiles">
      {props.word.split("").map((letter, idx) => (
        <TextTile letter={letter} key={idx} />
      ))}
    </div>
  );
}

export default WordTiles;
