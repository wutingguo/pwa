import React, { Component } from 'react';
import { Collapse } from 'react-collapse';
import arrow from './icons/arrow.png';
import classNames from 'classnames';

import './index.scss';
class PricingCollapse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAllOpened: props.isAllOpened,
      isOpened: false
    };
  }

  componentWillReceiveProps(o, n) {
    const {isAllOpened} = this.state
    if (isAllOpened != o.isAllOpened) {
      this.setState({
        isAllOpened: o.isAllOpened,
        isOpened: o.isAllOpened
      });
    }
  }

  render() {
    const { isOpened } = this.state;
    const { html, element } = this.props;
    const arrowClass = classNames('arrow', {
      active: isOpened
    });
    return (
      <div className="estore-pricing-collapse">
        <div className="collapse-container" onClick={() => this.setState({ isOpened: !isOpened })}>
          <img className={arrowClass} src={arrow}></img>
          <div>{element && element.display_name}</div>
        </div>

        <Collapse isOpened={isOpened}>{html}</Collapse>
      </div>
    );
  }
}

export default PricingCollapse;
