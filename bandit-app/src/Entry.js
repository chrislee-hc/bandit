import {useState} from 'react';
import './Entry.css';

function Entry() {
  const [message, setMessage] = useState('');
  const [wordList, setWordList] = useState([]);

  const handleSubmit = () => {
    setWordList(wordList => [...wordList, message]);
    setMessage('');
    return;
  }

  const handleChange = event => {
    setMessage(event.target.value);
  }

  const handleKeyPress = e => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  }

  const wordListElt = wordList.map((elt, idx) =>
    <li key={idx}>{elt}</li>
  );

  return (
    <div className="Entry">
      <input
        className="answer"
        onKeyPress={handleKeyPress}
        onChange={handleChange}
        value={message}
      />

      <h2>Words:</h2>
      <ul>{wordListElt}</ul>
    </div>
  );
}

export default Entry;
