import classnames from 'classnames';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as cache from '@resource/lib/utils/cache';
import { getCookie, removeCookie } from '@resource/lib/utils/cookie';

import { emailReg } from '@resource/lib/constants/reg';

import {
  getEmailCacheKey,
  getGuestUidCacheKey,
  getPhoneCacheKey,
  getPinCacheKey,
} from '@apps/gallery-client/utils/helper';

import out from './icon/out.png';

import './index.scss';

const OutLogin = ({ closePop, boundGlobalActions, boundProjectActions }) => {
  const { detail, qs, login_information_config } = useSelector(storeState => {
    return {
      detail: storeState.favorite.detail,
      qs: storeState.root.system.env.qs,
      login_information_config: storeState.collection.detail
        ?.get('collection_setting')
        ?.get('login_information_config'),
    };
  });
  const LoginEmail = detail.get('email');
  const LoginPhone = detail.get('phone');
  const name = detail.get('guest_name');
  const guest_other_info = detail.get('guest_other_info');
  const collection_uid = qs.get('collection_uid');
  const Other =
    (login_information_config &&
      login_information_config
        .get('setting_details')
        .find(item => item.get('information_id') === 4)
        .toJS()) ||
    {};

  const handleOutLogin = useCallback(async () => {
    if (collection_uid) {
      const cacheEmailKey = getEmailCacheKey(collection_uid);
      const cacheGuestUidKey = getGuestUidCacheKey(collection_uid);
      const cachePhoneKey = getPhoneCacheKey(collection_uid);
      const pinCacheKey = getPinCacheKey(collection_uid);
      cacheGuestUidKey && cache.removeItem(cacheGuestUidKey);
      cacheEmailKey && cache.removeItem(cacheEmailKey);
      cachePhoneKey && cache.removeItem(cachePhoneKey);
      pinCacheKey && cache.removeItem(pinCacheKey);
    }
    const host = location.host
      .split('.')
      .filter((a, index) => index !== 0)
      .join('.');
    if (getCookie('_store_auth_token')) {
      removeCookie('_store_auth_token', host);
      boundProjectActions.handeleLoginOut();
    }
    localStorage.setItem('_tk_', '');
    localStorage.setItem('_store_id_', '');
    await closePop();
    location.reload();
  }, [collection_uid]);
  const displayName = emailReg.test(LoginPhone) ? '邮箱: ' : '手机号:';
  return (
    <div className="print-store-consumer">
      <div className="sign">
        <div className="text-gallery">{t('SIGN_IN')}</div>
        <div className="sign-out" onClick={handleOutLogin}>
          <img src={out} alt="" />
          {t('SIGN_OUT')}
        </div>
      </div>
      {__isCN__ ? (
        <div className="login-info">
          {LoginPhone && (
            <div className="login-info-item">
              {displayName} <span className="text">{LoginPhone}</span>
            </div>
          )}
          {LoginEmail && (
            <div className="login-info-item">
              邮箱: <span className="text">{LoginEmail}</span>
            </div>
          )}
          {name && (
            <div className="login-info-item">
              姓名: <span className="text">{name}</span>
            </div>
          )}
          {Other && Other.is_choose && (
            <div className="login-info-item">
              {Other.information_name}: <span className="text">{guest_other_info}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="login-email">{LoginEmail || LoginPhone}</div>
      )}
    </div>
  );
};

export default memo(OutLogin);
