import * as xhr from 'appsCommon/utils/xhr';
import { template } from 'lodash';

import {
  SLIDESHOW_GET_PREFERENCE_CONFIG,
  SLIDESHOW_SAVE_PREFERENCE_CONFIG,
} from '@resource/lib/constants/apiUrl';

const getPreferenceConfig = ({ baseUrl }) => {
  return new Promise((resolve, reject) => {
    const url = template(SLIDESHOW_GET_PREFERENCE_CONFIG)({
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
    const url = template(SLIDESHOW_SAVE_PREFERENCE_CONFIG)({ baseUrl });
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
export { getPreferenceConfig, savePreferenceConfig };
