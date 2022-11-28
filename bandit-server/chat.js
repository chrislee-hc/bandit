const uuidv4 = require("uuid").v4;

const messages = new Set();
const users = new Map();

const defaultUser = {
  id: "anon",
  name: "Anonymous",
};

const messageExpirationTimeMS = 5 * 60 * 1000;
const dictionary = require("./data/words_dictionary.json");
const letterDistributions = require("./data/letter_distributions.json");

let flippedTiles = [];

const initTilesRemaining = () => {
  let tilesRemaining = "";
  for (const letter in letterDistributions) {
    for (let i = 0; i < letterDistributions[letter]; i++) {
      tilesRemaining += letter;
    }
  }
  return tilesRemaining;
};
let tilesRemaining = initTilesRemaining();
let wordList = [];
let wordLists = {};
let usernames = [];

class Connection {
  constructor(io, socket) {
    this.socket = socket;
    this.io = io;

    // connection messages
    socket.emit("serverRestart");

    socket.on("getMessages", () => this.getMessages());
    socket.on("message", (value) => this.handleMessage(value));
    socket.on("disconnect", () => this.disconnect());
    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
    socket.on("flip", () => this.handleFlip());
    socket.on("word", (word) => this.handleWord(word));
    socket.on("reset", () => this.handleReset());
    socket.on("username", (name) => this.handleUsername(name));
  }

  handleFlip() {
    let idx = Math.floor(Math.random() * tilesRemaining.length);
    flippedTiles = [...flippedTiles, tilesRemaining[idx]];
    tilesRemaining =
      tilesRemaining.substring(0, idx) + tilesRemaining.substring(idx + 1);
    this.io.sockets.emit("updateFlippedTiles", flippedTiles);
    this.io.sockets.emit("numTilesUpdate", tilesRemaining.length);
  }

  handleWord([word, username]) {
    let valid;
    word = word.toLowerCase();
    if (!(word in dictionary)) {
      this.socket.emit("wordResponse", false);
      valid = false;
      return;
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
      this.socket.emit("wordResponse", true);
      this.io.sockets.emit("updateFlippedTiles", flippedTiles);
    } else {
      let stealFrom = -1;
      for (let stealUsername in wordLists) {
        let wordList = wordLists[stealUsername];
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

            this.socket.emit("wordResponse", true);
            this.io.sockets.emit("updateFlippedTiles", flippedTiles);
            break;
          }
        }
      }
      if (stealFrom === -1) {
        valid = false;
        this.socket.emit("wordResponse", false);
        return;
      }
    }
    // TODO: check more edge cases
    // TODO: improve similarity heuristic
    // TODO: check for multi-word steals

    if (valid) {
      wordList = [...wordList, word];
      this.io.sockets.emit("updateWordList", wordList);
      wordLists[username] = [...wordLists[username], word];
      this.io.sockets.emit("updateWordLists", wordLists);
    }
    return valid;
  }

  handleReset() {
    flippedTiles = [];
    wordList = [];
    tilesRemaining = initTilesRemaining();
    this.io.sockets.emit("updateFlippedTiles", flippedTiles);
    this.io.sockets.emit("numTilesUpdate", tilesRemaining.length);
    this.io.sockets.emit("updateWordList", wordList);
  }

  handleUsername(username) {
    username = username.toLowerCase();
    for (let i = 0; i < usernames.length; i++) {
      if (usernames[i] === username) {
        this.socket.emit("usernameResponse", false);
        return;
      }
    }
    this.socket.emit("usernameResponse", true);
    usernames = [...usernames, username];
    wordLists[username] = [];
    this.io.sockets.emit("updateWordLists", wordLists);
    this.socket.emit("numTilesUpdate", tilesRemaining.length);
    this.socket.emit("updateFlippedTiles", flippedTiles);
  }

  sendMessage(message) {
    this.io.sockets.emit("message", message);
  }

  getMessages() {
    messages.forEach((message) => this.sendMessage(message));
  }

  handleMessage(value) {
    const message = {
      id: uuidv4(),
      user: users.get(this.socket) || defaultUser,
      value,
      time: Date.now(),
    };

    messages.add(message);
    this.sendMessage(message);

    setTimeout(() => {
      messages.delete(message);
      this.io.sockets.emit("deleteMessage", message.id);
    }, messageExpirationTimeMS);
  }

  disconnect() {
    users.delete(this.socket);
  }
}

function chat(io) {
  io.on("connection", (socket) => {
    new Connection(io, socket);
  });
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

module.exports = chat;
