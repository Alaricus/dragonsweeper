import React, { Component } from 'react';
import Minesweeper from './Minesweeper';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Minesweeper />
      </div>
    );
  }
}

export default App;
