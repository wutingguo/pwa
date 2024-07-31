import React from 'react';
import classNames from 'classnames';
import { XModal } from '@common/components';
import XButton from '@resource/components/XButton';

import './index.scss';

const CommonModal = props => {
  const {
    data,
    errInfo,
    onOk,
    className,
    cancelText,
    okText,
    title: propsTitle,
    hideBtnList: propHideBtnList
  } = props;
  const close = data.get('close');
  const hideBtnList = data.get('hideBtnList') || propHideBtnList;
  const nodeList = data.get('nodeList');
  const title = data.get('title') || propsTitle;
  const wrapClass = classNames('commonModalWrapper', data.get('className'), className);
  const sty = data.get('style');
  const style = sty ? sty.toJS() : {};
  const escapeClose = !!data.get('escapeClose');
  const isHideIcon = !!data.get('isHideIcon');

  return (
    <XModal
      className={wrapClass}
      styles={style}
      opened={true}
      onClosed={close}
      escapeClose={escapeClose}
      isHideIcon={isHideIcon}
    >
      <div className="modal-title">{typeof title === 'function' ? title() : title}</div>
      <div className="modal-body">{props.children}</div>
      {!hideBtnList && (
        <div className="modal-footer">
          <XButton className="white" onClicked={close}>
            {cancelText || t('CANCEL')}
          </XButton>
          <XButton disabled={!!errInfo} onClicked={onOk}>
            {okText || t('CONFIRM')}
          </XButton>
        </div>
      )}
    </XModal>
  );
};

export default CommonModal;
