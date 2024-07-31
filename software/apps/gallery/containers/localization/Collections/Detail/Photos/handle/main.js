import { merge, template } from 'lodash';
import { isImmutable, fromJS, is } from 'immutable';
import { getImageUrl } from '@resource/lib/saas/image';
import { thumbnailSizeTypes } from '@resource/lib/constants/strings';
import { SAAS_DOWNLOAD_IMAGE } from '@resource/lib/constants/apiUrl';
import { downImage } from '@resource/lib/utils/image';
import handler from '@apps/gallery/components/CollectionDetailHeader/handler';

/**
 * 更新store上的数据.
 * @param {*} that
 * @param {String} key
 * @param {Any} result
 */
const updateState = (that, key, result) => {
  const oldValue = that.state[key];

  if (!oldValue) {
    return that.setState({ [key]: result });
  }

  if (isImmutable(oldValue) && result) {
    return that.setState({ [key]: result.merge(oldValue) });
  }

  return that.setState({ [key]: merge({}, result, oldValue) });
};

/**
 * componentWillReceiveProps
 * @param {*} that
 * @param {*} nextProps
 */
const willReceiveProps = (that, nextProps) => {
  const { collectionDetail } = nextProps;
  const { detail } = that.state;

  // 更新collection detail对象.
  if (!is(detail, collectionDetail)) {
    updateState(that, 'detail', collectionDetail);
  }
};

// 处理图片列表数据
function formatImages(urls, selectedImgList = []) {
  return selectedImgList.map(img => {
    if (img) {
      const image_uid = img.get('enc_image_uid');
      const timestamp = img.get('imgTimestamp') || img.get('image_version');

      const name = img.get('image_name');
      const src = getImageUrl({
        galleryBaseUrl: urls.get('galleryBaseUrl'),
        image_uid,
        thumbnail_size: thumbnailSizeTypes.SIZE_1000,
        isWaterMark: true,
        timestamp
      });
      return img.merge({ src, name });
    }
  });
}

const downViewImage = (selectedImg, tab, urls) => {
  const set_uid = selectedImg.get('set_uid');
  const correctstatus = selectedImg.get('correct_status');
  const image_uid =
    tab && !!correctstatus
      ? selectedImg.get('enc_corrected_image_uid')
      : selectedImg.get('enc_image_uid');
  const image_name = selectedImg.get('image_name');
  const suffix = selectedImg.get('suffix');
  const url = template(SAAS_DOWNLOAD_IMAGE)({
    set_uid,
    image_uid,
    galleryBaseUrl: urls.get('galleryBaseUrl')
  });
  const imgName = image_name + suffix;
  downImage(url, imgName);
};

const toAiClick = (that, selectedImgList, ...opt) => {
  handler.creatAiSingle(that, selectedImgList, ...opt);
};

export default {
  willReceiveProps,
  updateState,
  formatImages,
  downViewImage,
  toAiClick
};
