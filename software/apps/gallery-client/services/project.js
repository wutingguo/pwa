import * as xhr from 'appsCommon/utils/xhr';
import { template } from 'lodash';

import {
  ESTORE_DELETE_MY_PROJECT,
  ESTORE_GET_MY_PROJECT_LIST,
  ESTORE_GET_PROJECT,
} from '@resource/lib/constants/apiUrl';

import { GALLERY_SET_IMGAGES, GALLERY_GET_FAVORITE_IMGAGES } from '@apps/gallery-client/constants/apiUrl';

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

/**
 * 获取gallery页面喜爱images--张勇--王亚伟
 */
export const getFavoriteImages = ({ baseUrl, collection_uid, guest_uid }) => {
  return new Promise((resolve, reject) => {
    const url = template(GALLERY_GET_FAVORITE_IMGAGES)({ baseUrl, collection_uid, guest_uid });
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

