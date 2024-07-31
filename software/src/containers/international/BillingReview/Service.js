import { template } from 'lodash';
import { getRequestResult } from '@resource/websiteCommon/utils/xhr';
import { GET_CREDIT_CARD_LIST, GET_BILLING_DETIAL } from '@src/constants/apiUrl';
import { getWWWorigin } from '@resource/lib/utils/url';
const baseUrl = getWWWorigin();

export function getCreditCardList() {
  const url = template(GET_CREDIT_CARD_LIST)({ baseUrl, autoRandomNum: Date.now() });
  return getRequestResult({ url });
}

export function getBillingDetail() {
  const url = template(GET_BILLING_DETIAL)({ baseUrl });
  return getRequestResult({ url });
}
