import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { XButton } from '@common/components';

// import { getIsFromSaas } from '@resource/lib/utils/url';

import XLink from '@resource/components/XLink';
import './index.scss';

export default function EmptyShoppingCart() {
  const history = useHistory();

  const viewTitle = t('VIEW_PRINT_STORE');

  const handleClick = useCallback(() => {
    history.push('/printStore/categories');
    window.logEvent.addPageEvent({
      name: 'ClientEstore_Cart_Click_ViewPrintStore'
    });
  }, []);

  return (
    <div className="empty-shopping-cart-container">
      <div className="empty-shopping-cart-title">{t('EMPTY_SHOPPING_CART_TITLE')}</div>
      <div className="empty-shopping-cart-message">{t('EMPTY_SHOPPING_CART_MESSAGE')}</div>
      <XLink onClick={handleClick} className="empty-shopping-cart-button-container">
        <XButton className="black empty-shopping-cart-button" width="300" height="60">
          {viewTitle}
        </XButton>
      </XLink>
    </div>
  );
}
