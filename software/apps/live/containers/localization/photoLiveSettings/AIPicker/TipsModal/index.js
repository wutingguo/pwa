import React from 'react';

import XButton from '@resource/components/XButton';

import { XModal } from '@common/components';

import { Content, Footer } from './layout';

/**
 * 提示弹窗
 * @typedef {Object} TipsModalProps
 * @property {string} content 文字内容
 * @property {Function} onClose 关闭回调
 * @param {TipsModalProps} props
 */
const TipsModal = props => {
  const { content, onClose } = props;

  return (
    <XModal opened onClosed={onClose} styles={{ width: 500 }}>
      <Content>{content}</Content>
      <Footer>
        <XButton width={140} height={40} onClicked={onClose}>
          确定
        </XButton>
      </Footer>
    </XModal>
  );
};

export default TipsModal;
