import { debounce } from 'lodash';
import React, { memo, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

import * as cache from '@resource/lib/utils/cache';
import { getQs } from '@resource/lib/utils/url';

import { emailReg, phoneReg } from '@resource/lib/constants/reg';

import estoreService from '@apps/estore/constants/service';
import { BIND_EMAIL_MODAL, SIGN_IN_MODAL } from '@apps/gallery-client-mobile/constants/modalTypes';
import {
  getEmailCacheKey,
  getGuestUidCacheKey,
  getPhoneCacheKey,
} from '@apps/gallery-client/utils/helper';

const useLogin = ({ boundGlobalActions, boundProjectActions }) => {
  const { urls, store, qs } = useSelector(storeState => {
    return {
      urls: storeState.root.system.env.urls,
      qs: storeState.root.system.env.qs,
      store: storeState.store,
    };
  });
  const estoreBaseUrl = urls.get('estoreBaseUrl');
  const collectionUid = decodeURIComponent(getQs('collection_uid'));
  const collection_uid = qs.get('collection_uid');
  const cacheEmailKey = getEmailCacheKey(collection_uid);
  const cacheGuestUidKey = getGuestUidCacheKey(collection_uid);
  const cachePhoneKey = getPhoneCacheKey(collection_uid);

  const { showModal, hideModal, addNotification } = boundGlobalActions;
  let isMarkOrUnmarking = false;

  // 同步调用 但是不能防止cookie被删除、过期的情况
  // const checkIsLoginByState = useCallback(() => {
  //   return !!store?.get('user')?.customer_identify;
  // }, [store, store.get('user')]);

  // 异步 需要等待 但最可靠 在需要确保cookie有效时 使用
  const checkIsLoginByServer = useMemo(() => {
    return debounce(
      async () => {
        // 检查用户是否已经登录
        try {
          const res = await estoreService.estoreGetUserInfo({ baseUrl: estoreBaseUrl });
          if (res.ret_code === 200000 && res.data) {
            const _tk_ = localStorage.getItem('_tk_');
            const _store_id_ = localStorage.getItem('_store_id_');
            return _tk_ && _store_id_;
          }
          // 用户cookie中的storeId与传入的id不匹配
          if (res.ret_code === 401810) {
            console.error(res.ret_msg);
            return false;
          }
        } catch (e) {
          console.error(e);
          return false;
        }
      },
      400,
      {
        leading: true,
        trailing: false,
      }
    );
  }, [estoreBaseUrl]);
  const checkGalleryIsLogin = useCallback(() => {
    const email = cache.get(cacheEmailKey);
    const GuestUid = cache.get(cacheGuestUidKey);
    const Phone = cache.get(cachePhoneKey);
    return (Phone || email) && GuestUid;
  }, [collectionUid]);
  // 仅仅登录gallery
  const loginGallery = useCallback(async () => {
    showModal(BIND_EMAIL_MODAL, {
      close: () => {
        isMarkOrUnmarking = false;
        hideModal(BIND_EMAIL_MODAL);
      },
      onOk: async (params, inputValue) => {
        // 尝试登录E-Store 不需要响应数据
        try {
          boundProjectActions.storeSignUp({
            email: inputValue,
            fromGallery: true,
          });
        } catch (e) {
          console.error(e);
        }
        await boundProjectActions.guestSignUp(params).then(
          result => {
            const { guest_uid } = result.data;

            // 获取一下favorite.
            boundProjectActions
              .getFavoriteImageList(guest_uid)
              .then(() => {
                const cacheGuestUidKey = getGuestUidCacheKey(collection_uid);

                cache.set([emailReg.test(inputValue) ? cacheEmailKey : cachePhoneKey], inputValue);
                cache.set(cacheGuestUidKey, guest_uid);

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
  }, [collectionUid]);
  // 登录gallery和estore
  const loginCollection = useCallback(
    async (inputValue, otherInfo) => {
      try {
        const collection_uid = qs.get('collection_uid');
        const params = {
          [emailReg.test(inputValue) ? 'guest_email' : 'guest_phone']: inputValue,
        };

        const guestRes = await boundProjectActions.guestSignUp(otherInfo || params);
        const { guest_uid } = guestRes.data;

        const cacheEmailKey = getEmailCacheKey(collection_uid);
        const cachePhoneKey = getPhoneCacheKey(collection_uid);
        const cacheGuestUidKey = getGuestUidCacheKey(collection_uid);
        cache.set(cacheGuestUidKey, guest_uid);
        cache.set([emailReg.test(inputValue) ? cacheEmailKey : cachePhoneKey], inputValue);

        // 获取一下favorite.
        await boundProjectActions.getFavoriteImageList(guest_uid);
      } catch (e) {
        console.error(e);
      }
    },
    [qs, boundProjectActions]
  );

  const showLoginModal = useCallback(
    async ({ onCancel, onLoginSuccess, onLoginFailed }) => {
      // 显示登录窗口
      boundGlobalActions.showModal(SIGN_IN_MODAL, {
        close: () => {
          window.logEvent.addPageEvent({
            name: 'ClientEstore_SignInPop_Click_Cancel',
          });
          boundGlobalActions.hideModal(SIGN_IN_MODAL);
          onCancel && onCancel();
        },
        onOk: async (val, params) => {
          window.logEvent.addPageEvent({
            name: 'ClientEstore_SignInPop_Click_SignIn',
          });
          try {
            await boundProjectActions.storeSignUp({
              email: val,
            });
            // 登录gallery 前往编辑器时 需要等gallery登录完成再跳转
            await loginCollection(val, params);
            onLoginSuccess && (await onLoginSuccess());
            boundGlobalActions.hideModal(SIGN_IN_MODAL);
          } catch (e) {
            console.error(e);
            onLoginFailed && onLoginFailed(e);
          }
        },
      });
    },
    [estoreBaseUrl, collectionUid, loginCollection]
  );

  const restore = useCallback(async () => {
    await boundProjectActions.initStoreId().catch(e => {
      console.error(e);
    });

    await boundProjectActions.getStoreUserInfo().catch(e => {
      console.error(e);
      //  TODO: 从cookie恢复estore用户信息失败的情况待处理
      // 失败 可能为cookie无效
    });
  }, [boundProjectActions]);

  return { checkIsLoginByServer, showLoginModal, restore, checkGalleryIsLogin, loginGallery };
};

const withLoginCheck = Component => {
  return ({
    boundGlobalActions,
    boundProjectActions,
    // 返回true则表示不弹出登录窗口
    beforeShowLoginModal = async () => undefined,
    ...rest
  }) => {
    const { checkIsLoginByServer, showLoginModal } = useLogin({
      boundGlobalActions,
      boundProjectActions,
    });

    const loginCheck = useMemo(
      () =>
        debounce(
          async ({ onPass, onLoginFailed, onCancel }) => {
            const isLogion = await checkIsLoginByServer();
            if (!isLogion) {
              const isNotShow = await beforeShowLoginModal();
              !isNotShow &&
                showLoginModal({
                  onLoginSuccess: onPass,
                  onLoginFailed,
                  onCancel,
                });
            } else {
              onPass && onPass();
            }
          },
          400,
          {
            leading: true,
            trailing: false,
          }
        ),
      [checkIsLoginByServer, showLoginModal]
    );

    return <Component {...rest} loginCheck={loginCheck} />;
  };
};

export { withLoginCheck };

export default useLogin;
