import { template } from 'lodash';
import * as xhr from 'appsCommon/utils/xhr';
import { GET_COUNTRY_DISTRICTS } from 'appsCommon/constants/apiUrl';
import { getWWWorigin } from '@resource/lib/utils/url';

export const getCountryList = ({ estoreBaseUrl }) => {
  return new Promise((resolve, reject) => {
    const url = template(GET_COUNTRY_DISTRICTS)({ baseUrl: estoreBaseUrl });
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
