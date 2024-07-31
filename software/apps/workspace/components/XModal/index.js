import React, { Component } from 'react';
import closeButton from './close.png';
import './index.scss';

export default class XModal extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    document.body.style.overflow = 'hidden';
  }

  componentWillUnmount() {
    document.body.style.overflow = '';
  }

  render() {
    const { data, actions, children } = this.props;
    const { title, className, isHideIcon, backdropColor } = data;
    const { handleClose, CloseButtonSrc } = actions;
    const backdropStyle = {};
    if (backdropColor) {
      backdropStyle.backgroundColor = backdropColor;
    }
    const modalClass = className ? `info-view ${className}` : 'info-view';

    return (
      <div className="xmodal-info-container" style={backdropStyle}>
        <div className={modalClass}>
          {isHideIcon ? null : (
            <img
              className="close-button"
              src={CloseButtonSrc || closeButton}
              onClick={() => handleClose()}
            />
          )}
          {title ? <div className="title">{title}</div> : null}

          {children}
        </div>
      </div>
    );
  }
}
