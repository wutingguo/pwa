import React, {memo} from 'react';

export default memo(({onClick}) => (
  <div className='empty-custom-products-page'>
    <span className='empty-page-text'>{t('NO_CUSTOM_PRODUCTS_YET')}</span>
    <div className='create-btn' onClick={onClick}>{t('LABS_CREATE_NOW')}</div>
  </div>
));