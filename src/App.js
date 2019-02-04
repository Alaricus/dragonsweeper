import React, { Component } from 'react';
import Minesweeper from './Minesweeper';
import './App.css';

import start from './sounds/start.mp3';
import clear from './sounds/clear.mp3';
import warning from './sounds/warning.mp3';
import mark from './sounds/mark.mp3';
import unmark from './sounds/unmark.mp3';
import defeat from './sounds/defeat.mp3';
import victory from './sounds/victory.mp3';

const sounds = {
  start,
  clear,
  warning,
  mark,
  unmark,
  defeat,
  victory,
};

class App extends Component {
  playSound = (name = 'default') => {
    const audio = document.createElement('audio');
    audio.src = `${sounds[name]}`;
    audio.volume = '0.15';
    audio.play();
  };

  render() {
    return (
      <div className="app">
        <p className="title">The Dragonsweeper minigame from <a href="https://store.steampowered.com/app/740790/Goldmine/">Goldmine</a></p>
        <Minesweeper playSound={this.playSound} />
      </div>
    );
  }
}

export default App;
