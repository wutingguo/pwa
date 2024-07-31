import { isImmutable } from 'immutable';

import { wrapPromise } from '@resource/lib/utils/promise';

import {
  SAAS_CLIENT_GALLERY_ADD_COMMENT,
  SAAS_CLIENT_GALLERY_FAVORITE_LABELS,
  SAAS_CLIENT_GALLERY_GET_GUEST_FAVORITES,
  SAAS_CLIENT_GALLERY_LIST_LABEL_COUNT,
  SAAS_CLIENT_GALLERY_LIST_LABEL_IMAGES,
  SAAS_CLIENT_GALLERY_MARK_TO_FAVORITE,
  SAAS_CLIENT_GALLERY_SAVE_LABEL,
  SAAS_CLIENT_GALLERY_SYNC,
  SAAS_CLIENT_GALLERY_UNMARK_FROM_FAVORITE,
} from '@resource/lib/constants/apiUrl';

import { CALL_API } from '@resource/lib/middlewares/api';

import { CURRENT_SET_FAVORITE_IMAGE_COUNT } from '@apps/gallery-client/constants/actionTypes';
import getDataFromState from '@apps/gallery-client/utils/getDataFromState';

/**
 * 加入收藏
 * @param {String} enc_image_uid
 */
const markToFavorite = enc_image_uid => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl, qs, guest } = getDataFromState(getState());
      const collection_uid = qs.get('collection_uid');
      const guest_uid = guest.get('guest_uid');

      if (!collection_uid || !guest_uid) {
        return reject('collection_uid or guest_uid is empty');
      }

      return dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_CLIENT_GALLERY_MARK_TO_FAVORITE,
            params: {
              galleryBaseUrl,
            },
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
              collection_uid,
              guest_uid,
              enc_image_uid,
            }),
          },
        },
      }).then(
        res => resolve({ ...res, isMark: true }),
        err => reject({ ...err, isMark: true })
      );
    });
  };
};

/**
 * 取消收藏
 * @param {String} image_uid
 * @param {String} favorite_uid
 */
const unmarkFromFavorite = (enc_image_uid, favorite_uid) => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl, qs, guest } = getDataFromState(getState());
      const collection_uid = qs.get('collection_uid');
      const guest_uid = guest?.get('guest_uid');

      if (!collection_uid || !favorite_uid || !guest_uid) {
        return reject('collection_uid, favorite_uid or guest_uid is empty ');
      }

      return dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_CLIENT_GALLERY_UNMARK_FROM_FAVORITE,
            params: {
              galleryBaseUrl,
              enc_image_uid,
            },
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
              collection_uid,
              guest_uid,
              enc_image_uid,
              favorite_uid,
            }),
          },
        },
      }).then(resolve, reject);
    });
  };
};

const syncGalleryFavList = content => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl, qs, guest } = getDataFromState(getState());
      const collection_uid = qs.get('collection_uid');
      const guest_uid = guest?.get('guest_uid');

      if (!collection_uid || !guest_uid) {
        return reject('collection_uid or guest_uid is empty ');
      }

      return dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_CLIENT_GALLERY_SYNC,
            params: {
              galleryBaseUrl,
            },
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
              collection_uid,
              guest_uid,
              content,
            }),
          },
        },
      }).then(resolve, reject);
    });
  };
};

const markOrUnmark = enc_image_uid => {
  return (dispatch, getState) => {
    const { favorite } = getDataFromState(getState());
    if (!isImmutable(favorite)) return;

    const favoriteImageList = favorite.getIn(['favorite_image_list', 'records']) || [];
    const favoriteImage = favoriteImageList.find(m => m?.get('enc_image_uid') === enc_image_uid);
    const hasMarked = favoriteImageList?.size && favoriteImage?.size;
    // 偶现这里的favorite与favoriteImage数据异常 出异常时 favorite和favoriteImage内数据很少 favorite内无favorite_uid favoriteImage内有favorite_uid
    const favorite_uid = favorite.get('favorite_uid') || favoriteImage?.get('favorite_uid');

    if (!favorite_uid) {
      document.body.appendChild(document.createTextNode('favorite_uid is empty'));
    }
    if (hasMarked) {
      return dispatch(unmarkFromFavorite(enc_image_uid, favorite_uid));
    }

    return dispatch(markToFavorite(enc_image_uid));
  };
};

/**
 * 获取客户的favorite中images列表
 */
const getFavoriteImageList = guestUid => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl, qs, guest } = getDataFromState(getState());
      const collection_uid = qs.get('collection_uid');
      const guest_uid = guestUid || guest.get('guest_uid');
      if (!guest_uid || !collection_uid) {
        console.log('guest_uid or collection_uid is empty');

        return resolve();
      }

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_CLIENT_GALLERY_GET_GUEST_FAVORITES,
            params: {
              galleryBaseUrl,
              collection_uid,
              guest_uid,
              autoRandomNum: Date.now(),
            },
          },
        },
      }).then(resolve, reject);
    });
  };
};

/**
 * 添加备注
 * @param {String} comment
 */
const addComment = (enc_image_uid, comment) => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl, guest, favorite } = getDataFromState(getState());
      const guest_uid = guest.get('guest_uid');
      const favorite_uid = favorite.get('favorite_uid');

      if (!enc_image_uid || !favorite_uid) {
        return reject('favorite_uid or enc_image_uid is empty');
      }

      return dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_CLIENT_GALLERY_ADD_COMMENT,
            params: {
              galleryBaseUrl,
            },
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
              favorite_note: comment,
              guest_uid,
              favorite_uid,
              enc_image_uid,
            }),
          },
        },
      }).then(resolve, reject);
    });
  };
};

/**
 * 设置当前 set 的 favorite 图片数量
 * @param {*} setIndex
 * @param {*} currentSet
 * @param {*} favoriteImageList
 */
const setCurrentSetFavoriteImageCount = (setIndex, currentSet, favoriteImageList) => {
  return {
    type: CURRENT_SET_FAVORITE_IMAGE_COUNT,
    payload: { setIndex, currentSet, favoriteImageList },
  };
};

/**
 * 获取单张图片标签详情
 */
const getImgTagInfo = enc_image_uid => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl, qs, favorite, detail } = getDataFromState(getState());
      const collection_id = detail.get('collection_uid');
      const customer_id = qs.get('customer_uid');
      const favorite_id = favorite.get('favorite_uid');
      if (!favorite_id || !collection_id) {
        console.log('favorite_id or collection_uid is empty');
        return resolve();
      }
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_CLIENT_GALLERY_FAVORITE_LABELS,
            params: {
              galleryBaseUrl,
              collection_id,
              customer_id,
              favorite_id,
              image_id: enc_image_uid,
            },
          },
        },
      }).then(resolve, reject);
    });
  };
};
/**
 * 获取标签统计数量
 */
const getTagAmount = set_id => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl, qs, favorite, detail } = getDataFromState(getState());
      const collection_id = detail.get('collection_uid');
      const customer_id = qs.get('customer_uid');
      const favorite_id = favorite.get('favorite_uid');
      if (!collection_id || !favorite_id) {
        console.log('favorite_id or collection_uid is empty');
        return resolve();
      }
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_CLIENT_GALLERY_LIST_LABEL_COUNT,
            params: {
              galleryBaseUrl,
              collection_id,
              customer_id,
              favorite_id,
              set_id: null,
            },
          },
        },
      }).then(resolve, reject);
    });
  };
};

/**
 * 保存标签信息
 */
const saveLableInfo = (label_id, enc_image_uid, mark) => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl, qs, favorite, detail } = getDataFromState(getState());
      const collection_id = detail.get('collection_uid');
      const customer_id = qs.get('customer_uid');
      const favorite_id = favorite.get('favorite_uid');
      console.log(detail, 'detail');

      if (!favorite_id || !collection_id) {
        return reject('favorite_uid or enc_image_uid is empty');
      }

      return dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_CLIENT_GALLERY_SAVE_LABEL,
            params: {
              galleryBaseUrl,
            },
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
              collection_id,
              customer_id,
              favorite_id,
              label_id,
              enc_image_uid,
              mark,
            }),
          },
        },
      }).then(resolve, reject);
    });
  };
};
/**
 * 获取标签图片列表
 */
const getLableImgList = label_id => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl, qs, favorite, detail } = getDataFromState(getState());
      const collection_id = detail.get('collection_uid');
      const customer_id = qs.get('customer_uid');
      const favorite_id = favorite.get('favorite_uid');
      if (!favorite_id || !collection_id) {
        console.log('favorite_id or collection_uid is empty');
        return resolve();
      }
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_CLIENT_GALLERY_LIST_LABEL_IMAGES,
            params: {
              galleryBaseUrl,
              collection_id,
              customer_id,
              favorite_id,
              label_id,
            },
          },
        },
      }).then(resolve, reject);
    });
  };
};

export default {
  markOrUnmark,
  markToFavorite,
  unmarkFromFavorite,
  getFavoriteImageList,
  addComment,
  setCurrentSetFavoriteImageCount,
  syncGalleryFavList,
  getImgTagInfo,
  getTagAmount,
  saveLableInfo,
  getLableImgList,
};
