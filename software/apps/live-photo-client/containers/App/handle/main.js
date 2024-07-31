import { is } from 'immutable';

const didMount = async that => {
  const { urls, boundProjectActions } = that.props;
  boundProjectActions.getUserInfo();
  if (urls && urls.size) {
    const res = await boundProjectActions.getActivityDetail();
  }
};

const willReceiveProps = (that, nextProps) => {
  const { urls: oldUrls } = that.props;
  const { urls: newUrls } = nextProps;

  // getEnv请求成功后.
  if (!is(oldUrls, newUrls) && newUrls && newUrls.size) {
    const { boundProjectActions } = that.props;
    boundProjectActions.getActivityDetail();
  }
};

export default {
  didMount,
  willReceiveProps,
};
