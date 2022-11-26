import {useState} from 'react';

function Board() {
  let letterDistributions = require('./data/letter_distributions.json');
  let genString = '';
  for (const letter in letterDistributions) {
    for (let i = 0; i < letterDistributions[letter]; i++) {
      genString += letter;
    }
  }

  const [tilesRemaining, setTilesRemaining] = useState(genString);
  const [flippedTiles, setFlippedTiles] = useState([]);
  
  const handleClick = () => {
    let idx = randomIndex(tilesRemaining);
    setFlippedTiles(flippedTiles => [...flippedTiles, tilesRemaining[idx]]);
    setTilesRemaining(tilesRemaining.substring(0, idx)
                      + tilesRemaining.substring(idx + 1));
  }

  let flippedTilesElt = flippedTiles.map((elt, idx) =>
    <li key={idx}>{elt}</li>
  )
  return (
    <div>
      <button
        className="start"
        onClick={() => handleClick()}
        disabled={tilesRemaining.length === 0}
      >
        Flip Tile
      </button>
      <ul>{flippedTilesElt}</ul>
    </div>
  );
}

function randomIndex(s) {
  return Math.floor(Math.random() * s.length);
}

export default Board;