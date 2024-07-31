import classNames from 'classnames';
import React, { Component } from 'react';
import { Collapse } from 'react-collapse';

import arrow from '@apps/live-photo-client-mobile/icons/timeline-on.png';
import time from '@apps/live-photo-client-mobile/icons/timeline-time.png';

import './index.scss';

class LivePhotoCollapse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      element: this.props.element,
      isOpened: false,
    };
  }

  componentWillReceiveProps(o, n) {}

  componentDidMount() {
    const { defaultOpened } = this.props;
    if (defaultOpened) {
      this.opened();
    }
  }
  opened = () => {
    const { showCollapsePhotosGroup } = this.props;
    const { element, isOpened } = this.state;
    this.setState({
      isOpened: !isOpened,
    });
    showCollapsePhotosGroup(element);
  };

  render() {
    const { html, defaultOpened, children } = this.props;
    const { element, isOpened } = this.state;
    const { begin_time, hasMore, images = [] } = element;

    const arrowClass = classNames('arrow', {
      active: isOpened,
    });
    // console.log('defaultOpened', defaultOpened, images, this.state.element);
    // if (!images.length) return null;
    return (
      <div className="live-photo-collapse">
        <div className="collapse-container" onClick={() => this.opened()}>
          <img className="icon" src={time}></img>
          <text>{begin_time}</text>
          <img className={arrowClass} src={arrow}></img>
        </div>
        <Collapse isOpened={isOpened}>
          {typeof children === 'function' ? children(images, hasMore) : children}
        </Collapse>
        <div className="line"></div>
      </div>
    );
  }
}

export default LivePhotoCollapse;
