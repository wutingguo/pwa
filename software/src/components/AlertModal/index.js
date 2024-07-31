import React, { Component } from 'react';
import PropTypes from 'prop-types';
import XModal from '../XModal/index';

import './index.scss';

export default class AlertModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { text, btnText, html, actions } = this.props;
    const { handleClose, handleOk } = actions;
    const xmodalProps = {
      data: {
        title: '',
        className: 'alert-modal',
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
          <a href="javascript:;" onClick={handleOk} className="ok">
            {btnText}
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
  html: PropTypes.string
};

AlertModal.defaultProps = {
  text: '确认操作？',
  btnText: '确定',
  actions: {
    handleClose: () => { },
    handleOk: () => { },
    handleCancel: () => { }
  }
};
