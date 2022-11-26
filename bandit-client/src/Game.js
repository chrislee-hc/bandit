import React from "react";

import Board from "./Board";
import Entry from "./Entry";
import WordList from "./WordList";

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dictionary: require("./data/words_dictionary.json"),
      wordList: [],
      flippedTiles: [],
    };
    this.ref = React.createRef();
  }

  handleSubmit(word) {
    let valid;
    if (!(word in this.state.dictionary)) {
      return false;
    }

    // check if word can be made from board alone
    valid = true;
    let freqs = charCounts(word);
    let freqs_copy = JSON.parse(JSON.stringify(freqs));
    for (let i = 0; i < this.state.flippedTiles.length; i++) {
      if (this.state.flippedTiles[i] in freqs_copy) {
        freqs_copy[this.state.flippedTiles[i]]--;
      }
    }
    if (countMaxVal(freqs_copy) <= 0) {
      for (let i = this.state.flippedTiles.length - 1; i >= 0; i--) {
        let c = this.state.flippedTiles[i];
        if (c in freqs && freqs[c] > 0) {
          freqs[c]--;
          this.state.flippedTiles.splice(i, 1);
        }
      }
    } else {
      let stealFrom = -1;
      for (let i = this.state.wordList.length - 1; i >= 0; i--) {
        let curWord = this.state.wordList[i];
        // very rough heuristic for words that are very similar
        if (
          word === curWord + "s" ||
          word === curWord + "es" ||
          word === curWord + "d" ||
          word === curWord + "ed" ||
          word === curWord + "ing" ||
          word === curWord + "y"
        ) {
          continue;
        }
        freqs_copy = JSON.parse(JSON.stringify(freqs));
        let validSteal = true;
        let curWordFreqs = charCounts(curWord);
        for (let c in curWordFreqs) {
          if (!(c in freqs_copy)) {
            validSteal = false;
          } else {
            if (curWordFreqs[c] > freqs_copy[c]) {
              validSteal = false;
            }
            freqs_copy[c] -= curWordFreqs[c];
          }
        }
        if (!validSteal) {
          continue;
        }
        if (countMaxVal(freqs_copy) <= 0) {
          continue;
        }
        for (let j = 0; j < this.state.flippedTiles.length; j++) {
          if (this.state.flippedTiles[j] in freqs_copy) {
            freqs_copy[this.state.flippedTiles[j]]--;
          }
        }
        if (countMaxVal(freqs_copy) <= 0) {
          stealFrom = i;
          for (let j = 0; j < curWord.length; j++) {
            let c = curWord[j];
            if (c in freqs && freqs[c] > 0) {
              freqs[c]--;
            }
          }
          this.state.wordList.splice(i, 1);
          for (let j = this.state.flippedTiles.length - 1; j >= 0; j--) {
            let c = this.state.flippedTiles[j];
            if (c in freqs && freqs[c] > 0) {
              freqs[c]--;
              this.state.flippedTiles.splice(j, 1);
            }
          }
          break;
        }
      }
      if (stealFrom === -1) {
        valid = false;
      }
    }
    // TODO: check more edge cases
    // TODO: improve similarity heuristic
    // TODO: check for multi-word steals

    if (valid) {
      this.setState({
        wordList: [...this.state.wordList, word],
      });
    }
    return valid;
  }

  handleFlip(tile) {
    this.setState({
      flippedTiles: [...this.state.flippedTiles, tile],
    });
    this.ref.current.focus();
  }

  render() {
    return (
      <div>
        <Board
          onFlip={(tile) => this.handleFlip(tile)}
          flippedTiles={this.state.flippedTiles}
        />
        <Entry
          onSubmit={(word) => this.handleSubmit(word)}
          passedRef={this.ref}
          socket={this.props.socket}
        />
        <WordList wordList={this.state.wordList} />
      </div>
    );
  }
}

function charCounts(s) {
  return [...s].reduce((a, e) => {
    a[e] = a[e] ? a[e] + 1 : 1;
    return a;
  }, {});
}

function countMaxVal(o) {
  let out = 0;
  for (const elt in o) {
    out = Math.max(o[elt], out);
  }
  return out;
}

export default Game;
