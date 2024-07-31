import {template} from 'lodash';
import { ALIPAY, WXPAY } from '@resource/lib/constants/apiUrl';



export function getAlipay(order_number, galleryBaseUrl = '/') {
  const url = template(ALIPAY)({ galleryBaseUrl, order_number });
  return url;
}

export function getWXpay(order_number, galleryBaseUrl = '') {
  const url = template(WXPAY)({ galleryBaseUrl, order_number });
  return url;
}
