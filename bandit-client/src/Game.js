import React, { useEffect, useState, useRef } from "react";

import Reset from "./Reset";
import Board from "./Board";
import Entry from "./Entry";
import WordList from "./WordList";

function Game(props) {
  let dictionary = require("./data/words_dictionary.json");
  let [wordList, setWordList] = useState([]);
  let [flippedTiles, setFlippedTiles] = useState([]);
  let ref = useRef(null);

  useEffect(() => {
    const flipListener = (newFlippedTiles) => {
      setFlippedTiles(newFlippedTiles);
    };

    props.socket.on("updateFlippedTiles", flipListener);

    return () => {
      props.socket.off("updateFlippedTiles");
    };
  }, [props.socket]);

  const handleSubmit = (word) => {
    let valid;
    if (!(word in dictionary)) {
      return false;
    }

    // check if word can be made from board alone
    valid = true;
    let freqs = charCounts(word);
    let freqs_copy = JSON.parse(JSON.stringify(freqs));
    for (let i = 0; i < flippedTiles.length; i++) {
      if (flippedTiles[i] in freqs_copy) {
        freqs_copy[flippedTiles[i]]--;
      }
    }
    if (countMaxVal(freqs_copy) <= 0) {
      for (let i = flippedTiles.length - 1; i >= 0; i--) {
        let c = flippedTiles[i];
        if (c in freqs && freqs[c] > 0) {
          freqs[c]--;
          flippedTiles.splice(i, 1);
        }
      }
    } else {
      let stealFrom = -1;
      for (let i = wordList.length - 1; i >= 0; i--) {
        let curWord = wordList[i];
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
        for (let j = 0; j < flippedTiles.length; j++) {
          if (flippedTiles[j] in freqs_copy) {
            freqs_copy[flippedTiles[j]]--;
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
          wordList.splice(i, 1);
          for (let j = flippedTiles.length - 1; j >= 0; j--) {
            let c = flippedTiles[j];
            if (c in freqs && freqs[c] > 0) {
              freqs[c]--;
              flippedTiles.splice(j, 1);
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
      setWordList([...this.state.wordList, word]);
    }
    return valid;
  };

  return (
    <div>
      <Reset socket={props.socket} />
      <Board
        flippedTiles={flippedTiles}
        socket={props.socket}
        passedRef={ref}
      />
      <Entry
        onSubmit={(word) => handleSubmit(word)}
        passedRef={ref}
        socket={props.socket}
      />
      <WordList socket={props.socket} />
    </div>
  );
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
