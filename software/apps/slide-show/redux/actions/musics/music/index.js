import { wrapPromise } from '@resource/lib/utils/promise';
import { CALL_API } from '@resource/lib/middlewares/api';
import getDataFromState from '@apps/slide-show/utils/getDataFromState';

import {
  SAAS_SLIDE_GET_MUSIC_CATEGORIES,
  SAAS_SLIDE_UPLOAD_MUSIC,
  SAAS_SLIDE_GET_MUSIC_LIST,
  SAAS_SLIDE_TOGGLE_MUSIC_FAVORITE,
  SAAS_SLIDE_GET_FAVORITE_MUSICE_LIST,
  SAAS_SLIDE_DELETE_MUSICE,
  SAAS_SLIDE_UPDATE_MUSICE,
  SAAS_SLIDE_GET_MUSIC_LIST_NEW,
} from '@resource/lib/constants/apiUrl';

import request from '@apps/slide-show/utils/request';
import getActionKey from '@apps/slide-show/utils/actionKey';
import { withAutoSaving } from '@resource/lib/redux-helper/action';
import { DELETE_MUSICL_LIST, DELETE_FAVORITE_LIST } from '@resource/lib/constants/actionTypes';

/**
 * 获取music分类
 */
const getMusicCategories = () => {
  return request({
    url: SAAS_SLIDE_GET_MUSIC_CATEGORIES
  });
};

/**
 * 获取音乐库列表
 */
const getMusicList = (opt = {}) => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const {
        current_page = 1,
        page_size = 1000,
        keywords = '',
        category,
        themes = '',
        moods = '',
        tempos = '',
        instruments = '',
        styles = ''
      } = opt;
      const { galleryBaseUrl } = getDataFromState(getState());

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_SLIDE_GET_MUSIC_LIST,
            params: {
              galleryBaseUrl,
              current_page,
              page_size,
              keywords,
              category,
              themes,
              moods,
              tempos,
              instruments,
              styles
            }
          }
        }
      }).then(resolve, reject);
    });
  };
};

/**
 * 获取音乐库列表
 */
const getMusicListNew = (opt = {}) => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const {
        current_page = 1,
        page_size = 1000,
        keywords = '',
        category,
        themes = '',
        moods = '',
        tempos = '',
        instruments = '',
        styles = ''
      } = opt;
      const { galleryBaseUrl } = getDataFromState(getState());

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_SLIDE_GET_MUSIC_LIST_NEW,
            params: {
              galleryBaseUrl,
              current_page,
              page_size,
              keywords,
              category,
              themes,
              moods,
              tempos,
              instruments,
              styles
            }
          }
        }
      }).then(resolve, reject);
    });
  };
};

const deleteMusicList = () => {
  return {
    type: getActionKey(DELETE_MUSICL_LIST)
  };
};

/**
 * 添加或取消收藏.
 * @param {string} enc_id
 * @param {number} action 1收藏/0取消收藏
 */
const toggleFavorite = (enc_id, action = 1) => {
  return (dispatch, getState) => {
    const { galleryBaseUrl } = getDataFromState(getState());

    return wrapPromise((resolve, reject) => {
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_SLIDE_TOGGLE_MUSIC_FAVORITE,
            params: {
              galleryBaseUrl
            }
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({
              enc_id,
              action
            })
          }
        }
      }).then(
        ret => {
          // 重新获取一下收藏列表.
          dispatch(getFavoriteList());
          resolve(ret);
        },
        err => reject(err)
      );
    });
  };
};

/**
 * 添加收藏
 * @param {string} enc_id
 */
const addToFavorite = enc_id => {
  return toggleFavorite(enc_id, 1);
};

/**
 * 取消收藏
 * @param {string} enc_id
 */
const removeFromFavorite = enc_id => {
  return toggleFavorite(enc_id, 0);
};

/**
 * 获取已收藏音乐列表
 */
const getFavoriteList = (opt = {}) => {
  const { category = '', keywords = '' } = opt;
  return (dispatch, getState) => {
    const { galleryBaseUrl } = getDataFromState(getState());
    const query = {
      category,
      keywords,
      page_size: 1000,
      current_page: 1
    };
    return wrapPromise((resolve, reject) => {
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_SLIDE_GET_FAVORITE_MUSICE_LIST,
            params: {
              galleryBaseUrl,
              ...query
            }
          }
        }
      });
    });
  };
};

const deleteFavoriteList = () => {
  return {
    type: getActionKey(DELETE_FAVORITE_LIST)
  };
};

/**
 * 删除音乐.
 * @param {string} music_id
 */
const deleteMusic = music_id => {
  return request(
    withAutoSaving({
      url: SAAS_SLIDE_DELETE_MUSICE,
      method: 'POST',
      bodyParams: {
        music_id
      }
    })
  );
};

/**
 * 更新音乐.
 */
const updateMusic = body => {
  return request(
    withAutoSaving({
      url: SAAS_SLIDE_UPDATE_MUSICE,
      method: 'POST',
      bodyParams: body
    })
  );
};

export default {
  getMusicCategories,
  getMusicList,
  toggleFavorite,
  addToFavorite,
  removeFromFavorite,
  getFavoriteList,
  deleteMusic,
  updateMusic,
  deleteMusicList,
  deleteFavoriteList,
  getMusicListNew,
};
