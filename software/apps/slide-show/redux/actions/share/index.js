import { wrapPromise } from '@resource/lib/utils/promise';
import { CALL_API } from '@resource/lib/middlewares/api';
import getDataFromState from '@apps/slide-show/utils/getDataFromState';
import request from '@apps/slide-show/utils/request';
import {
  SAAS_SLIDE_GET_SHARE_URL,
  SAAS_SLIDE_EMAIL_SHARE_GET_EMAIL_THEME,
  SAAS_SLIDE_EMAIL_SHARE_SEND_INVITE,
  SAAS_EMAIL_SLIDE_SHOW_TEMPLATE_LIST,
  SAAS_EMAIL_SLIDE_SHOW_TEMPLATE_ADD,
  SAAS_EMAIL_SLIDE_SHOW_TEMPLATE_UPDATE,
  SAAS_EMAIL_SLIDE_SHOW_TEMPLATE_DELETE
} from '@resource/lib/constants/apiUrl';

// 获取邮箱分享直白链接
const getEmailShareDirectLink = id => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_SLIDE_GET_SHARE_URL,
            params: {
              galleryBaseUrl,
              project_id: id
            }
          }
        }
      }).then(resolve, reject);
    });
  };
};

//获取邮件模板 列表
const getSlideshowEmailTemplateList = () => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { urls } = getDataFromState(getState());
      const galleryBaseUrl = urls.get('saasBaseUrl');
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_EMAIL_SLIDE_SHOW_TEMPLATE_LIST,
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
const addSlideshowEmailTemplate = data => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { urls } = getDataFromState(getState());
      const galleryBaseUrl = urls.get('saasBaseUrl');
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_EMAIL_SLIDE_SHOW_TEMPLATE_ADD,
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
const updateSlideshowEmailTemplate = data => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { urls } = getDataFromState(getState());
      const galleryBaseUrl = urls.get('saasBaseUrl');
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_EMAIL_SLIDE_SHOW_TEMPLATE_UPDATE,
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
const deleteSlideshowEmailTemplate = data => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { urls } = getDataFromState(getState());
      const galleryBaseUrl = urls.get('saasBaseUrl');
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_EMAIL_SLIDE_SHOW_TEMPLATE_DELETE,
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

// 获取邮箱分享邮箱主题
const getEmailShareEmailTheme = (projectId, themeUid) => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_SLIDE_EMAIL_SHARE_GET_EMAIL_THEME,
            params: {
              galleryBaseUrl,
              projectId,
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
            name: SAAS_SLIDE_EMAIL_SHARE_SEND_INVITE,
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
  getSlideshowEmailTemplateList,
  addSlideshowEmailTemplate,
  updateSlideshowEmailTemplate,
  deleteSlideshowEmailTemplate
};
