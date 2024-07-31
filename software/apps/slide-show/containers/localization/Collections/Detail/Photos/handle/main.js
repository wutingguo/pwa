import { merge, get } from 'lodash';
import { isImmutable, fromJS, is } from 'immutable';
import {getImageUrl} from '@resource/lib/saas/image';
import { thumbnailSizeTypes } from '@resource/lib/constants/strings';

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
  if(!is(detail, collectionDetail)){
    updateState(that, 'detail', collectionDetail);
  }
};

// 处理图片列表数据
function formatImages(urls, selectedImgList) {
  return selectedImgList.map(img => {
    if(img) {
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
      return img.merge({src, name});
    }
  })
}

export default {
  willReceiveProps,
  updateState,
  formatImages
};
