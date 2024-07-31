import { template } from 'lodash';
import * as xhr from '@resource/websiteCommon/utils/xhr';
import { ESTORE_CART_DATA } from '@resource/lib/constants/apiUrl';

const relaceBaseUrl = baseUrl => {
  return baseUrl.replace('zno', 'asovx');
};

const getCartData = ({ cloudapiUrl }) => {
  const url = template(ESTORE_CART_DATA)({
    baseUrl: cloudapiUrl
  });
  return xhr.get(url);
};

export default {
  getCartData
};
