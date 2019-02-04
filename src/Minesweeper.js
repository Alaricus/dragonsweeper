import React, { Component, Fragment } from 'react';
import Cell from './Cell';
import Message from './Message';

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
    results: null,
  };

  componentDidMount() {
    this.props.playSound('start');
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
        this.props.playSound('clear');
        this.clearEmptySpace(r, c);
      }
      warningNumber > 0 && this.props.playSound('warning');

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
          this.props.playSound('mark');
        } else {
          arr[r][c].flag = true;
          flagged += 1;
          this.props.playSound('unmark');
        }

        this.setState({ board: arr, flagged });
      }
    }
  }

  checkVictoryCondition() {
    const flat = this.state.board.reduce((acc, cur) => [...acc, ...cur], []);
    const won = flat.every(item => item.number !== null || item.mine);
    if (won) {
      this.setState({ victorious: true, results: this.countResults(true) });
    }
  }

  countResults(victory) {
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
      silent: victory,
      perfect: true,
    });

    return results;
  }

  handleDefeat() {
    this.setState({ defeated: true, results: this.countResults(false) });
  }

  acknowledgeEnd = () => {
    this.setState({ acknowledged: true });
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
          { this.state.defeated
            && !this.state.acknowledged
            && <Message type="defeat" acknowledge={this.acknowledgeEnd} playSound={this.props.playSound} />
          }
          { this.state.victorious
            && !this.state.acknowledged
            && <Message type="victory" acknowledge={this.acknowledgeEnd} playSound={this.props.playSound} />
          }
        </div>
        <div className="egginfo">
          {`${this.state.flagged} ${this.state.flagged === 1 ? 'egg' : 'eggs'} marked out of 32 live ones`}
        </div>
        {
          this.state.acknowledged
          && <Message
            type="results"
            results={this.state.results}
            playSound={this.props.playSound}
            dismiss={() => { window.location.reload(); }}
          />
        }
      </Fragment>
    );
  }
}

export default Minesweeper;
