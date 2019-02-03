import React, { Component } from 'react';

export default class Cell extends Component {
  state = {
    hovering: false,
  }

  handleMouseEnter = () => {
    this.props.cell.number === null
    && !this.props.defeated
    && !this.props.victorious
    && this.setState({ hovering: true });
  }

  handleMouseLeave = () => {
    this.setState({ hovering: false });
  }

  handleClick = (e) => {
    this.setState({ hovering: false });
    this.props.handleClick(e);
  }

  render() {
    return (
      <div
        className={`
          ${`floor${this.props.cell.floor}`}
          ${this.state.hovering ? 'hover' : 'nohover'}
        `}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <div
          defeated={this.props.defeated}
          victorious={this.props.victorious}
          onClick={this.handleClick}
          onContextMenu={this.props.handleRightClick}
          className={`
            ${`cell${this.props.cell.egg}`}
            ${this.props.cell.number !== null && `open${this.props.cell.number}`}
            ${this.props.cell.number === null && 'activeCursor'}
            ${this.props.defeated && this.props.cell.mine && `dragon${this.props.cell.dragon}`}
          `}
          data-row={this.props.rIndex}
          data-col={this.props.cIndex}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        >
          <div
            className={`
              ${this.props.cell.flag && !this.props.defeated? 'flag' : 'noflag'}
            `}
          />
        </div>
      </div>
    );
  }
}
