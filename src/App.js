import Minesweeper from './Minesweeper';
import './App.css';

import start from './sounds/start.mp3';
import clear from './sounds/clear.mp3';
import warning from './sounds/warning.mp3';
import mark from './sounds/mark.mp3';
import unmark from './sounds/unmark.mp3';
import defeat from './sounds/defeat.mp3';
import victory from './sounds/victory.mp3';
import tutorialOpen from './sounds/tutorial-open.mp3';
import tutorialClosed from './sounds/tutorial-closed.mp3';

const sounds = {
  start,
  clear,
  warning,
  mark,
  unmark,
  defeat,
  victory,
  tutorialOpen,
  tutorialClosed,
};

const App = () => {
  const playSound = (name = 'default') => {
    const audio = document.createElement('audio');
    audio.src = `${sounds[name]}`;
    audio.volume = '0.20';
    audio.play();
  };

  return (
    <div className="app">
      <p className="title">
        <span>The Dragonsweeper minigame from </span>
        <a href="https://store.steampowered.com/app/740790/Goldmine/">Goldmine</a>
      </p>
      <Minesweeper playSound={playSound} />
    </div>
  );
};

export default App;
