import { merge, template } from 'lodash';
import { isImmutable, fromJS, is } from 'immutable';
import { getImageUrl } from '@resource/lib/saas/image';
import { thumbnailSizeTypes } from '@resource/lib/constants/strings';
import { SAAS_SET_IMAGE_ORIENTATION_URL } from '@resource/lib/constants/apiUrl';
import { SAAS_DOWNLOAD_IMAGE } from '@resource/lib/constants/apiUrl';
import { downImage } from '@resource/lib/utils/image';
import { ensurePFCReady, getWASMPath } from '@resource/lib/perfectlyClear/utils/help';
import { PERFECTLY_CLEAR_MODAL, DOWN_WASM_MODAL } from '@resource/lib/constants/modalTypes';
import * as notificationTypes from '@resource/lib/constants/notificationTypes';
import { saasProducts } from '@resource/lib/constants/strings';

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
function formatImages(urls, selectedImgList) {
  return selectedImgList.map(img => {
    if (img) {
      const image_uid = img.get('enc_image_id');

      const name = img.get('image_name');
      const src = getImageUrl({
        galleryBaseUrl: urls.get('galleryBaseUrl'),
        image_uid,
        thumbnail_size: thumbnailSizeTypes.SIZE_1000,
        isWaterMark: true
      });
      return img.merge({ src, name });
    }
  });
}

const downViewImage = (selectedImg, tab, urls) => {
  const image_uid =
    tab && selectedImg.get('correct_enc_image_id')
      ? selectedImg.get('correct_enc_image_id')
      : selectedImg.get('original_enc_image_id');
  const image_name = selectedImg.get('image_name');
  const suffix = selectedImg.get('suffix');
  const url = template(SAAS_SET_IMAGE_ORIENTATION_URL)({
    image_uid,
    galleryBaseUrl: urls.get('galleryBaseUrl'),
    thumbnail_size: 1
  });
  const imgName = image_name + suffix;
  downImage(url, imgName);
};

const toAiClick = async (that, pfcOtherParams = {}, openCallback) => {
  const { boundGlobalActions, collectionDetail } = that.props;
  const collectionId = collectionDetail.get('collection_id');
  const collectionStatus = collectionDetail.get('collection_status');

  const pfcParams = {
    imageArray: collectionDetail.get('images'),
    collectionId,
    collectionStatus,
    pfcFromModule: saasProducts.aiphoto,
    ...pfcOtherParams
  };

  try {
    const wasmJsFile = await getWASMPath();

    boundGlobalActions.showModal(DOWN_WASM_MODAL, {
      wasmJsFile,
      success: () => {
        boundGlobalActions.showModal(PERFECTLY_CLEAR_MODAL, pfcParams);
        openCallback && openCallback();
      },
      lose: () => {
        boundGlobalActions.addNotification({
          message: t('PERFECTLY_CLEAR_LOAD_FAILED'),
          level: 'success',
          uid: notificationTypes.PERFECTLY_CLEAR_LOAD_FAILED,
          autoDismiss: 2
        });
      }
    });
  } catch (e) {
    console.log('showModal-DOWN_WASM_MODAL', e);
    // loadWasm 方法在index.html中挂载到window上
    boundGlobalActions.showGlobalLoading();
    loadWasm()
      .then(async () => {
        await ensurePFCReady();
        boundGlobalActions.hideGlobalLoading();
        boundGlobalActions.showModal(PERFECTLY_CLEAR_MODAL, pfcParams);
        openCallback && openCallback();
      })
      .catch(() => {
        boundGlobalActions.hideGlobalLoading();
        boundGlobalActions.addNotification({
          message: t('PERFECTLY_CLEAR_LOAD_FAILED'),
          level: 'success',
          uid: notificationTypes.PERFECTLY_CLEAR_LOAD_FAILED,
          autoDismiss: 2
        });
      });
  }
};

export default {
  willReceiveProps,
  updateState,
  formatImages,
  downViewImage,
  toAiClick
};
