import { get } from 'lodash';
import { wrapPromise } from '@resource/lib/utils/promise';
import { CALL_API } from '@resource/lib/middlewares/api';
import getDataFromState from '@apps/slide-show-client/utils/getDataFromState';
import {
  SAAS_CLIENT_SLIDESHOW_PREVIEW_GET_DETAIL,
  SAAS_CLIENT_SLIDESHOW_LICENSE_LEVEL,
  SAAS_CLIENT_SLIDESHOW_LICENSE_LEVEL_WITH_GIVE_AWAY,
  SAAS_SLIDE_GET_DOWNLOAD_SETTING_CLIENT,
  SAAS_SLIDE_GET_DOWNLOAD_URL_CLIENT,
  SAAS_SLIDE_CHECK_PIN,
  EGT_STUDIO_INFO_CLIENT
} from '@resource/lib/constants/apiUrl';
import { getPostCardDetail } from '../postcard';

/**
 * 获取详细信息
 */
const getCollectionDetail = () => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl, qs } = getDataFromState(getState());
      const customer_uid = qs.get('customer_uid');
      const share_uid = qs.get('share_uid');
      const project_id = qs.get('project_id');

      if (!project_id) {
        return reject('project_id is required');
      }

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_CLIENT_SLIDESHOW_PREVIEW_GET_DETAIL,
            params: {
              galleryBaseUrl,
              project_id,
              customer_uid,
              share_uid,
              autoRandomNum: Date.now()
            }
          }
        }
      }).then(res => {
        if (res && res.data && res.ret_code === 200000) {
          const visiting_card = get(res, 'data.visiting_card');
          if (visiting_card) {
            dispatch(getPostCardDetail(visiting_card));
          }
        }
        resolve(res);
      }, reject);
    });
  };
};

/**
 * 获取project 对应用户的订阅等级
 * @returns {function(*=, *): Promise<unknown> | Promise<unknown>}
 */
const getLicenseLevel = () => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl, qs } = getDataFromState(getState());
      const project_id = qs.get('project_id');

      if (!project_id) {
        return reject('project_id is required');
      }

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_CLIENT_SLIDESHOW_LICENSE_LEVEL,
            params: {
              galleryBaseUrl,
              project_id
            }
          }
        }
      }).then(res => {
        resolve(res);
      }, reject);
    });
  };
};

/**
 * 获取project 对应用户的订阅等级
 * @returns {function(*=, *): Promise<unknown> | Promise<unknown>}
 */
const getLicenseLevelWithGive = () => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl, qs } = getDataFromState(getState());
      const project_id = qs.get('project_id');

      if (!project_id) {
        return reject('project_id is required');
      }

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_CLIENT_SLIDESHOW_LICENSE_LEVEL_WITH_GIVE_AWAY,
            params: {
              galleryBaseUrl,
              project_id
            }
          }
        }
      }).then(res => {
        resolve(res);
      }, reject);
    });
  };
};

// 获取客户端下载配置
const getClientDownloadSetting = () => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl, qs } = getDataFromState(getState());
      const project_id = qs.get('project_id');

      if (!project_id) {
        return reject('project_id is required');
      }

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_SLIDE_GET_DOWNLOAD_SETTING_CLIENT,
            params: {
              galleryBaseUrl,
              project_id
            }
          }
        }
      }).then(res => {
        resolve(res);
      }, reject);
    });
  };
};

const getClientDownloadUrl = () => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl, qs } = getDataFromState(getState());
      const project_id = qs.get('project_id');

      if (!project_id) {
        return reject('project_id is required');
      }
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_SLIDE_GET_DOWNLOAD_URL_CLIENT,
            params: {
              galleryBaseUrl,
              project_id
            }
          }
        }
      }).then(res => {
        resolve(res);
      }, reject);
    });
  };
};

const getClientDownloadCheckPin = ({ pin = '' }) => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl, qs } = getDataFromState(getState());
      const project_id = qs.get('project_id');

      if (!project_id) {
        return reject('project_id is required');
      }
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_SLIDE_CHECK_PIN,
            params: {
              galleryBaseUrl,
              project_id,
              pin
            }
          }
        }
      }).then(res => {
        resolve(res);
      }, reject);
    });
  };
};

function getStudioInfo() {
  return (dispatch, getState) => {
    const { galleryBaseUrl, qs } = getDataFromState(getState());
    const userId = qs.get('user_id');

    if (!userId) {
      return;
    }
    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: EGT_STUDIO_INFO_CLIENT,
          params: {
            galleryBaseUrl,
            userId
          }
        },
        options: {
          method: 'GET',
          headers: {
            'Content-type': 'application/json; charset=UTF-8'
          }
        }
      }
    });
  };
}

export default {
  getCollectionDetail,
  getLicenseLevel,
  getLicenseLevelWithGive,
  getClientDownloadSetting,
  getClientDownloadUrl,
  getClientDownloadCheckPin,
  getStudioInfo
};
