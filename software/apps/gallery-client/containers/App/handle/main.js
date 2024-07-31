import { is } from 'immutable';
import { isEqual } from 'lodash';

import * as cache from '@resource/lib/utils/cache';

import {
  getEmailCacheKey,
  getGuestUidCacheKey,
  getPhoneCacheKey,
} from '@apps/gallery-client/utils/helper';

const restoreGuestInfo = props => {
  const { boundProjectActions, qs } = props;
  const collection_uid = qs.get('collection_uid');

  if (collection_uid) {
    const cacheEmailKey = getEmailCacheKey(collection_uid);
    const cachePhoneKey = getPhoneCacheKey(collection_uid);
    const cacheGuestUidKey = getGuestUidCacheKey(collection_uid);

    const email = cache.get(cacheEmailKey);
    const phone = cache.get(cachePhoneKey);
    const guest_uid = cache.get(cacheGuestUidKey);

    if (email || (phone && guest_uid)) {
      boundProjectActions.updateGuestInfo({ email, phone, guest_uid });
    }
  }
};

// 旧
const restorePrintStoreInfo = props => {
  const { boundProjectActions, qs } = props;
  const collection_uid = qs.get('collection_uid');
  if (collection_uid) {
    const cacheEmailKey = getEmailCacheKey(collection_uid);
    const email = cache.get(cacheEmailKey);
    boundProjectActions.initStoreId().catch(e => {
      // console.log(e);
    });
    // boundProjectActions.getStoreUserInfo().catch(e => {
    //   console.error(e);
    //   //  TODO: 登录失败的逻辑待处理 暂时把email删除
    //   email && cache.removeItem(cacheEmailKey);
    //   // 转到home
    //   const { href, hash } = window.location;
    //   const homeHash = `#/home`;
    //   // 不需要重定向到home的路径
    //   const noNeedRedirectToHome = [
    //     new RegExp(`^${homeHash}$`),
    //     new RegExp(`^#/expiry$`),
    //     new RegExp(`^#/payment/.*`)
    //   ].some(r => r.test(hash));
    //   if (!noNeedRedirectToHome) {
    //     const newUrl = href.replace(hash, homeHash);
    //     window.location.href = newUrl;
    //     window.location.reload();
    //   }
    // });
  }
};

const didMount = that => {
  const { urls, boundProjectActions, qs } = that.props;
  if (urls && urls.size && qs.get('collection_uid')) {
    restoreGuestInfo(that.props);
    boundProjectActions.getCollectionDetail();
    boundProjectActions.getFavoriteImageList();
    // printStore info
    restorePrintStoreInfo(that.props);
  }
};

const willReceiveProps = (that, nextProps) => {
  const { urls: oldUrls, qs } = that.props;
  const { urls: newUrls, qs: newQs } = nextProps;

  // FIXME:这里 有时条件无法成立
  // getEnv请求成功后.
  if (
    (!is(oldUrls, newUrls) && newUrls && newUrls.size && newQs.get('collection_uid')) ||
    (newQs.get('collection_uid') && !isEqual(qs, newQs))
  ) {
    const { boundProjectActions } = nextProps;
    restoreGuestInfo(nextProps);
    boundProjectActions.getCollectionDetail();
    boundProjectActions.getFavoriteImageList();
    // printStore info
    restorePrintStoreInfo(nextProps);
  }
};

export default {
  didMount,
  willReceiveProps,
};
