import React from 'react';

import XButton from '@resource/components/XButton';

import { XModal } from '@common/components';

import { ModalContent } from './layout';

/**
 * 删除弹窗
 * @typedef {Object} DeleteModalProps
 * @property {Function} onDelete 删除回调
 * @property {Function} onClose 关闭回调
 * @property {string} title 标题
 * @param {DeleteModalProps} props
 */
const DeleteModal = props => {
  const { onDelete, onClose, title } = props;

  return (
    <XModal opened onClosed={onClose} styles={{ width: 440 }}>
      <ModalContent>
        <div className="modal-body">{title}</div>
        <div className="modal-footer">
          <XButton className="bg-white" onClicked={onClose}>
            取消
          </XButton>
          <XButton onClicked={onDelete}>删除</XButton>
        </div>
      </ModalContent>
    </XModal>
  );
};

export default DeleteModal;
