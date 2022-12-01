import TextTile from "./TextTile.js";
import "./stylesheets/WordTiles.css";

let count = 0;
function WordTiles(props) {
  return (
    <div className="text-word-tiles" key={props.word + count++}>
      {props.word.split("").map((letter, idx) => (
        <TextTile letter={letter} key={idx} />
      ))}
    </div>
  );
}

export default WordTiles;
