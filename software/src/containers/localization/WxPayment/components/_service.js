import {template} from 'lodash';
import {getRequestResult} from 'appsCommon/utils/xhr';
import {GET_CREDIT_CARD_LIST, GET_BILLING_DETIAL, WXCODE, ORDERSTATUS} from 'src/constants/apiUrl';
import { getWWWorigin } from '@resource/lib/utils/url';

export function getCreditCardList() {
  const url = template(GET_CREDIT_CARD_LIST)({ baseUrl: getWWWorigin(), autoRandomNum: Date.now() });
  return getRequestResult({url});
}

export function getBillingDetail() {
  const url = template(GET_BILLING_DETIAL)({ baseUrl: getWWWorigin() });
  return getRequestResult({url});
}

export function getWXCode(order_number) {
  const data = {
    order_number
  }
  const url = template(WXCODE)({ });
  return getRequestResult({
    url,
    method: 'post',
    data
  });
}

export function getOrderStatus(order_number) {
  const url = template(ORDERSTATUS)({order_number});
  return getRequestResult({
    url,
    method: 'get'
  });
}