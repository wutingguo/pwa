import { isEqual, template } from 'lodash';
import * as xhr from 'appsCommon/utils/xhr';
import {
  GET_BRAINTREE_TOKEN,
  REGISTER_PRO_PLAN,
  UPDATE_PRO_PLAN,
  SUBSCRIBE_ORDER_PAYMENT_FOR_PRO_PLAN
} from '@resource/lib/constants/apiUrl';
import { relativeUrl } from '@resource/lib/utils/language';
import { getWWWorigin } from '@resource/lib/utils/url';
import qs from 'qs';
import { platformSourceEnum } from '@resource/lib/constants/strings';

export const getBraintreeToken = that => {
  const url = template(GET_BRAINTREE_TOKEN)({ baseUrl: getWWWorigin() });
  xhr
    .get(url)
    .then(result => {
      const { retCode, data } = result;
      if (retCode == 200000) {
        that.setState({
          token: data.token,
          payment_gateway: data.payment_gateway
        });
      }
    })
    .catch(e => {});
};

export const didUdate = (that, prevProps, prevState) => {
  const oldUserInfo = prevState.userInfo;
  const newUserInfo = that.state.userInfo;
  if (!isEqual(oldUserInfo, newUserInfo)) {
    const isPro = newUserInfo.isProPlan && newUserInfo.isSignedIn ? newUserInfo.isProPlan : false;
    if (isPro) {
      // window.location.href = relativeUrl('/my-pro-plan.html')
    }
  }
};

export const payProPlan = async (url, data, callback) => {
  const result = await xhr
    .post(
      url,
      Object.assign({}, data, {
        payment_gateway: 'BRAINTREE',
        plan_type: 'PRO_PLAN',
        save_card: true
      })
    )
    .catch(err => {
      callback && callback(err);
    });

  const { ret_code, ret_msg, data: _data } = result;

  switch (ret_code) {
    case 200000: {
      callback(null, _data);
      break;
    }
    default: {
      callback(ret_msg);
    }
  }
};

export const payProPlanByToken = (that, creditToken, subscription_id, callback) => {
  const { old_proplan } = qs.parse(location.search.substr(1));
  const isOldProPlan = old_proplan == 1;

  // 如果订阅了老的 pro plan
  const postData = {
    card_nonce: creditToken,
    payment_gateway: 'BRAINTREE',
    plan_type: 'PRO_PLAN',
    save_card: true
  };

  let baseUrl = getWWWorigin();
  let reqUrl = REGISTER_PRO_PLAN;

  if (isOldProPlan && subscription_id) {
    reqUrl = UPDATE_PRO_PLAN;
    postData.subscription_id = subscription_id;
  }

  // 如果订阅了saas zd pro plan（新的pro plan）
  if (!isOldProPlan) {
    // 如果订阅了saas zd pro plan
    reqUrl = SUBSCRIBE_ORDER_PAYMENT_FOR_PRO_PLAN;
    baseUrl = that.state.saasBaseUrl;
    postData.product_id = 'SAAS_DESIGNER';
    postData.plan_id = 25;
    postData.platform_source = platformSourceEnum.pc;
  }

  payProPlan(template(reqUrl)({ autoRandomNum: Date.now(), baseUrl: baseUrl }), postData, callback);
};
