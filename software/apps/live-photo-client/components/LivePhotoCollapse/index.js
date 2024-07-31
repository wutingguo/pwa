import React, { Component } from 'react';
import { Collapse } from 'react-collapse';
import time from '@apps/live-photo-client/icons/timeline-time.png';
import arrow from '@apps/live-photo-client/icons/timeline-on.png';
import classNames from 'classnames';

import './index.scss';
class LivePhotoCollapse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpened: false
    };
  }

  componentWillReceiveProps(o, n) {}

  opened = () => {
    const { isOpened } = this.state;
    const { element, showCollapsePhotosGroup } = this.props;
    showCollapsePhotosGroup(element);
    this.setState({ isOpened: !isOpened });
  };

  render() {
    const { isOpened } = this.state;
    const { html, element } = this.props;
    const { begin_time } = element;
    const arrowClass = classNames('arrow', {
      active: isOpened
    });
    return (
      <div className="live-photo-collapse">
        <div className="collapse-container" onClick={() => this.opened()}>
          <img className="icon" src={time}></img>
          <text>{begin_time}</text>
          <img className={arrowClass} src={arrow}></img>
        </div>
        <Collapse isOpened={isOpened}>{html}</Collapse>
        <div className="line"></div>
      </div>
    );
  }
}

export default LivePhotoCollapse;
