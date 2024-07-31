import classNames from 'classnames';
import { fromJS } from 'immutable';
import { merge } from 'lodash';
import React from 'react';

import * as cache from '@resource/lib/utils/cache';

import { emailReg } from '@resource/lib/constants/reg';

import { XIcon } from '@common/components';

import {
  BIND_EMAIL_MODAL,
} from '@apps/commodity-client/constants/modalTypes';
import {
  getEmailCacheKey,
  getGuestUidCacheKey,
  getPhoneCacheKey,
} from '@apps/commodity-client/utils/helper';


let isMarkOrUnmarking = false;

const bindUserInfo = (that, cb) => {
  const { boundGlobalActions, boundProjectActions, qs } = that.props;
  const { showModal, hideModal, addNotification } = boundGlobalActions;
  const collection_uid = qs.get('collection_uid');

  const cacheEmailKey = getEmailCacheKey(collection_uid);
  const cachePhoneKey = getPhoneCacheKey(collection_uid);
  // 弹出绑定email的弹框.
  showModal(BIND_EMAIL_MODAL, {
    close: () => {
      isMarkOrUnmarking = false;
      hideModal(BIND_EMAIL_MODAL);
    },
    onOk: (params, inputValue) => {
      // 尝试登录E-Store 不需要响应数据
      boundProjectActions.storeSignUp({
        email: inputValue,
        fromGallery: true,
      });
      boundProjectActions.guestSignUp(params).then(
        result => {
          const { guest_uid } = result.data;

          // 获取一下favorite.
          boundProjectActions
            .getFavoriteImageList(guest_uid)
            .then(() => {
              const cacheGuestUidKey = getGuestUidCacheKey(collection_uid);
              cache.set([emailReg.test(inputValue) ? cacheEmailKey : cachePhoneKey], inputValue);
              cache.set(cacheGuestUidKey, guest_uid);
              if (cb && typeof cb === 'function') {
                cb(guest_uid);
              }
              hideModal(BIND_EMAIL_MODAL);
              // markOrUnmarkFavorite(that, item, guest_uid).then(() => (isMarkOrUnmarking = false));
            })
            .catch(err => {
              hideModal(BIND_EMAIL_MODAL);
              isMarkOrUnmarking = false;
            });
        },
        err => {
          isMarkOrUnmarking = false;
          hideModal(BIND_EMAIL_MODAL);

          addNotification({
            message: t('GUEST_SIGN_UP_FAILED'),
            level: 'error',
            autoDismiss: 2,
          });
        }
      );
    },
  });
};


export default {
  bindUserInfo,
};
