const didMount = that => {
  const { urls, boundProjectActions, boundGlobalActions } = that.props;
  if (urls && urls.size) {
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
