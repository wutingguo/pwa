import { fromJS, isImmutable } from 'immutable';

import { getImageUrl } from '@resource/lib/saas/image';

import { saasProducts, thumbnailSizeTypes } from '@resource/lib/constants/strings';

const getImageSrc = (that, obj) => {
  const { urls } = that.props;
  return getImageUrl({
    galleryBaseUrl: urls.get('galleryBaseUrl'),
    thumbnail_size: thumbnailSizeTypes.SIZE_200,
    isWaterMark: false,
    ...obj,
  });
};

const getWatermarkList = async that => {
  const { boundProjectActions } = that.props;
  const { getWatermarkList, updateWatermarkList } = boundProjectActions;

  const res = await getWatermarkList();
  let list = res.data;
  for (let item of list) {
    if (item.enc_image_uid) {
      item.markSrc = await getImageSrc(that, {
        image_uid: item.enc_image_uid,
      });
      item.scale = Math.round(item.scale * 100);
      item.opacity = Math.round(item.opacity * 100);
    }
  }
  updateWatermarkList(list);
  return list;
};

export default {
  getWatermarkList,
};
