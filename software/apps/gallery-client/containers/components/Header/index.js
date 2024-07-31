import classnames from 'classnames';
import React, { memo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import ConsumerButton from '../ConsumerButton';
import MyProjectsButton from '../MyProjectsButton';
import ShopCartButton from '../ShopCartButton';

import './index.scss';

const Header = ({ className, style = {}, boundGlobalActions, boundProjectActions, store }) => {
  const history = useHistory();
  const { collectionName } = useSelector(s => {
    const { detail } = s.collection || {};
    const collectionName = detail && detail.get('collection_name');
    return { collectionName };
  });

  const clName = classnames('print-store-header', className);
  const isShowPrintStore = Boolean(store.getIn(['fetched', 'status']) && store.get('status'));
  const handleToPrintStore = useCallback(() => {
    window.logEvent.addPageEvent({
      name: 'ClientEstore_Click_PrintStore',
    });
    history.push('/printStore/categories');
  }, [history]);

  const handleToGallery = useCallback(() => {
    window.logEvent.addPageEvent({
      name: 'ClientEstore_Click_ViewGallery',
    });
    history.push('/');
  }, [history]);

  return (
    <div className={clName} style={style}>
      <span className="print-store-header__title" title={collectionName} onClick={handleToGallery}>
        {collectionName}
      </span>
      <div className="flex-space"></div>
      <div className="print-store-header__bar">
        <div className="print-store-header__bar-item home" onClick={handleToPrintStore}>
          {t('PRINT_STORE')}
        </div>
        <div className="print-store-header__bar-item gallery" onClick={handleToGallery}>
          {t('VIEW_GALLERY')}
        </div>
        <div className="print-store-header__bar-item split"></div>
        <div className="print-store-header__bar-item buttons">
          <ShopCartButton
            boundGlobalActions={boundGlobalActions}
            boundProjectActions={boundProjectActions}
          />
          <MyProjectsButton
            boundGlobalActions={boundGlobalActions}
            boundProjectActions={boundProjectActions}
          />
          <ConsumerButton
            size="small"
            boundGlobalActions={boundGlobalActions}
            boundProjectActions={boundProjectActions}
            isShowPrintStore={isShowPrintStore}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(Header);
