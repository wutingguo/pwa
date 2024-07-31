import * as xhr from 'appsCommon/utils/xhr';
import { template } from 'lodash';

import {
  ESTORE_DELETE_MY_PROJECT,
  ESTORE_GET_MY_PROJECT_LIST,
  ESTORE_GET_PROJECT,
} from '@resource/lib/constants/apiUrl';

import {
  GALLERY_GET_MINICODE,
  GALLERY_GET_MINITOKEN,
} from '@apps/gallery-client-mobile/constants/apiUrl';
import { GALLERY_SET_IMGAGES } from '@apps/gallery-client/constants/apiUrl';

export const getMyProjectList = ({ baseUrl }) => {
  return new Promise((resolve, reject) => {
    const url = template(ESTORE_GET_MY_PROJECT_LIST)({ baseUrl });
    xhr.get(url).then(result => {
      const { ret_code, data = {} } = result;
      if (ret_code === 200000) {
        resolve(data);
      } else {
        reject;
      }
    });
  });
};

export const deleteMyProject = ({ projectId, baseUrl }) => {
  return new Promise((resolve, reject) => {
    const url = template(ESTORE_DELETE_MY_PROJECT)({ baseUrl });
    xhr.post(url, { project_id: projectId }).then(result => {
      const { ret_code, data = {} } = result;

      if (ret_code === 200000) {
        resolve(data);
      } else {
        reject(ret_code);
      }
    });
  });
};

export const queryMyProject = ({ projectId, baseUrl }) => {
  return new Promise((resolve, reject) => {
    const url = template(ESTORE_GET_PROJECT)({ baseUrl });
    xhr.post(url, { project_id: projectId }).then(result => {
      const { ret_code, data = {} } = result;

      if (ret_code === 200000) {
        resolve(data);
      } else {
        reject(ret_code);
      }
    });
  });
};

/**
 * 获取gallery页面images
 */
export const querySetImages = ({ set_uid, baseUrl }) => {
  return new Promise((resolve, reject) => {
    const url = template(GALLERY_SET_IMGAGES)({ baseUrl, set_uid });
    xhr.get(url).then(result => {
      const { ret_code, data = {} } = result;

      if (ret_code === 200000) {
        resolve(data);
      } else {
        reject(ret_code);
      }
    });
  });
};
// 获取小程序token
export const getMiniToken = ({ baseUrl, app_id }) => {
  return new Promise((resolve, reject) => {
    const url = template(GALLERY_GET_MINITOKEN)({ baseUrl, app_id });
    xhr.get(url).then(result => {
      const { ret_code, data = {} } = result;
      if (ret_code === 200000) {
        resolve(data);
      } else {
        reject(ret_code);
      }
    });
  });
};
// 获取项目生成的小程序二维码
export const getMiniCode = ({ baseUrl, appId, path, scene, width, version = 1 }) => {
  const url = template(GALLERY_GET_MINICODE)({ baseUrl, appId, path, scene, width, version });
  return fetch(url).then(result => {
    return result.blob();
  });
};

export const getMiniCodeUrl = ({ baseUrl, appId, path, scene, width, version = 1 }) => {
  const url = template(GALLERY_GET_MINICODE)({ baseUrl, appId, path, scene, width, version });
  // return fetch(url).then(result => {
  //   return result.blob();
  // });
  return url;
};
