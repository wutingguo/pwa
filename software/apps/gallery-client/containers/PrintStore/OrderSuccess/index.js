import React, { memo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import XLink from '@resource/components/XLink';

import { XButton } from '@common/components';

import './index.scss';

const OrderSuccess = props => {
  const history = useHistory();

  const handleAction = useCallback(hash => {
    history.push(hash);
  }, []);

  return (
    <div className="print-store-page-oder-success">
      <h1 className="print-store-page-oder-success__title">{t('SUCCESS_TIPS1')}</h1>
      <p className="print-store-page-oder-success__desc">{t('SUCCESS_TIPS2')}</p>
      <div className="print-store-page-oder-success__actions">
        <XLink
          onClick={() => {
            window.logEvent.addPageEvent({
              name: 'ClientEstore_OrderPlaced_Click_ViewGallery',
            });
            handleAction('/');
          }}
          className="button-container"
        >
          <XButton className="black button" width="250" height="40">
            {t('VIEW_GALLERY1')}
          </XButton>
        </XLink>
        <XLink
          onClick={() => {
            window.logEvent.addPageEvent({
              name: 'ClientEstore_OrderPlaced_Click_ViewPrintStore',
            });
            handleAction('/printStore/categories');
          }}
          className="button-container"
        >
          <XButton className="black button" width="250" height="40">
            {t('VIEW_PRINT_STORE')}
          </XButton>
        </XLink>
      </div>
    </div>
  );
};

export default memo(OrderSuccess);
