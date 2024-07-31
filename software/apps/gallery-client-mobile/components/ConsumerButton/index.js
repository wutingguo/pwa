import React, { memo, useCallback, useState } from 'react';
import classnames from 'classnames';
import { XIcon, XDropdown } from '@common/components';
import useLogin from '../../hooks/useLogin';
import { LOGIN_OUT_MODAL } from '@apps/gallery-client-mobile/constants/modalTypes';

import './index.scss';

const ConsumerButton = ({ className, size = '', boundGlobalActions, boundProjectActions }) => {
  const { checkGalleryIsLogin, loginGallery } = useLogin({
    boundGlobalActions,
    boundProjectActions
  });

  const handleClick = useCallback(async () => {
    const galleryIsLogion = await checkGalleryIsLogin();
    if (!galleryIsLogion) {
      await loginGallery();
    } else {
      boundGlobalActions.showModal(LOGIN_OUT_MODAL);
    }
  }, [checkGalleryIsLogin]);

  const clName = classnames('print-store-consumer-button', className);
  const sizeSuffix = size ? `-${size}` : '';

  return (
    <>
      <span className={clName} style={{ fontSize: '26px' }} onClick={handleClick}>
        <XIcon type={`user${sizeSuffix}`} className="order-icon-wrap" title="" />
      </span>
    </>
  );
};

export default memo(ConsumerButton);
