import { template } from 'lodash';
import { SET_IMAGE_URL } from '@apps/gallery-client/constants/imageUrl';
import { fromJS } from 'immutable';
/**
 * 获取图片地址
 * @param {string} imageUid 图片 image_uid
 */
export function getImageUrl(imageUid) {
  if (imageUid) {
    return template(SET_IMAGE_URL)({ imageUid });
  }
}

const getCacheKey = key => {
  return `__GALLERY_CLIENT_${key}__`;
};

export const getEmailCacheKey = id => {
  return getCacheKey(`${id}_EMAIL`);
};

export const getPhoneCacheKey = id => {
  return getCacheKey(`${id}_PHONE`);
};

export const getGuestUidCacheKey = id => {
  return getCacheKey(`${id}_GUEST_UID`);
};

export const getPinCacheKey = id => {
  return getCacheKey(`${id}_PIN`);
};

export const getResolutionIdCacheKey = id => {
  return getCacheKey(`${id}_RESOLUTION_ID`);
};

// 判断gallery是否不支持下载
export const getIsUnsupportDownload = (downloadSetting, setUid, isFavorited) => {
  // 默认不支持
  if (!downloadSetting) return true;

  const [
    common_download_status,
    common_gallery_download_status,
    common_single_photo_download_status,
    sets_setting
  ] = [
    downloadSetting.get('common_download_status'),
    downloadSetting.get('common_gallery_download_status'),
    downloadSetting.get('common_single_photo_download_status'),
    downloadSetting.get('sets_setting')
  ];
  let isAllSetsUnsupportDownload =
    !common_download_status ||
    sets_setting.every(item =>
      __isCN__
        ? item.get('selected_download_status') === 1
          ? false
          : !item.get('download_status') || !item.get('image_num')
        : !item.get('download_status') || !item.get('image_num')
    );
  if (isAllSetsUnsupportDownload) return true;
  if (setUid) {
    if (__isCN__) {
      const findSetting = sets_setting.find(item => item.get('set_uid') === setUid);
      const downloadStatus =
        findSetting.get('selected_download_status') === 1 || findSetting.get('download_status');
      const selectDownloadStatus = findSetting.get('selected_download_status') === 1;
      const setUnsupportDownload = (selectDownloadStatus && !isFavorited) || !downloadStatus;
      return setUnsupportDownload || !common_single_photo_download_status;
    }
    const setUnsupportDownload = !sets_setting
      .find(item => item.get('set_uid') === setUid)
      .get('download_status');
    return setUnsupportDownload || !common_single_photo_download_status;
  }

  return !common_gallery_download_status;
};
