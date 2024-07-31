import * as xhr from 'appsCommon/utils/xhr';
import { template } from 'lodash';

import {
  GALLERY_ADD_VIDEO,
  GALLERY_GET_PREFERENCE_CONFIG,
  GALLERY_SAVE_PREFERENCE_CONFIG,
  GALLERY_VIDEO_UPLOAD,
  GLOBAL_SETTINGS_GET_DEFAULT_BRAND,
} from '@resource/lib/constants/apiUrl';

import reaquest from '@common/utils/request';

const getBrand = ({ galleryBaseUrl }) => {
  return new Promise((resolve, reject) => {
    const url = template(GLOBAL_SETTINGS_GET_DEFAULT_BRAND)({ galleryBaseUrl });
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
const galleryFetchUploadUrl = ({ baseUrl, upload_file }) => {
  const url = template(GALLERY_VIDEO_UPLOAD)({ baseUrl });
  /**
   * 设置默认media_type
   * 1. 表示iamge
   * 2. 表示audio
   * 3. 表示video
   *  */
  const fileList = upload_file.map(item => {
    if (!item.media_type) {
      item.media_type = 3;
    }
    return item;
  });
  return reaquest({ url, data: { upload_file: fileList, hasManageError: false } }, 'post', {
    hasManageError: false,
  });
};

const uploadVideo = async ({ baseUrl, set_uid, upload_list }) => {
  const url = template(GALLERY_ADD_VIDEO)({ baseUrl });
  return xhr.post(url, { set_uid, upload_list }).then(res => {
    console.log(res, '================================');
    if (res.ret_code === 200000) {
      return true;
    }
  });
};

const getPreferenceConfig = ({ baseUrl }) => {
  return new Promise((resolve, reject) => {
    const url = template(GALLERY_GET_PREFERENCE_CONFIG)({
      baseUrl,
      config_key: 'sharpening_level',
    });
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
const savePreferenceConfig = async ({ baseUrl, param }) => {
  return new Promise((resolve, reject) => {
    const url = template(GALLERY_SAVE_PREFERENCE_CONFIG)({ baseUrl });
    xhr.post(url, param).then(result => {
      const { ret_code, data = {} } = result;
      if (ret_code === 200000) {
        resolve(data);
      } else {
        reject;
      }
    });
  });
};

export { getBrand, galleryFetchUploadUrl, uploadVideo, getPreferenceConfig, savePreferenceConfig };
