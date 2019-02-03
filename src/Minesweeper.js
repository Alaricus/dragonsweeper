import React, { Component, Fragment } from 'react';
import Cell from './Cell';
// import Message from './Message';
// import playSound from '../sfxPlayer';

class Minesweeper extends Component {
  state = {
    board: [],
    width: 16,
    height: 10,
    amount: 0.2,
    flagged: 0,
    firstMove: true,
    defeated: false,
    victorious: false,
    acknowledged: false,
    tooltipStyle: { display: 'none' },
    composition: null,
  };

  componentDidMount() {
    // playSound('start', this.props.sfx);
    this.buildBoard();
  }

  getWarningNumber(row, col) {
    return this.getValidNeighbors(row, col).reduce((acc, cur) => this.state.board[cur.row][cur.col].mine ? acc += 1 : acc, 0);
  }

  getValidNeighbors(r, c) {
    const row = parseInt(r, 10);
    const col = parseInt(c, 10);
    const possibleNeighbors = [
      { row: row - 1, col: col - 1 }, { row: row - 1, col }, { row: row - 1, col: col + 1 },
      { row, col: col - 1 }, { row, col: col + 1 },
      { row: row + 1, col: col - 1 }, { row: row + 1, col }, { row: row + 1, col: col + 1 },
    ];

    return possibleNeighbors.filter(item =>
      item.row >= 0 && item.row < this.state.board.length
      && item.col >= 0 && item.col < this.state.board[0].length
      && this.state.board[item.row][item.col].number === null,
    );
  }

  clearEmptySpace(row, col) {
    const neighbors = this.getValidNeighbors(row, col);

    if (neighbors.length === 0) { return; }

    neighbors.forEach((item) => {
      const warningNumber = this.getWarningNumber(item.row, item.col);
      const arr = this.state.board;
      const cell = this.state.board[item.row][item.col];
      if (!cell.flag) {
        arr[item.row][item.col].number = warningNumber;
        if (warningNumber === 0) {
          this.clearEmptySpace(item.row, item.col);
        }
        this.setState({ board: arr });
      }
    });
  }

  buildBoard() {
    const w = this.state.width;
    const h = this.state.height;
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

    this.setState({ board: arr });
  }

  placeMines(r, c) {
    const w = this.state.width;
    const h = this.state.height;
    const mines = Math.ceil((w * h) * this.state.amount);
    let minesPlaced = 0;
    const arr = this.state.board;

    const clickArea = this.getValidNeighbors(r, c);
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

    this.setState({ board: arr });
  }

  handleClick = (e) => {
    const r = e.target.dataset.row;
    const c = e.target.dataset.col;

    if (this.state.firstMove) {
      this.placeMines(r, c);
    }

    if (!this.state.defeated && !this.state.victorious) {
      const cell = this.state.board[r][c];

      if (cell.flag) { return; }

      if (cell.mine) {
        this.handleDefeat();
        return;
      }

      const warningNumber = this.getWarningNumber(r, c);
      const arr = this.state.board;
      arr[r][c].number = warningNumber;
      if (warningNumber === 0) {
        // playSound('clear', this.props.sfx);
        this.clearEmptySpace(r, c);
      }
      // warningNumber > 0 && playSound('warning', this.props.sfx);

      this.setState({ board: arr, firstMove: false });

      this.checkVictoryCondition();
    }
  }

  handleRightClick = (e) => {
    e.preventDefault();

    if (!this.state.defeated && !this.state.victorious) {
      const r = e.target.dataset.row;
      const c = e.target.dataset.col;
      const cell = this.state.board[r][c];
      const arr = this.state.board;
      let { flagged } = this.state;

      if (cell.number === null) {
        if (cell.flag) {
          arr[r][c].flag = false;
          flagged -= 1;
          // playSound('mark', this.props.sfx);
        } else {
          arr[r][c].flag = true;
          flagged += 1;
          // playSound('unmark', this.props.sfx);
        }

        this.setState({ board: arr, flagged });
      }
    }
  }

  revealComposition = () => {
    if (!this.state.composition) {
      const composition = { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false };
      this.state.board.forEach((row, rowIntex) => {
        row.forEach((col, colIndex) => {
          const number = this.getWarningNumber(rowIntex, colIndex);
          if (number > 0 && !this.state.board[rowIntex][colIndex].mine) { composition[number] = true; }
        });
      });

      this.setState({ composition });
    }
  };

  checkVictoryCondition() {
    const flat = this.state.board.reduce((acc, cur) => [...acc, ...cur], []);
    const won = flat.every(item => item.number !== null || item.mine);
    if (won) {
      this.setState({ victorious: true });
    }
  }

  countResults() {
    const flat = this.state.board.reduce((acc, cur) => [...acc, ...cur], []);
    const results = flat.reduce((acc, cur) => {
      if (cur.number > 0) {
        acc.tally[cur.number] += 1;
      }
      if (cur.mine && !cur.flag) {
        acc.perfect = false;
      }
      return acc;
    }, {
      tally: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
      silent: this.state.victorious,
      perfect: true,
      prices: {
        1: 50000000000,
        2: 100000000000,
        3: 150000000000,
        4: 250000000000,
        5: 500000000000,
        6: 1000000000000,
        7: 2000000000000,
        8: 3000000000000,
        silent: 1000000000000,
        perfect: 2000000000000,
      },
    });

    results.tally[7] = this.state.bonusSeven ? results.tally[7] + 1 : results.tally[7];
    results.tally[8] = this.state.bonusEight ? results.tally[8] + 1 : results.tally[8];
    return results;
  }

  handleDefeat() {
    this.setState({ defeated: true });
  }

  acknowledgeEnd = () => {
    this.setState({ acknowledged: true });
    this.props.exit(this.countResults());
  }

  showTooltip = (e) => {
    const coords = [e.clientX, e.clientY];
    this.setState({
      tooltipStyle: {
        display: 'inline-block',
        top: `${coords[1] - 45}px`,
        left: `${coords[0] + 25}px`,
      },
    });
  }

  hideTooltip = () => {
    this.setState({
      tooltipStyle: {
        display: 'none',
      },
    });
  }

  render() {
    return (
      <Fragment>
        <div className="field">
          {
            this.state.board.map((row, rIndex) => (
              <div className="row" key={`row${rIndex}`}>
                {
                  row.map((cell, cIndex) => (
                    <Cell
                      defeated={this.state.defeated ? 1 : 0}
                      victorious={this.state.victorious ? 1 : 0}
                      handleClick={this.handleClick}
                      handleRightClick={this.handleRightClick}
                      rIndex={rIndex}
                      cIndex={cIndex}
                      cell={cell}
                      key={`${rIndex}-${cIndex}`}
                    />
                  ))
                }
              </div>
            ))
          }
          {/* { this.state.defeated
            && !this.state.acknowledged
            && <Message type="defeat" acknowledge={this.acknowledgeEnd} />
          }
          { this.state.victorious
            && !this.state.acknowledged
            && <Message type="victory" acknowledge={this.acknowledgeEnd} />
          } */}
        </div>
        <div className="egginfo">
          {`${this.state.flagged} ${this.state.flagged === 1 ? 'egg' : 'eggs'} marked out of ${this.state.width * this.state.height * this.state.amount} live ones`}
        </div>
      </Fragment>
    );
  }
}

export default Minesweeper;
