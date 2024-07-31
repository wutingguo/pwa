import { is } from 'immutable';

import * as cache from '@resource/lib/utils/cache';

// import {
//   getEmailCacheKey,
//   getPhoneCacheKey,
//   getGuestUidCacheKey
// } from '@apps/gallery-client-mobile/utils/helper';

// const restoreGuestInfo = that => {
//   const { boundProjectActions, qs } = that.props;
//   const collection_uid = qs.get('collection_uid');

//   if (collection_uid) {
//     const cacheEmailKey = getEmailCacheKey(collection_uid);
//     const cachePhoneKey = getPhoneCacheKey(collection_uid);
//     const cacheGuestUidKey = getGuestUidCacheKey(collection_uid);

//     const email = cache.get(cacheEmailKey);
//     const phone = cache.get(cachePhoneKey);
//     const guest_uid = cache.get(cacheGuestUidKey);

//     if (email || phone && guest_uid) {
//       boundProjectActions.updateGuestInfo({ email, phone, guest_uid });
//     }
//   }
// };

const didMount = that => {
  const { urls, boundProjectActions, boundGlobalActions } = that.props;
  if (urls && urls.size) {
    // boundGlobalActions.getUserInfo(urls.get('baseUrl'));
    // boundGlobalActions.getUserInfo();
  }
};

const willReceiveProps = (that, nextProps) => {
  // const { urls: oldUrls } = that.props;
  // const { urls: newUrls } = nextProps;
  // // getEnv请求成功后.
  // if (!is(oldUrls, newUrls) && newUrls && newUrls.size) {
  //   const { boundProjectActions } = that.props;
  //   boundProjectActions.getCollectionDetail();
  //   boundProjectActions.getFavoriteImageList();
  // }
};

export default {
  didMount,
  willReceiveProps,
};
