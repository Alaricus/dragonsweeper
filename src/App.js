import React, { Component } from 'react';
import Minesweeper from './Minesweeper';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="app">
        <p className="title">The Dragonsweeper minigame from <a href="https://store.steampowered.com/app/740790/Goldmine/">Goldmine</a></p>
        <Minesweeper />
      </div>
    );
  }
}

export default App;
