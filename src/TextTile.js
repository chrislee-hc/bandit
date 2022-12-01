import "./stylesheets/TextTile.css";

function TextTile(props) {
  return <div className="text-letter-tile">{props.letter.toUpperCase()}</div>;
}

export default TextTile;
