import classNames from 'classnames';
import React from 'react';

import XButton from '@resource/components/XButton';

import { XModal } from '@common/components';

import { DAYLIMIT15_MODAL } from '@apps/live/constants/modalTypes';

import './index.scss';

const CommonModal = props => {
  const { data, boundGlobalActions } = props;
  const close = () => boundGlobalActions.hideModal(DAYLIMIT15_MODAL);
  const wrapClass = classNames('commonModalWrapper', 'dayLimit15');
  const sty = data.get('style');
  const style = sty ? sty.toJS() : {};
  const escapeClose = !!data.get('escapeClose');
  const isHideIcon = !!data.get('isHideIcon');
  const message = data.get('message');
  return (
    <XModal
      className={wrapClass}
      styles={style}
      opened={true}
      onClosed={close}
      escapeClose={escapeClose}
      isHideIcon={isHideIcon}
    >
      <div className="modal-title">
        <div className="dayLimit15Title">
          <p>!</p>
          <span>{t('LP_CANT_UPLOAD')}</span>
        </div>
      </div>
      <div className="modal-body">
        <div className="dayLimit15Body">{t('LP_15DAY_MESSAGE')}</div>
      </div>
      <div className="modal-footer">
        <XButton onClicked={close}>{t('CONFIRM')}</XButton>
      </div>
    </XModal>
  );
};

export default CommonModal;
