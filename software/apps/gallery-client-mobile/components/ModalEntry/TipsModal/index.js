import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component, memo, useCallback, useState } from 'react';
import { useHistory } from 'react-router';

import { XButton, XModal } from '@common/components';

import * as localModalTypes from '@apps/gallery-client/constants/modalTypes';

import ButtonWithLoginCheck from '../../ButtonWithLoginCheck';

import './index.scss';

const TipsModal = ({ data, boundGlobalActions, boundProjectActions }) => {
  const history = useHistory();
  const [buttonLoading, setButtonLoading] = useState(false);

  const title = data.get('title');
  const tips = data.get('tips');
  const close = data.get('close');
  const onOk = data.get('onOk');
  const okButtonText = data.get('okButtonText');
  const isAsync = data.get('isAsync');
  const isWithLoginCheck = data.get('isWithLoginCheck');

  const handleAsync = useCallback(async () => {
    setButtonLoading(true);
    try {
      await onOk();
    } catch (e) {
      console.error(e);
    }
    setButtonLoading(false);
  }, [onOk]);

  const handleClick = useCallback(() => {
    onOk();
  }, [onOk]);

  const wrapClass = classNames('print-store-tips-modal-wrap', data.get('className'));

  const Button = isWithLoginCheck ? ButtonWithLoginCheck : XButton;

  const hideSelf = useCallback(() => {
    boundGlobalActions.hideModal(localModalTypes.TIPS_MODAL);
  }, [boundGlobalActions]);

  return (
    <XModal className={wrapClass} opened onClosed={close} escapeClose={false} isHideIcon={false}>
      <div className="modal-title-c">
        <div>{title}</div>
      </div>

      <div className="modal-body-c">{tips}</div>
      <div className="modal-footer-c clearfix">
        <Button
          className="pwa-btn"
          isWithLoading={true}
          isShowLoading={buttonLoading}
          onClicked={isAsync ? handleAsync : handleClick}
          beforeShowLoginModal={hideSelf}
          boundGlobalActions={boundGlobalActions}
          boundProjectActions={boundProjectActions}
        >
          {okButtonText}
        </Button>
      </div>
    </XModal>
  );
};

export default memo(TipsModal);
