import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './editModal.scss';

class EditStickerModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { actions, isShowMove } = this.props;
    const { onRename, onDelete, onMoveCat } = actions;
    return (
      <ul className="edit-sticker-modal s-modal" title="">
        <li onClick={onRename}>重命名</li>
        { isShowMove ? <li onClick={onMoveCat}>移动分组</li> : null }
        <li onClick={onDelete}>删除</li>
      </ul>
    );
  }
}

EditStickerModal.propTypes = {

};

EditStickerModal.defaultProps = {
  isShowMove: false
};

export default EditStickerModal;
