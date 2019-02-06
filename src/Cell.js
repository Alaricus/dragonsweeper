import React, { useState } from 'react';

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

export default Cell;
