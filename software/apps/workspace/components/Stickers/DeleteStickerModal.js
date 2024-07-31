import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './deleteModal.scss';

class DeleteStickerModal extends Component {
  constructor(props) {
    super(props);

    this.stopPropagation = this.stopPropagation.bind(this);
  }

  stopPropagation(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    const { text, html, actions } = this.props;
    const { handleClose, handleOk } = actions;
    return (
      <div className="delete-modal s-modal" onClick={this.stopPropagation}>
        {html ? (
          <div className="text" dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <div className="text">{text}</div>
        )}
        <div className="btns">
          <a href="javascript:;" className="btn" onClick={handleOk}>确定</a>
          <a href="javascript:;" className="btn btn-white" onClick={handleClose}>取消</a>
        </div>
      </div>
    );
  }
}

DeleteStickerModal.propTypes = {
  actions: PropTypes.shape({
    handleClose: PropTypes.func.isRequired,
    handleOk: PropTypes.func.isRequired
  }).isRequired,
  text: PropTypes.string,
  html: PropTypes.string
};

DeleteStickerModal.defaultProps = {
  text: '确定删除此素材吗？',
  actions: {
    handleClose: () => {},
    handleOk: () => {},
    handleCancel: () => {}
  }
};

export default DeleteStickerModal;
