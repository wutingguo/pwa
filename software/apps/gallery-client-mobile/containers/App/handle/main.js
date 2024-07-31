import { is } from 'immutable';
import { isEqual } from 'lodash';

import * as cache from '@resource/lib/utils/cache';

import {
  getEmailCacheKey,
  getGuestUidCacheKey,
  getPhoneCacheKey,
} from '@apps/gallery-client-mobile/utils/helper';

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

const restorePrintStoreInfo = props => {
  const { boundProjectActions, qs } = props;
  const collection_uid = qs.get('collection_uid');
  if (collection_uid) {
    const cacheEmailKey = getEmailCacheKey(collection_uid);
    const email = cache.get(cacheEmailKey);
    boundProjectActions.initStoreId().catch(e => {
      // console.log(e);
    });
  }
};

const didMount = that => {
  const { urls, boundProjectActions, qs } = that.props;

  if (urls && urls.size && qs.get('collection_uid')) {
    restoreGuestInfo(that.props);
    boundProjectActions.getCollectionDetail();
    boundProjectActions.getFavoriteImageList();
    restorePrintStoreInfo(that.props);
  }
};

const willReceiveProps = (that, nextProps) => {
  const { urls: oldUrls, qs } = that.props;
  const { urls: newUrls, qs: newQs } = nextProps;

  // getEnv请求成功后.
  if (
    (!is(oldUrls, newUrls) && newUrls && newUrls.size && newQs.get('collection_uid')) ||
    (newQs.get('collection_uid') && !isEqual(qs, newQs))
  ) {
    const { boundProjectActions } = that.props;
    restoreGuestInfo(nextProps);
    boundProjectActions.getCollectionDetail();
    boundProjectActions.getFavoriteImageList();
    restorePrintStoreInfo(nextProps);
  }
};

export default {
  didMount,
  willReceiveProps,
};
