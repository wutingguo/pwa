import wx from 'weixin-js-sdk';
import service from '@apps/workspace/services';
import { getImageUrl } from '@apps/live-photo-client-mobile/utils/helper';
import { formatDate } from '@resource/lib/utils/dateFormat';

/**
 *
 * @param {string} baseUrl
 * @param {string} url
 * @param {object} options
 */
async function wxCircumstances(baseUrl, url, options) {
  let { broadcastAlbum, broadcastActivity, share, locationUrl, maxRequestCount } = options;
  try {
    const res = await service.getJSSdkParam({ baseUrl, url }); // 后端定义的接口
    const { data = {} } = res;
    const { app_id, nonce_str, signature, timestamp } = data;
    const obj = {
      debug: false, // 是否开启调试模式
      appId: app_id, // appid
      timestamp, // 时间戳
      nonceStr: nonce_str, // 随机字符串
      signature, // 签名
      jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData']
    };
    const defaultCover = 'AY0%2FK6sEUbuyLA32hiDOmA%3D%3D';
    const albumName = broadcastAlbum.get('album_name');
    const date = formatDate(broadcastActivity.get('begin_time'), '.');
    const city = broadcastActivity.get('city');
    const firstIndex = city.indexOf('-');
    const newCity = city.slice(firstIndex + 1);
    const activityName = broadcastActivity.get('activity_name');
    const coverId = share.get('share_cover') ? share.get('share_cover') : defaultCover;

    // 设置分享内容
    const title = share.get('share_title') ? share.get('share_title') : albumName;
    const desc = share.get('share_desc')
      ? share.get('share_desc')
      : `${date},${activityName ? activityName + ',' : ''}现场照片直播@${newCity}`;
    const imgUrl = getImageUrl(baseUrl, coverId);
    const link = locationUrl;
    wx.config(obj);
    wx.ready(function() {
      wx.updateAppMessageShareData({
        title, // 分享标题
        desc, // 分享描述
        link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl, // 分享图标
        success: () => {
          console.log('');
        }
      });
      wx.updateTimelineShareData({
        title, // 分享标题
        link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl, // 分享图标
        success: () => {
          console.log('');
        }
      });
    });
    wx.error(res => {
      console.log('wx.error res:', res);
    });
  } catch (e) {
    console.log('getTicket err:', e);
    setTimeout(() => {
      maxRequestCount > 0 &&
        wxCircumstances(baseUrl, share, {
          broadcastAlbum,
          broadcastActivity,
          locationUrl,
          maxRequestCount: --maxRequestCount
        });
    }, 1000);
  }
}

export default wxCircumstances;
