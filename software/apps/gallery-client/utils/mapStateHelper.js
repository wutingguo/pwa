import { fromJS } from 'immutable';
import { template } from 'lodash';

import { getImageUrl } from '@resource/lib/saas/image';
import { transformCoverData } from '@resource/lib/saas/mapStateHelper';

import { getDegree } from '@resource/lib/utils/exif';

import { thumbnailSizeTypes } from '@resource/lib/constants/strings';

import { DEFAULT_COVER_URL_SHARE } from '@apps/gallery-client/constants/imageUrl';

const applyImg = (state, item) =>
  item.get('apply_original_img') === state && item.get('enc_corrected_image_uid') && __isCN__;

/**
 * 转换成set images瀑布流组件可以直接使用的数据.
 * @param {*} set
 * @param {*} designSetting
 */
const transformSetImages = (set, designSetting, urls) => {
  const images = set.get('images');
  if (!images || !urls) {
    return fromJS([]);
  }

  const galleryBaseUrl = urls.get('galleryBaseUrl');

  return images.map(m => {
    const timestamp = m.get('imgTimestamp') || m.get('image_version');
    const isApplyOriginalImg = applyImg(1, m);
    const image_uid = isApplyOriginalImg
      ? m.get('enc_image_uid')
      : m.get('enc_corrected_image_uid') || m.get('enc_image_uid');
    return m.merge(
      fromJS({
        imgRot: getDegree(m.get('orientation')),

        // 缩略图的url
        src: getImageUrl({
          galleryBaseUrl,
          image_uid,
          timestamp,
          thumbnail_size: __isCN__ ? thumbnailSizeTypes.SIZE_350 : thumbnailSizeTypes.SIZE_1000,
        }),

        // 预览时的url
        previewSrc: getImageUrl({
          galleryBaseUrl,
          image_uid,
          timestamp,
          thumbnail_size: thumbnailSizeTypes.SIZE_1500,
        }),

        // todo
        isFavorite: false,
      })
    );
  });
};

/**
 * 组装design模板渲染所需数据
 * @param {*} data
 * @param {*} urls
 */
const transformDetailData = (data, urls) => {
  const detail = fromJS(data).get('detail');
  if (!detail || !urls) {
    // eslint-disable-next-line no-undef
    return emptyArr;
  }
  const saasBaseUrl = urls.get('saasBaseUrl');
  const convertDetail = detail.setIn(
    ['cover', 'defaultCoverLarge'],
    template(DEFAULT_COVER_URL_SHARE)({ saasBaseUrl })
  );
  return convertDetail;
};

export { transformCoverData, transformSetImages, transformDetailData, applyImg };
