import { wrapPromise } from '@resource/lib/utils/promise';

import {
  GLOBAL_SETTINGS_BEFORE_UPLOAD_LOGO,
  GLOBAL_SETTINGS_DELETE_LOGO,
} from '@resource/lib/constants/actionTypes';
import {
  GLOBAL_SETTINGS_ALIS_DOMAIN_PREFIX,
  GLOBAL_SETTINGS_GET_DEFAULT_BRAND,
  GLOBAL_SETTINGS_LOGO_BRANDING_GET_DETAIL,
  GLOBAL_SETTINGS_LOGO_BRANDING_SAVE,
  GLOBAL_SETTINGS_ONLY_BRANDNAME,
  GLOBAL_SETTINGS_UPDATE_DOMAIN_PREFIX,
  GLOBAL_SETTINGS_UPLOAG_LOGO,
} from '@resource/lib/constants/apiUrl';

import { CALL_API } from '@resource/lib/middlewares/api';

import getDataFromState from '@apps/gallery/utils/getDataFromState';

const getLogoBrandingDetail = () => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: GLOBAL_SETTINGS_LOGO_BRANDING_GET_DETAIL,
            params: {
              galleryBaseUrl,
            },
          },
        },
      }).then(resolve, reject);
    });
  };
};

const beforeUpload = () => {
  return {
    type: GLOBAL_SETTINGS_BEFORE_UPLOAD_LOGO,
    payload: {},
  };
};

const uploadLogo = files => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const stateData = getDataFromState(getState());
      const { userInfo, galleryBaseUrl } = stateData;
      // 未登录不上传
      if (!userInfo) {
        return false;
      }
      const form = new FormData();
      form.append('file', files[0]);
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: GLOBAL_SETTINGS_UPLOAG_LOGO,
            params: {
              galleryBaseUrl,
            },
          },
          options: {
            method: 'POST',
            body: form,
          },
        },
      }).then(resolve, reject);
    });
  };
};

const saveLogoBranding = params => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: GLOBAL_SETTINGS_LOGO_BRANDING_SAVE,
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
              ...params,
            }),
          },
        },
      }).then(resolve, reject);
    });
  };
};
const saveOnlyBrandName = params => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: GLOBAL_SETTINGS_ONLY_BRANDNAME,
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
              ...params,
            }),
          },
        },
      }).then(resolve, reject);
    });
  };
};
const deleteLogo = () => {
  return {
    type: GLOBAL_SETTINGS_DELETE_LOGO,
    payload: {},
  };
};
const get_default_brand = () => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: GLOBAL_SETTINGS_GET_DEFAULT_BRAND,
            params: {
              galleryBaseUrl,
            },
          },
        },
      }).then(resolve, reject);
    });
  };
};
const check_domain_prefix = params => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: GLOBAL_SETTINGS_ALIS_DOMAIN_PREFIX,
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
              ...params,
            }),
          },
        },
      }).then(resolve, reject);
    });
  };
};
const update_domain_prefix = params => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: GLOBAL_SETTINGS_UPDATE_DOMAIN_PREFIX,
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
              ...params,
            }),
          },
        },
      }).then(resolve, reject);
    });
  };
};
export default {
  beforeUpload,
  uploadLogo,
  saveLogoBranding,
  getLogoBrandingDetail,
  deleteLogo,
  update_domain_prefix,
  check_domain_prefix,
  get_default_brand,
  saveOnlyBrandName,
};
