import { template } from 'lodash';
import * as xhr from '@resource/websiteCommon/utils/xhr';
import {
  ESTORE_ADD_PAYMENT_METHOD,
  ESTORE_DISABLE_PAYMENT_METHOD
} from '@resource/lib/constants/apiUrl';

const addPaymentMethod = ({
  baseUrl,
  storeId,
  appId,
  paymentMethodCode,
  appSecret,
  credentials
}) => {
  const url = template(ESTORE_ADD_PAYMENT_METHOD)({
    baseUrl
  });
  const bodyParams = {
    store_id: storeId,
    app_id: appId,
    payment_method_code: paymentMethodCode,
    app_secret: appSecret,
    credentials
  };
  return xhr.post(url, bodyParams);
};

const disablePaymentMethod = ({ baseUrl, storeId, paymentMethod }) => {
  const url = template(ESTORE_DISABLE_PAYMENT_METHOD)({
    baseUrl,
    store_id: storeId,
    payment_method: paymentMethod
  });

  return xhr.get(url);
};

export default {
  addPaymentMethod,
  disablePaymentMethod
};
