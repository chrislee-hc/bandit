import React from 'react';
import './Entry.css';

class Entry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      wordList: [],
    };
  }

  handleSubmit() {
    let valid = this.props.onSubmit(this.state.message);
    if (valid) {
      this.setState({
        wordList: [...this.state.wordList, this.state.message],
        message: '',
      })
    }
  }

  handleChange(event) {
    this.setState({
      wordList: this.state.wordList,
      message: event.target.value,
    })
  }

  handleKeyPress(e) {
    if (e.key === "Enter") {
      this.handleSubmit();
    }
  }

  render() {
    return (
      <div className="Entry">
        <input
          className="answer"
          onKeyPress={(event) => this.handleKeyPress(event)}
          onChange={(event) => this.handleChange(event)}
          value={this.state.message}
          ref={this.props.passedRef}
        />
      </div>
    );
  }
}

export default Entry;
