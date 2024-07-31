import React, { Component } from 'react';
import PropTypes from 'prop-types';
import XModal from '../XModal/index';
import classNames from 'classnames';

import './index.scss';

export default class AlertModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { text, confirmBtnText, cancelBtnText, html, actions, isOkBtnHightLight = true, isCancelBtnHightLight = true, className } = this.props;
    const { handleClose, handleOk } = actions;
    const modalClassName = classNames('alert-modal', className);
    const xmodalProps = {
      data: {
        title: '',
        className: modalClassName,
        backdropColor: 'rgba(17, 17, 17, 0.4)',
        isHideIcon: false
      },
      actions: {
        handleClose
      }
    };

    return (
      <XModal {...xmodalProps}>
        {html ? (
          <div className="text" dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <div className="text">{text}</div>
        )}

        <div className="btns">
          {cancelBtnText && (<a href="javascript:;" onClick={handleClose} className={isCancelBtnHightLight ? 'ok' : 'cancel'}>
            {cancelBtnText}
          </a>)}
          <a href="javascript:;" onClick={handleOk} className={isOkBtnHightLight ? 'ok' : 'cancel'}>
            {confirmBtnText}
          </a>
        </div>
      </XModal>
    );
  }
}

AlertModal.propTypes = {
  actions: PropTypes.shape({
    handleClose: PropTypes.func.isRequired,
    handleOk: PropTypes.func.isRequired
  }).isRequired,
  text: PropTypes.string,
  btnText: PropTypes.string,
  html: PropTypes.string,
  isOkBtnHightLight: PropTypes.bool,
  isCancelBtnHightLight: PropTypes.bool
};

AlertModal.defaultProps = {
  text: '确认操作？',
  btnText: '确定',
  actions: {
    handleClose: () => {},
    handleOk: () => {},
    handleCancel: () => {}
  }
};
