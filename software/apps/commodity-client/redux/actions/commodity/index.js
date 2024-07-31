import QS from 'qs';

import { wrapPromise } from '@resource/lib/utils/promise';

import { LOGINOUT, UPDATE_PRINT_STORE_INFO } from '@resource/lib/constants/actionTypes';
import {
  CLIENT_PROJECT_CREATE,
  CLIENT_PROJECT_DELETE,
  CLIENT_PROJECT_SUBMIT,
  CLIENT_PROJECT_UPDATE_TITLE,
  CLONE_VIRTUAL_PROJECT_PROJECT,
  GET_COMMODITY_INFO,
  GET_PRICE_BY_ID,
  GET_PROJECT_LIST,
} from '@resource/lib/constants/apiUrl';

import { CALL_API } from '@resource/lib/middlewares/api';

import getDataFromState from '@apps/commodity-client/utils/getDataFromState';

const getMycommodList = (current_page = 1, page_size = 20) => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { urls, qs } = getDataFromState(getState());
      const baseUrl = urls.get('baseUrl');
      const enc_sw_id = qs.get('enc_sw_id');

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: GET_PROJECT_LIST,
            params: {
              baseUrl,
              current_page,
              page_size,
              enc_sw_id,
            },
          },
        },
      }).then(resolve, reject);
    });
  };
};
const cloneRequest = (newTitle, sourceProjectId, auth) => {
  return (dispatch, getState) => {
    const { userInfo, urls } = getDataFromState(getState());
    const baseUrl = urls.get('baseUrl');
    const userAuth = {
      customerId: auth.customer_id,
      securityToken: auth.security_token,
      timestamp: auth.timestamp,
    };
    const convertedProjectFlag = false;
    const projectId = sourceProjectId;
    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: CLONE_VIRTUAL_PROJECT_PROJECT,
          params: {
            baseUrl: baseUrl,
            convertedProjectFlag,
          },
        },
        options: {
          method: 'POST',
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
          body: JSON.stringify({
            projectId,
            requestKey: 'PC',
            title: newTitle,
            auth: userAuth,
            editorVer: 'V4',
            appScope: 'PRODSTORE',
          }),
        },
      },
    }).then((result = {}) => {
      const { isRequestSuccess, data } = result;
      if (!isRequestSuccess) {
        return Promise.reject(data.message);
      }

      const { projectList } = data;
      if (!projectList || !projectList.length) {
        return Promise.reject('clone处理的project list为空.');
      }
      return Promise.resolve(data);
    });
  };
};
const projectCreate = (goods_id, project_id) => {
  return (dispatch, getState) => {
    const { urls, qs } = getDataFromState(getState());
    const baseUrl = urls.get('baseUrl');
    const enc_sw_id = qs.get('enc_sw_id');
    return wrapPromise((resolve, reject) => {
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: CLIENT_PROJECT_CREATE,
            params: {
              baseUrl,
            },
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
              project_id,
              goods_id,
              enc_sw_id,
            }),
          },
        },
      }).then(resolve, reject);
    });
  };
};
const getCommodityInfo = () => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { urls, qs } = getDataFromState(getState());
      const baseUrl = urls.get('baseUrl');
      const enc_sw_id = qs.get('enc_sw_id');

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: GET_COMMODITY_INFO,
            params: {
              baseUrl,
              enc_sw_id,
            },
          },
        },
      }).then(resolve, reject);
    });
  };
};

const projectDelete = client_project_id => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { urls, qs } = getDataFromState(getState());
      const baseUrl = urls.get('baseUrl');
      const enc_sw_id = qs.get('enc_sw_id');
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: CLIENT_PROJECT_DELETE,
            params: {
              baseUrl,
            },
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
              client_project_id,
              enc_sw_id,
            }),
          },
        },
      }).then(resolve, reject);
    });
  };
};

const projectSubmit = client_project_id => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { urls, qs } = getDataFromState(getState());
      const baseUrl = urls.get('baseUrl');
      const enc_sw_id = qs.get('enc_sw_id');

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: CLIENT_PROJECT_SUBMIT,
            params: {
              baseUrl,
            },
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
              client_project_id,
              enc_sw_id,
            }),
          },
        },
      }).then(resolve, reject);
    });
  };
};

const getPriceById = id => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { urls, qs } = getDataFromState(getState());
      const baseUrl = urls.get('baseUrl');
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: GET_PRICE_BY_ID,
            params: {
              baseUrl,
              id,
            },
          },
        },
      }).then(resolve, reject);
    });
  };
};

const changeProjectTitle = (id, title) => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { urls, qs } = getDataFromState(getState());
      const baseUrl = urls.get('baseUrl');
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: CLIENT_PROJECT_UPDATE_TITLE,
            params: {
              baseUrl,
            },
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
              id,
              title,
            }),
          },
        },
      }).then(resolve, reject);
    });
  };
};

export default {
  getMycommodList,
  cloneRequest,
  getCommodityInfo,
  projectCreate,
  projectDelete,
  projectSubmit,
  getPriceById,
  changeProjectTitle,
};
