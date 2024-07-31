import { wrapPromise } from '@resource/lib/utils/promise';
import { CALL_API } from '@resource/lib/middlewares/api';
import getDataFromState from '@apps/gallery/utils/getDataFromState';
import request from '@apps/gallery/utils/request';
import {
  SAAS_EMAIL_SHARE_GET_DIRECT_LINK,
  SAAS_EMAIL_SHARE_GET_EMAIL_THEME,
  SAAS_EMAIL_SHARE_SEND_INVITE,
  SAAS_EMAIL_SHARE_GET_PIN_SETTING,
  SAAS_EMAIL_TEMPLATE_LIST,
  SAAS_EMAIL_TEMPLATE_ADD,
  SAAS_EMAIL_TEMPLATE_UPDATE,
  SAAS_EMAIL_TEMPLATE_DELETE
} from '@resource/lib/constants/apiUrl';

// 获取邮箱分享直白链接
const getEmailShareDirectLink = collectionUid => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_EMAIL_SHARE_GET_DIRECT_LINK,
            params: {
              galleryBaseUrl,
              collectionUid
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
              themeUid
            }
          }
        }
      }).then(resolve, reject);
    });
  };
};

// 发送邮件邀请
const sendEmailInvite = body => {
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

// 获取当前Collection下载设置
const getPinSetting = collectionUid => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_EMAIL_SHARE_GET_PIN_SETTING,
            params: {
              galleryBaseUrl,
              collectionUid
            }
          }
        }
      }).then(resolve, reject);
    });
  };
};

//获取邮件模板 列表
const getEmailTemplateList = () => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_EMAIL_TEMPLATE_LIST,
            params: {
              galleryBaseUrl
            }
          }
        }
      }).then(resolve, reject);
    });
  };
};

// 添加邮件模板
const addEmailTemplate = data => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_EMAIL_TEMPLATE_ADD,
            params: {
              galleryBaseUrl
            }
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(data)
          }
        }
      }).then(resolve, reject);
    });
  };
};

// 更新邮件模板
const updateEmailTemplate = data => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_EMAIL_TEMPLATE_UPDATE,
            params: {
              galleryBaseUrl,
              ...data
            }
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(data)
          }
        }
      }).then(resolve, reject);
    });
  };
};

// 删除邮件模板
const deleteEmailTemplate = data => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_EMAIL_TEMPLATE_DELETE,
            params: {
              galleryBaseUrl,
              ...data
            }
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(data)
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
  getPinSetting,
  getEmailTemplateList,
  addEmailTemplate,
  updateEmailTemplate,
  deleteEmailTemplate
};
