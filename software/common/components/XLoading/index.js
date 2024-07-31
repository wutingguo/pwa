import React, { Component } from 'react';
import classNames from 'classnames';

import loadingIcon from './icon/loading.gif';
import loadingWithTextIcon from './icon/loadingWithText.png';

import './index.scss';

class XLoading extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { isShown, hasText, zIndex, size, backgroundColor, isCalculate, isFixed } = this.props;
    const xLoadingStyle = classNames('x-loading', {
      show: isShown,
      calculate: isCalculate
    });

    const style = {
      zIndex,
      backgroundColor,
      position: isFixed ? 'fixed' : 'absolute'
    };
    const loadImgUrl = hasText ? loadingWithTextIcon : loadingIcon;

    const iconClassName = hasText ? 'icon-text' : 'icon';
    const newIconClassName = classNames(iconClassName, size);

    return (
      <div className={xLoadingStyle} style={style} data-html2canvas-ignore="true">
        <div className="load-mask" style={style} />
        <div className="load-content" style={style}>
          <img className={newIconClassName} src={loadImgUrl} />
        </div>
      </div>
    );
  }
}

XLoading.defaultProps = {
  isShown: true,
  hasText: false,
  zIndex: 2000000000,
  size: 'normal',
  backgroundColor: '#fff'
};

export default XLoading;
