import { is } from 'immutable';
import * as cache from '@resource/lib/utils/cache';
import {
  getEmailCacheKey,
  getPhoneCacheKey,
  getGuestUidCacheKey
} from '@apps/commodity-client/utils/helper';

const restoreGuestInfo = that => {
  const { boundProjectActions, qs } = that.props;
  const enc_sw_id = qs.get('enc_sw_id');

  if (enc_sw_id) {
    const cachePhoneKey = getPhoneCacheKey(enc_sw_id);
    const cacheGuestUidKey = getGuestUidCacheKey(enc_sw_id);

    const phone = cache.get(cachePhoneKey);
    const guest_uid = cache.get(cacheGuestUidKey);

    if (phone && guest_uid) {
      boundProjectActions.getCommodityUserInfo().catch(err => {
        console.log(err);
      });
    }
  }
};



const didMount = that => {
  const { urls, boundProjectActions } = that.props;
  if (urls && urls.size) {
    restoreGuestInfo(that);
    boundProjectActions.getCommodityInfo();

  }
};

const willReceiveProps = (that, nextProps) => {
  const { urls: oldUrls } = that.props;
  const { urls: newUrls } = nextProps;
  if (!is(oldUrls, newUrls) && newUrls && newUrls.size) {
    const { boundProjectActions } = that.props;
    restoreGuestInfo(that);
    boundProjectActions.getCommodityInfo();

  }
};

export default {
  didMount,
  willReceiveProps
};
