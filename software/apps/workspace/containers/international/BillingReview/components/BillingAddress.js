import React from 'react';
import Title from './Title';

export default ({ title, fullName, address, phone, email, showAddress, changeAddress }) => {
  return (
    <div>
      <Title title={title} />
      {
        showAddress ? (
          <div className={"address-wrapper"}>
            <div className={'address-wrap'}>
              <div className={'full-name'}>{fullName}</div>
              <div className={'address'}>{address}</div>
              {!!phone && (
                <div className={'phone'}>
                  <span className={'label'}>{t('PHONE')}: </span>
                  <span className={'value'}>{phone}</span>
                </div>
              )}
              {!!email && (
                <div className={'email'}>
                  <span className={'label'}>{t('EMAIL_ADDRESS')}: </span>
                  <span className={'value'}>{email}</span>
                </div>
              )}
            </div>
            <span className={'edit-link'} onClick={changeAddress}>{t('EDIT')}</span>
          </div>
        ) : (
          <div className={'address-wrapper'}>
            <span>{t('NO_BILLING_ADDRESS')}</span>
          </div>
        )
      }
    </div>
  )
}
