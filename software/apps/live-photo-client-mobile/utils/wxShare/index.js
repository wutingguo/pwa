import wxCircumstances from './wx';
import qwxCircumstances from './qwx';
// 微信分享
export const wxShare = (baseUrl, share, broadcastAlbum, broadcastActivity, maxRequestCount = 3) => {
  const wxNavigator = window.navigator.userAgent.toLowerCase();
  const locationUrl = window.location.href;
  const url = encodeURIComponent(locationUrl);
  const options = {
    locationUrl,
    share,
    broadcastAlbum,
    broadcastActivity,
    maxRequestCount
  };

  // 如果不在微信浏览器内，return
  if (wxNavigator.indexOf('micromessenger') > 0) {
    wxCircumstances(baseUrl, url, options);
  } else {
    qwxCircumstances(baseUrl, url, options);
  }
};
