import React from 'react';

function WordList(props) {
  const wordListElt = props.wordList.map((elt, idx) =>
    <li key={idx}>{elt}</li>
  )

  return (
    <div>
      <h2>Words:</h2>
      <ul>{wordListElt}</ul>
    </div>
  );
}

export default WordList;
