import { is } from 'immutable';

import * as cache from '@resource/lib/utils/cache';
import { guid } from '@resource/lib/utils/math';

import { getUserUniqueIdCacheKey } from '@apps/live-photo-client-mobile/utils/helper';

const didMount = that => {
  const { urls, boundProjectActions } = that.props;
  boundProjectActions.getUserInfo();
  if (urls && urls.size) {
    boundProjectActions.getLoadingInfoAction();
    boundProjectActions.getActivityDetail();
  }
};

const willReceiveProps = (that, nextProps) => {
  const { urls: oldUrls } = that.props;
  const { urls: newUrls } = nextProps;

  // getEnv请求成功后.
  if (!is(oldUrls, newUrls) && newUrls && newUrls.size) {
    const { boundProjectActions } = that.props;
    boundProjectActions.getActivityDetail();
    boundProjectActions.getLoadingInfoAction();
  }
};

export default {
  didMount,
  willReceiveProps,
};
