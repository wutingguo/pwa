import { saasProducts } from '@resource/lib/constants/strings';
import { wrapPromise, sleep } from '@resource/lib/utils/promise';
import { getMySubscribFree, getMySubscribTry } from '@resource/pwa/services/subscription';
import { get } from 'lodash';

/**
 * 发起action, 初始化基本信息
 * - 更新querystring到store
 * - 获取环境变量. 获取urls值.
 */
const getEnv = boundGlobalActions => {
  // qs parser.
  boundGlobalActions.parser();

  return boundGlobalActions.getEnv();
};

/**
 * 获取订阅信息.
 * @param {*} props
 */
const getMySubscription = (galleryBaseUrl, boundGlobalActions) => {
  return boundGlobalActions.getMySubscription(galleryBaseUrl);
};

/**
 * 获取工作室信息.
 * @param {*} props
 */
const getStudioInfo = (galleryBaseUrl, boundGlobalActions) => {
  return boundGlobalActions.getStudioInfo(galleryBaseUrl);
};

/**
 * 免费订阅接口.
 */
const getMySubscribFrees = galleryBaseUrl => {
  const arr = [getMySubscribTry(galleryBaseUrl), getMySubscribFree(galleryBaseUrl)];

  return Promise.all(arr);
};

/**
 * 获取用户信息.
 */
const getUserInfo = (baseUrl, boundGlobalActions) => {
  return boundGlobalActions.getUserInfo(baseUrl);
};

export default function prepare(that) {
  const { boundGlobalActions } = that.props;

  boundGlobalActions.parser();
}
