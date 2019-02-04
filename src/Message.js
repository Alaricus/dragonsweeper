import React, { Component } from 'react';

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

class Message extends Component {
  processProps = () => {
    if (this.props.type === 'defeat') {
      this.props.playSound('defeat');
      this.displayStyle = { display: 'block' };
      this.messageTitle = 'Oh no!';
      this.messageBody = (
        <p style={{ textAlign: 'justify', textAlignLast: 'left', lineHeight: '1.5' }}>
          You woke up the hatchlings! Adorable as they are, you really don't want to be here
          when their mother shows up to greet them. Take what gems you found and make your escape!
        </p>
      );
      this.buttonText = 'Run!';
      this.closeMessage = () => {
        this.props.playSound('tutorialClosed');
        this.props.acknowledge();
      };
    }

    if (this.props.type === 'victory') {
      this.props.playSound('victory');
      this.displayStyle = { display: 'block' };
      this.messageTitle = 'A craftly little ... foreman!';
      this.messageBody = (
        <p style={{ textAlign: 'justify', textAlignLast: 'left', lineHeight: '1.5' }}>
          You did it! You managed to collect all the gems without waking up the hatchlings! That
          took some skill for sure. Go on then, enjoy your newfound riches. You've earned them!
        </p>
      );
      this.buttonText = 'Leave';
      this.closeMessage = () => {
        this.props.playSound('tutorialClosed');
        this.props.acknowledge();
      };
    }

    if (this.props.type === 'results') {
      this.props.playSound('tutorialOpen');
      this.displayStyle = { display: 'block', top: '100px' };
      this.messageTitle = 'Loot Report';
      this.messageBody = Object.keys(this.props.results.tally).map((gem) => {
        if (this.props.results.tally[gem] > 0) {
          return (
            <div key={gem} className="loot">
              <div className="gem">
                <img src={icons[gem]} alt={`gem${gem}`} style={{ verticalAlign: 'middle' }} />
              </div>
              <div className="price">
                {` x ${this.props.results.tally[gem]}`}
              </div>
            </div>
          );
        }
        return null;
      });

      this.messageBody.push(
        <div className="loot" key="slient">
          <div className="gem">
            <img src={icons.dragon} alt="silent" style={{ verticalAlign: 'middle' }} />
          </div>
          <div className="price">
            { this.props.results.silent ? 'eggs didn\'t hatch' : 'dragons hatched' }
          </div>
        </div>,
      );

      this.messageBody.push(
        <div className="loot" key="perfect">
          <div className="gem">
            <img src={icons.marked} alt="perfect" style={{ verticalAlign: 'middle' }} />
          </div>
          <div className="price">
            { this.props.results.perfect ? 'all eggs marked' : 'not every living egg was marked' }
          </div>
        </div>,
      );

      this.buttonText = 'Very Well';
      this.closeMessage = () => {
        this.props.playSound('tutorialClosed');
        this.props.dismiss();
      };
    }
  }

  render() {
    this.processProps();
    return (
      <div
        className={`
          block
          ${this.props.type === 'defeat' && 'blocklight'}
        `}
        onClick={() => { this.props.type === 'settings' && this.closeMessage(); }}
      >
        <div className="message" style={this.displayStyle} onClick={(e) => { e.stopPropagation(); }}>
          <div className="MinerAmount">{this.messageTitle}</div>
          <img alt="line" src={line} />
          {this.messageBody}
          <div className="messageButton activeCursor" onClick={this.closeMessage}>{this.buttonText}</div>
        </div>
      </div>
    );
  }
}

export default Message;
