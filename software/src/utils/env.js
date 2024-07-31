import { template } from 'lodash';
import { GET_ENV } from '@resource/lib/constants/apiUrl';
import { getWWWorigin } from '@resource/lib/utils/url';
import { isBrowserEnv } from '@resource/lib/utils/env';
import x2jsInstance from '@resource/lib/utils/xml2js';

const getEnv = () => {
  const url = template(GET_ENV)({ baseUrl: getWWWorigin() });

  return fetch(url)
    .then(response => response.text().then(text => ({ text, response })))
    .then(({ text, response }) => {
      if (!response.ok) {
        return Promise.reject(response);
      }
      return x2jsInstance.xml2js(text);
    });
};

export { getEnv };
