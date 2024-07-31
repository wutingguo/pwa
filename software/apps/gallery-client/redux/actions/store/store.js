import QS from 'qs';

import { wrapPromise } from '@resource/lib/utils/promise';
import { getQs } from '@resource/lib/utils/url';

import {
  INSERT_KEY_TO_QS,
  LOGINOUT,
  UPDATE_PRINT_STORE_INFO,
} from '@resource/lib/constants/actionTypes';
import {
  SAAS_CLIENT_GALLERY_PRINT_STORE_SING_UP,
  SAAS_CLIENT_GALLERY_PRINT_STORE_USER_INFO,
} from '@resource/lib/constants/apiUrl';

import { CALL_API } from '@resource/lib/middlewares/api';

import { getStoreById } from '@apps/gallery-client/services/store';
import getDataFromState from '@apps/gallery-client/utils/getDataFromState';
import collectionPriceSheetService from '@apps/gallery/containers/international/Collections/Detail/Settings/Store/service';

import { getCartNum } from '../../../services/cart';
import { getStoreUser } from '../../../services/store';

const fetchUserInfo = async ({ dispatch, estoreBaseUrl, resolve, reject, store_id }) => {
  const res = await getStoreUser({ estoreBaseUrl });
  // 标识已经拉取过用户
  const fetched = {
    user: true,
  };
  let payload = {
    user: null,
    fetched,
  };
  const storeId = getQs('storeId');

  if (res && res.ret_code === 200000) {
    const data = res.data;

    payload = {
      // 不从用户中获取storeId  storeId只认collection绑定的store
      id: data.store_id,
      user: {
        // id: data.id,
        // customer_identify: data.customer_identify,
        ...data,
      },
      fetched,
    };
  } else {
    const storeInfo = await getStoreById({ baseUrl: estoreBaseUrl, storeId: store_id || storeId });
    payload = {
      user: {
        store_currency: storeInfo.store_currency,
      },
    };
  }

  dispatch &&
    dispatch({
      type: UPDATE_PRINT_STORE_INFO,
      data: payload,
    });
  resolve && resolve(res);
  return res;
};

const fetchStoreId = async ({ dispatch, collectionUid, estoreBaseUrl, resolve, reject }) => {
  const collectionBindPriceSheet = await collectionPriceSheetService.getCollectionBindPriceSheet({
    galleryBaseUrl: estoreBaseUrl,
    collectionId: collectionUid,
  });
  // 通过collectionUid拿到的rack
  const { store_id, store_rack_id, collection_id, store_status } = collectionBindPriceSheet || {};
  const fetched = {
    status: true,
    id: true,
    rackId: true,
    collectionId: true,
  };
  // store为关闭状态 或者在store_id为0时 也是没有绑定
  if (!store_status || !store_id) {
    // 标识已经拉取过id等
    dispatch &&
      dispatch({
        type: UPDATE_PRINT_STORE_INFO,
        data: {
          store_status: Boolean(store_status),
          fetched,
        },
      });
    const err = new Error('the collection not bind store or price sheet');
    // console.log(err);
    reject && reject(err.message);
    return;
  }
  // 把storeId更新并纠正到url中
  const currentSearchParams = QS.parse(location.search, { ignoreQueryPrefix: true });
  if (!currentSearchParams.storeId || currentSearchParams.storeId != store_id) {
    currentSearchParams.storeId = store_id;
    const newSearch = QS.stringify(currentSearchParams, { addQueryPrefix: true });
    console.log('new location.search: ', newSearch);
    // location.search = newSearch;

    // 浏览器重新打开newSearch的url
    window.open(location.origin + location.pathname + newSearch + location.hash, '_self');

    return;
  }
  dispatch &&
    dispatch({
      type: UPDATE_PRINT_STORE_INFO,
      data: {
        status: Boolean(store_status),
        id: store_id,
        rackId: store_rack_id,
        collectionId: collection_id,
        fetched,
      },
    });
  dispatch({
    type: INSERT_KEY_TO_QS,
    data: {
      store_id,
      storeId: store_id,
    },
  });
  resolve && resolve(store_id);
  return store_id;
};

const fetchShopCart = async ({ dispatch, estoreBaseUrl, resolve, reject }) => {
  const number = await getCartNum({ estoreBaseUrl });
  // 标识已经拉取过
  const fetched = {
    shopCart: true,
  };
  let payload = {
    fetched,
  };
  payload = {
    shopCart: {
      nums: number,
    },
    fetched,
  };

  dispatch &&
    dispatch({
      type: UPDATE_PRINT_STORE_INFO,
      data: payload,
    });
  resolve && resolve(number);
  return number;
};

/**
 * 获取详细信息
 */
const storeSignUp = params => {
  const { email, password = '', fromGallery = false } = params || {};
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { urls, qs } = getDataFromState(getState());
      const saasShareUrl = urls.get('saasShareUrl');
      const estoreBaseUrl = urls.get('estoreBaseUrl');
      const collectionUid = qs.get('collection_uid');

      if (!collectionUid) {
        const err = new Error('collection_uid is required');
        console.error(err);
        return;
      }

      fetchStoreId({
        dispatch,
        collectionUid,
        estoreBaseUrl,
        reject,
      })
        .then(store_id => {
          // 对于gallery的登录 没有storeId则不进行后续操作
          if (fromGallery && !store_id) {
            return;
          }
          dispatch({
            [CALL_API]: {
              apiPattern: {
                name: SAAS_CLIENT_GALLERY_PRINT_STORE_SING_UP,
                params: {
                  galleryBaseUrl: estoreBaseUrl,
                },
                extraProps: {
                  email,
                  store_id,
                },
              },
              options: {
                method: 'POST',
                headers: {
                  'Content-type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({
                  store_id,
                  email,
                  password,
                }),
              },
            },
          })
            .then(() => {
              fetchUserInfo({
                dispatch,
                estoreBaseUrl,
                reject,
                resolve,
                store_id,
              });
            })
            .catch(() => {});
        })
        .catch(() => {});
    });
  };
};

const getStoreUserInfo = () => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { urls, qs } = getDataFromState(getState());
      const estoreBaseUrl = urls.get('estoreBaseUrl');

      fetchUserInfo({
        dispatch,
        estoreBaseUrl,
        reject,
        resolve,
      });
    });
  };
};

const refetchShopCartState = () => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { urls } = getDataFromState(getState());
      const estoreBaseUrl = urls.get('estoreBaseUrl');

      fetchShopCart({
        dispatch,
        estoreBaseUrl,
        reject,
        resolve,
      }).catch(() => {});
    });
  };
};

const initStoreId = () => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { urls, qs } = getDataFromState(getState());
      const estoreBaseUrl = urls.get('estoreBaseUrl');
      const collectionUid = qs.get('collection_uid');

      fetchStoreId({
        dispatch,
        collectionUid,
        estoreBaseUrl,
        reject,
        resolve,
      }).catch(() => {});
    });
  };
};

const updateStoreInfo = data => {
  return {
    type: UPDATE_PRINT_STORE_INFO,
    data,
  };
};
const handeleLoginOut = () => {
  return {
    type: LOGINOUT,
  };
};

export default {
  storeSignUp,
  updateStoreInfo,
  getStoreUserInfo,
  initStoreId,
  refetchShopCartState,
  handeleLoginOut,
};
