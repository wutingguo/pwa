import React, { Component } from 'react';
import closeButton from './close.png';
import { isBrowserEnv } from '@resource/lib/utils/env';
import './index.scss';
import classNames from 'classnames';

export default class XModal extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (isBrowserEnv()) {
      document.body.style.overflow = 'hidden';
    }
  }

  componentWillUnmount() {
    if (isBrowserEnv()) {
      document.body.style.overflow = '';
    }
  }

  render() {
    const { data, actions, children, isShowCloseButton = false } = this.props;
    const { title, className, isHideIcon, backdropColor } = data;
    const { handleClose } = actions;
    const backdropStyle = {};
    if (backdropColor) {
      backdropStyle.backgroundColor = backdropColor;
    }
    const modalClass = className ? `info-view ${className}` : 'info-view';
    const buttonClass = classNames('close-button', {
      topWindow: isShowCloseButton
    });
    return (
      <div className="xmodal-info-container" style={backdropStyle}>
        <div className={modalClass}>
          {isHideIcon ? null : (
            <img className={buttonClass} src={closeButton} onClick={() => handleClose()} />
          )}
          {title ? <div className="title">{title}</div> : null}

          {children}
        </div>
      </div>
    );
  }
}
