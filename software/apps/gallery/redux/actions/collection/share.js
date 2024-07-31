import { wrapPromise } from '@resource/lib/utils/promise';
import { CALL_API } from '@resource/lib/middlewares/api';
import getDataFromState from '@apps/gallery/utils/getDataFromState';
import request from '@apps/gallery/utils/request';
import {
  SAAS_EMAIL_SHARE_GET_DIRECT_LINK,
  SAAS_EMAIL_SHARE_GET_EMAIL_THEME,
  SAAS_EMAIL_SHARE_SEND_INVITE,
} from '@resource/lib/constants/apiUrl';

// 获取邮箱分享直白链接
const getEmailShareDirectLink = (collectionUid) => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_EMAIL_SHARE_GET_DIRECT_LINK,
            params: {
              galleryBaseUrl,
              collectionUid,
            }
          }
        }
      }).then(resolve, reject);
    });
  };
};

// 获取邮箱分享邮箱主题
const getEmailShareEmailTheme = (collectionUid, themeUid) => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_EMAIL_SHARE_GET_EMAIL_THEME,
            params: {
              galleryBaseUrl,
              collectionUid,
              themeUid,
            }
          }
        }
      }).then(resolve, reject);
    });
  };
};

// 发送邮件邀请
const sendEmailInvite = (body) => {
  return (dispatch, getState) => {
    const { galleryBaseUrl } = getDataFromState(getState());
    return wrapPromise((resolve, reject) => {
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_EMAIL_SHARE_SEND_INVITE,
            params: {
              galleryBaseUrl
            }
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(body)
          }
        }
      }).then(resolve, reject);
    });
  };
};

export default {
  getEmailShareDirectLink,
  getEmailShareEmailTheme,
  sendEmailInvite,
}