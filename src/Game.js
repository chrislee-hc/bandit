import React from 'react';
import Board from './Board';
import Entry from './Entry';
import WordList from './WordList';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dictionary: require("./data/words_dictionary.json"),
      wordList: [],
      flippedTiles: [],
    }
  }

  handleSubmit(word) {
    let valid;
    if (!(word in this.state.dictionary)) {
      valid = false;
    }
    else {
      valid = true;
      let freqs = charCounts(word);
      let freqs_copy = JSON.parse(JSON.stringify(freqs));
      for (let i = 0; i < this.state.flippedTiles.length; i++) {
        if (this.state.flippedTiles[i] in freqs_copy) {
          freqs_copy[this.state.flippedTiles[i]]--;
        }
      }
      let maxFreq = 0;
      for (const c in freqs_copy) {
        maxFreq = Math.max(freqs_copy[c], maxFreq);
      }
      if (maxFreq > 0) {
        valid = false;
      }
      else {
        for (let i = this.state.flippedTiles.length - 1; i >= 0; i--) {
          let c = this.state.flippedTiles[i];
          if (c in freqs && freqs[c] > 0) {
            freqs[c]--;
            this.state.flippedTiles.splice(i, 1);
          }
        }
      }
      // TODO: check if word can be made from steals
    }
    if (valid) {
      this.setState({
        wordList: [...this.state.wordList, word],
      })
    }
    return valid;
  }

  handleFlip(tile) {
    this.setState({
      flippedTiles: [...this.state.flippedTiles, tile]
    });
  }

  render() {
    return (
      <div>
        <Board
          onFlip={(tile) => this.handleFlip(tile)} 
          flippedTiles={this.state.flippedTiles}
        />
        <Entry onSubmit={(word) => this.handleSubmit(word)} />
        <WordList wordList={this.state.wordList} />
      </div>
    );
  }
}

function charCounts(s) {
  return [...s].reduce((a, e) => { a[e] = a[e] ? a[e] + 1 : 1; return a }, {});
}

export default Game;