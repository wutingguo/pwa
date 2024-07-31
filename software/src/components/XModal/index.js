import React, { Component } from 'react';
import PropTypes from 'prop-types';
import closeButton from './close.png';
import './index.scss';

export default class XModal extends Component {
  static propTypes = {
    data: PropTypes.shape({
      title: PropTypes.string,
      className: PropTypes.string,
      isHideIcon: PropTypes.bool,
      backdropColor: PropTypes.string,
      hideOnBackdrop: PropTypes.bool
    }),
    actions: PropTypes.shape({
      handleClose: PropTypes.func
    })
  }

  static defaultProps = {
    data: {
      title: '',
      className: '',
      isHideIcon: false,
      backdropColor: '',
      hideOnBackdrop: false
    },
    actions: {
      handleClose: () => { }
    }
  }

  constructor(props) {
    super(props);
    this.onBackDropClick = this.onBackDropClick.bind(this);
  }

  onBackDropClick() {
    const { data, actions } = this.props;
    const { hideOnBackdrop } = data;
    const { handleClose } = actions;
    if (hideOnBackdrop) {
      handleClose();
    }
  }

  componentDidMount() {
    document.body.style.overflow = 'hidden';
  }

  componentWillUnmount() {
    document.body.style.overflow = '';
  }

  render() {
    const { data, actions, children } = this.props;
    const {
      title,
      className,
      isHideIcon,
      backdropColor
    } = data;
    const { handleClose } = actions;
    const backdropStyle = {};
    if (backdropColor) {
      backdropStyle.backgroundColor = backdropColor;
    }
    const modalClass = className ? `info-view ${className}` : 'info-view';

    return (
      <div className="xmodal-info-container">
        <div
          className="backdrop"
          style={backdropStyle}
          onClick={this.onBackDropClick}
        ></div>
        <div className={modalClass}>
          {isHideIcon ? null : (
            <img className="close-button" src={closeButton} onClick={() => handleClose()} />
          )}
          {title ? (
            <div className="title">
              {title}
            </div>
          ) : null}
          {children}
        </div>
      </div>
    );
  }
}
