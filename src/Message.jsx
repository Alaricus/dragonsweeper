import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import line from './images/line.png';
import gem1 from './images/open1.png';
import gem2 from './images/open2.png';
import gem3 from './images/open3.png';
import gem4 from './images/open4.png';
import gem5 from './images/open5.png';
import gem6 from './images/open6.png';
import gem7 from './images/open7.png';
import gem8 from './images/open8.png';
import dragon from './images/dragon0.png';
import marked from './images/marked.png';

const icons = {
  1: gem1,
  2: gem2,
  3: gem3,
  4: gem4,
  5: gem5,
  6: gem6,
  7: gem7,
  8: gem8,
  dragon,
  marked,
};

const Message = props => {
  const buttonRef = useRef(null);

  const { type, results, playSound, acknowledge } = props;
  const dismiss = () => { window.location.reload(); };

  let displayStyle = null;
  let messageTitle = null;
  let messageBody = null;
  let buttonText = null;
  let closeMessage = null;

  useEffect(() => {
    buttonRef.current.focus();
  }, []);

  const handleKeyDown = e => {
    if (e.key === ' ' || e.key === 'Enter') {
      closeMessage();
    }
  };

  const processProps = () => {
    if (type === 'defeat') {
      playSound('defeat');
      displayStyle = { display: 'block' };
      messageTitle = 'Oh no!';
      messageBody = (
        <p style={{ textAlign: 'justify', textAlignLast: 'left', lineHeight: '1.5' }}>
          You woke up the hatchlings! Adorable as they are, you really don&apos;t want to be here
          when their mother shows up to greet them. Take what gems you found and make your escape!
        </p>
      );
      buttonText = 'Run!';
      closeMessage = () => {
        playSound('tutorialClosed');
        acknowledge();
      };
    }

    if (type === 'victory') {
      playSound('victory');
      displayStyle = { display: 'block' };
      messageTitle = 'A craftly little ... foreman!';
      messageBody = (
        <p style={{ textAlign: 'justify', textAlignLast: 'left', lineHeight: '1.5' }}>
          You did it! You managed to collect all the gems without waking up the hatchlings! That
          took some skill for sure. Go on then, enjoy your newfound riches. You&apos;ve earned them!
        </p>
      );
      buttonText = 'Leave';
      closeMessage = () => {
        playSound('tutorialClosed');
        acknowledge();
      };
    }

    if (type === 'results') {
      playSound('tutorialOpen');
      displayStyle = { display: 'block', top: '100px' };
      messageTitle = 'Endgame Report';
      messageBody = Object.keys(results.tally).map(gem => {
        if (results.tally[gem] > 0) {
          return (
            <div key={gem} className="loot">
              <div className="gem">
                <img src={icons[gem]} alt={`gem${gem}`} style={{ verticalAlign: 'middle' }} />
              </div>
              <div className="price">
                {` x ${results.tally[gem]}`}
              </div>
            </div>
          );
        }
        return null;
      });

      messageBody.push(
        <div className="loot" key="slient">
          <div className="gem">
            <img src={icons.dragon} alt="silent" style={{ verticalAlign: 'middle' }} />
          </div>
          <div className="price">
            { results.silent ? 'eggs didn\'t hatch' : 'dragons hatched' }
          </div>
        </div>,
      );

      messageBody.push(
        <div className="loot" key="perfect">
          <div className="gem">
            <img src={icons.marked} alt="perfect" style={{ verticalAlign: 'middle' }} />
          </div>
          <div className="price">
            { results.perfect ? 'all eggs marked' : 'not every living egg was marked' }
          </div>
        </div>,
      );

      buttonText = 'Very Well';
      closeMessage = () => {
        playSound('tutorialClosed');
        dismiss();
      };
    }
  };

  processProps();

  return (
    <div className={`block ${type === 'defeat' && 'blocklight'}`}>
      {
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div className="message" style={displayStyle} onClick={e => { e.stopPropagation(); }}>
          <div className="MinerAmount">{messageTitle}</div>
          <img alt="line" src={line} />
          {messageBody}
          <div
            role="button"
            className="messageButton activeCursor"
            onClick={closeMessage}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            ref={buttonRef}
          >
            {buttonText}
          </div>
        </div>
      }
    </div>
  );
};

Message.defaultProps = {
  results: {
    perfect: false,
    silent: false,
    tally: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
    },
  },
  acknowledge: () => {},
};

Message.propTypes = {
  type: PropTypes.string.isRequired,
  playSound: PropTypes.func.isRequired,
  results: PropTypes.shape({
    perfect: PropTypes.bool,
    silent: PropTypes.bool,
    tally: PropTypes.shape({
      1: PropTypes.number,
      2: PropTypes.number,
      3: PropTypes.number,
      4: PropTypes.number,
      5: PropTypes.number,
      6: PropTypes.number,
      7: PropTypes.number,
      8: PropTypes.number,
    }),
  }),
  acknowledge: PropTypes.func,
};

export default Message;
