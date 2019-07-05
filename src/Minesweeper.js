import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import Cell from './Cell';
import Message from './Message';

const Minesweeper = ({ playSound }) => {
  const [board, setBoard] = useState([]);
  const [flagged, setFlagged] = useState(0);
  const [firstMove, setFirstMove] = useState(true);
  const [defeated, setDefeated] = useState(false);
  const [victorious, setVictorious] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [results, setResults] = useState(null);

  const width = 16;
  const height = 10;
  const amount = 0.2;

  const getValidNeighbors = (r, c, arr) => {
    const row = parseInt(r, 10);
    const col = parseInt(c, 10);
    const possibleNeighbors = [
      { row: row - 1, col: col - 1 }, { row: row - 1, col }, { row: row - 1, col: col + 1 },
      { row, col: col - 1 }, { row, col: col + 1 },
      { row: row + 1, col: col - 1 }, { row: row + 1, col }, { row: row + 1, col: col + 1 },
    ];

    return possibleNeighbors.filter(item => item.row >= 0 && item.row < arr.length
      && item.col >= 0 && item.col < arr[0].length
      && arr[item.row][item.col].number === null,
    );
  };

  const getWarningNumber = (row, col, arr) => {
    const validNeighbors = getValidNeighbors(row, col, arr);
    const count = validNeighbors.reduce((acc, cur) => {
      const cell = arr[cur.row][cur.col];
      acc = cell.mine ? acc + 1 : acc; // eslint-disable-line no-param-reassign
      return acc;
    }, 0);
    return count;
  };

  const clearEmptySpace = (row, col, arr) => {
    let arrToClear = arr;
    const neighbors = getValidNeighbors(row, col, arrToClear);

    if (neighbors.length === 0) { return arrToClear; }

    neighbors.forEach((item) => {
      const warningNumber = getWarningNumber(item.row, item.col, arrToClear);
      const cell = arrToClear[item.row][item.col];
      if (!cell.flag) {
        arrToClear[item.row][item.col].number = warningNumber;
        if (warningNumber === 0) {
          arrToClear = clearEmptySpace(item.row, item.col, arrToClear);
        }
      }
    });

    return arrToClear;
  };

  const buildBoard = () => {
    const w = width;
    const h = height;
    const arr = [];

    for (let i = 0; i < h; i++) {
      const row = [];
      for (let j = 0; j < w; j++) {
        row.push({
          mine: false,
          flag: false,
          number: null,
          floor: Math.floor(Math.random() * 3),
          egg: Math.floor(Math.random() * 3),
          dragon: Math.floor(Math.random() * 4),
        });
      }
      arr.push(row);
    }

    return arr;
  };

  const placeMines = (r, c) => {
    const w = width;
    const h = height;
    const mines = Math.ceil((w * h) * amount);
    let minesPlaced = 0;
    const arr = JSON.parse(JSON.stringify(board));

    const clickArea = getValidNeighbors(r, c, arr);
    clickArea.push({ row: parseInt(r, 10), col: parseInt(c, 10) });

    while (minesPlaced < mines) {
      const row = Math.floor(Math.random() * h);
      const col = Math.floor(Math.random() * w);
      const cell = arr[row][col];
      const isValid = !clickArea.some(spot => spot.row === row && spot.col === col);

      if (isValid && !cell.mine) {
        cell.mine = true;
        minesPlaced += 1;
      }
    }

    return arr;
  };

  const handleRightClick = (e) => {
    e.preventDefault();

    if (!defeated && !victorious) {
      const r = e.target.dataset.row;
      const c = e.target.dataset.col;
      const cell = JSON.parse(JSON.stringify(board))[r][c];
      const arr = JSON.parse(JSON.stringify(board));
      let isFlagged = flagged;

      if (cell.number === null) {
        if (cell.flag) {
          arr[r][c].flag = false;
          isFlagged -= 1;
          playSound('mark');
        } else {
          arr[r][c].flag = true;
          isFlagged += 1;
          playSound('unmark');
        }

        setBoard(arr);
        setFlagged(isFlagged);
      }
    }
  };

  const countResults = (arr, victory) => {
    const flat = arr.reduce((acc, cur) => [...acc, ...cur], []);
    const gameResults = flat.reduce((acc, cur) => {
      if (cur.number > 0) {
        acc.tally[cur.number] += 1;
      }
      if (cur.mine && !cur.flag) {
        acc.perfect = false;
      }
      return acc;
    }, {
      tally: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
      silent: victory,
      perfect: true,
    });

    return gameResults;
  };

  const checkVictoryCondition = (arr) => {
    const flat = arr.reduce((acc, cur) => [...acc, ...cur], []);
    const won = flat.every(item => item.number !== null || item.mine);
    if (won) {
      setVictorious(true);
      setResults(countResults(arr, true));
    }
  };

  const handleDefeat = () => {
    setDefeated(true);
    setResults(countResults(false));
  };

  const handleClick = (e) => {
    const r = e.target.dataset.row;
    const c = e.target.dataset.col;
    let arr = JSON.parse(JSON.stringify(board));

    const cell = arr[r][c];
    if (cell.flag) { return; }

    if (firstMove) {
      arr = placeMines(r, c);
      setFirstMove(false);
    }

    if (!defeated && !victorious) {
      if (cell.mine) {
        handleDefeat();
        return;
      }

      const warningNumber = getWarningNumber(r, c, arr);
      arr[r][c].number = warningNumber;
      if (warningNumber === 0) {
        playSound('clear');
        arr = clearEmptySpace(r, c, arr);
      }
      warningNumber > 0 && playSound('warning');

      setBoard(arr);
      checkVictoryCondition(arr);
    }
  };

  const acknowledgeEnd = () => {
    setAcknowledged(true);
  };

  useEffect(() => {
    playSound('start');
    setBoard(buildBoard());
  }, []);

  return (
    <Fragment>
      <div className="field">
        {
          board.map((row, rIndex) => (
            // It's fine to use indices here because the array shape never changes
            // eslint-disable-next-line react/no-array-index-key
            <div className="row" key={`row${rIndex}`}>
              {
                row.map((cell, cIndex) => (
                  <Cell
                    defeated={defeated ? 1 : 0}
                    victorious={victorious ? 1 : 0}
                    handleLeftClick={handleClick}
                    handleRightClick={handleRightClick}
                    rIndex={rIndex}
                    cIndex={cIndex}
                    cell={cell}
                    // eslint-disable-next-line react/no-array-index-key
                    key={`${rIndex}-${cIndex}`}
                  />
                ))
              }
            </div>
          ))
        }
        { defeated
          && !acknowledged
          && <Message type="defeat" acknowledge={acknowledgeEnd} playSound={playSound} />
        }
        { victorious
          && !acknowledged
          && <Message type="victory" acknowledge={acknowledgeEnd} playSound={playSound} />
        }
      </div>
      <div className="egginfo">
        {`${flagged} ${flagged === 1 ? 'egg' : 'eggs'} marked out of ${Math.ceil((width * height) * amount)} live ones`}
      </div>
      {
        acknowledged
        && (
          <Message
            type="results"
            results={results}
            playSound={playSound}
          />
        )
      }
    </Fragment>
  );
};

Minesweeper.propTypes = {
  playSound: PropTypes.func.isRequired,
};

export default Minesweeper;
