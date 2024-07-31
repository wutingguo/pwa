import React, { Component } from 'react';
import PropTypes from 'prop-types';

import XModal from '../XModal/index';

import './index.scss';

export default class ConfirmModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { text,cancelText,okText,actions } = this.props;
    const { handleClose, handleOk, handleCancel } = actions;
    const xmodalProps = {
      data: {
        title: '',
        className: 'confirm-modal',
        backdropColor: 'rgba(17, 17, 17, 0.4)',
        isHideIcon: false
      },
      actions: {
        handleClose
      }
    };

    return (
      <XModal {...xmodalProps}>
        <div className="text" dangerouslySetInnerHTML={{ __html: text }}></div>
        <div className="btns">
        <a href="javascript:;" onClick={handleCancel}>{cancelText}</a>
        <a href="javascript:;" onClick={handleOk} className="ok">{okText}</a>
        </div>
      </XModal>
    );
  }
}

ConfirmModal.propTypes = {
  actions: PropTypes.shape({
    handleClose: PropTypes.func.isRequired,
    handleOk: PropTypes.func.isRequired,
    handleCalcel: PropTypes.func
  }).isRequired,
  text: PropTypes.string,
  cancelText: PropTypes.string,
  okText: PropTypes.string
};

ConfirmModal.defaultProps = {
  text: '确认操作？',
  cancelText: '取消',
  okText: '确认',
  actions: {
    handleClose: () => {},
    handleOk: () => {},
    handleCancel: () => {}
  }
};
