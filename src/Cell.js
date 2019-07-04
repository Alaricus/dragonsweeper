import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Cell = ({
  cell,
  defeated,
  victorious,
  handleLeftClick,
  handleRightClick,
  rIndex,
  cIndex,
}) => {
  const [hovering, setHovering] = useState(false);

  const handleMouseEnter = () => {
    cell.number === null
    && !defeated
    && !victorious
    && setHovering(true);
  };

  const handleMouseLeave = () => {
    setHovering(false);
  };

  const handleClick = (e) => {
    setHovering(false);
    handleLeftClick(e);
  };

  return (
    <div
      className={`
        ${`floor${cell.floor}`}
        ${hovering ? 'hover' : 'nohover'}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        defeated={defeated}
        victorious={victorious}
        onClick={handleClick}
        onContextMenu={handleRightClick}
        className={`
          ${`cell${cell.egg}`}
          ${cell.number !== null && `open${cell.number}`}
          ${cell.number === null && 'activeCursor'}
          ${defeated && cell.mine && `dragon${cell.dragon}`}
        `}
        data-row={rIndex}
        data-col={cIndex}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={`
            ${cell.flag && !defeated ? 'flag' : 'noflag'}
          `}
        />
      </div>
    </div>
  );
};

Cell.propTypes = {
  cell: PropTypes.shape({
    dragon: PropTypes.number.isRequired,
    egg: PropTypes.number.isRequired,
    flag: PropTypes.bool.isRequired,
    floor: PropTypes.number.isRequired,
    mine: PropTypes.bool.isRequired,
    number: PropTypes.number,
  }).isRequired,
  defeated: PropTypes.number.isRequired,
  victorious: PropTypes.number.isRequired,
  handleLeftClick: PropTypes.func.isRequired,
  handleRightClick: PropTypes.func.isRequired,
  rIndex: PropTypes.number.isRequired,
  cIndex: PropTypes.number.isRequired,
};

export default Cell;
