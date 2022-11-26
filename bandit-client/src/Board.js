import {useState} from 'react';

function Board(props) {
  let letterDistributions = require('./data/letter_distributions.json');
  let genString = '';
  for (const letter in letterDistributions) {
    for (let i = 0; i < letterDistributions[letter]; i++) {
      genString += letter;
    }
  }

  const [tilesRemaining, setTilesRemaining] = useState(genString);
  
  const handleClick = () => {
    let idx = randomIndex(tilesRemaining);
    props.onFlip(tilesRemaining[idx]);
    setTilesRemaining(tilesRemaining.substring(0, idx)
                      + tilesRemaining.substring(idx + 1));
  }

  return (
    <div>
      <h2>{tilesRemaining.length}/{genString.length} tiles remaining</h2>
      <button
        className="start"
        onClick={() => handleClick()}
        disabled={tilesRemaining.length === 0}
      >
        Flip Tile
      </button>
      <p>{props.flippedTiles.join(' ')}</p>
    </div>
  );
}

function randomIndex(s) {
  return Math.floor(Math.random() * s.length);
}

export default Board;
