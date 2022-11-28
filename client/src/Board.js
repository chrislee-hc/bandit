import "./stylesheets/Board.css";

function Board(props) {
  return (
    <div className="tile-list-container">
      <div className="tile-list-title">Flipped Tiles</div>
      <div className="tile-list">
        {props.flippedTiles.map((tile, idx) => (
          <div className="tile" key={idx}>
            {tile.toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Board;
