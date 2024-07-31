import {
  getMySubscribFree,
  getMySubscribTry,
  setFreeSubscribeProduct,
} from '@resource/pwa/services/subscription';

/**
 * 组件挂载之前.
 */
const willMount = async that => {
  const { urls } = that.props;

  const { galleryBaseUrl } = urls.toJSON();
  // await getMySubscribFree(galleryBaseUrl)
};

export default {
  willMount,
};
