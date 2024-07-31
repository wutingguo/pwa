import { fromJS } from 'immutable';
import { template } from 'lodash';
import { getDegree } from '@resource/lib/utils/exif';
import { transformCoverData } from '@resource/lib/saas/mapStateHelper';
import { getCoverImageUrl } from '@resource/lib/saas/image';
import { thumbnailSizeTypes } from '@resource/lib/constants/strings';
import { DEFAULT_COVER_URL_SMALL, DEFAULT_COVER_URL_XS } from '@apps/aiphoto/constants/imageUrl';

const emptyArr = fromJS([]);
const emptyMap = fromJS({});

/**
 * 列表数据加默认图片
 * @param {*} data
 * @param {*} urls
 */
const getConvertCollectionsList = (data = {}, urls) => {
  const { list } = data;
  if (!list || !list.size || !urls || !urls.size) {
    return emptyArr;
  }
  const saasBaseUrl = urls.get('saasBaseUrl');
  const galleryBaseUrl = urls.get('galleryBaseUrl');
  const defaultCoverUrlSmall = template(DEFAULT_COVER_URL_SMALL)({
    saasBaseUrl
  });

  const convertList = fromJS(list).map(item => {
    const isShowDefaultCover = !item.getIn(['cover', 'image_uid']);
    const coverUrlSmall = getCoverImageUrl({
      galleryBaseUrl,
      collection_uid: item.get('enc_collection_uid'),
      cover_version: item.getIn(['cover', 'cover_version']),
      thumbnail_size: thumbnailSizeTypes.SIZE_350
    });
    return item.mergeIn(['cover'], {
      isShowDefaultCover,
      defaultCoverUrlSmall,
      coverUrlSmall,
      imgRot: getDegree(item.getIn(['cover', 'orientation']))
    });
  });

  return convertList;
};

const getConvertEffectsList = (data = fromJS([]), urls) => {
  const convertList = fromJS(data).map(item => {
    return item;
  });

  return convertList;
};

/**
 * 转换collection的detail数据, 使他可以在组件中直接使用.
 * @param {*} data
 */
const getCollectionDetail = (data = {}, urls) => {
  const { detail } = data;
  if (!detail || !urls) {
    return emptyArr;
  }

  let imgList = detail.get('images') || emptyArr;
  const photos = detail.get('photos') || emptyMap;
  const is_original =
    typeof detail.get('is_original') == 'undefined' ? 1 : detail.get('is_original');
  const hideRetoucher = detail.get('hide_retoucher') || false
  let count = 0;
  let allImgCount = 0;
  let selectedImgList = fromJS([]);
  let selectedImgUidList = fromJS([]);

  if (is_original && hideRetoucher) {
    // 状态： 0待处理、1处理中、2处理完成、-1失败
    imgList = imgList.filter(img => img.get('correct_status') <= 0)
  }

  if (imgList && imgList.size) {
    // 计算图片的旋转角度.
    imgList = imgList.map(m => {
      return m.merge({
        imgRot: getDegree(m.get('orientation')),
        encImgId: m.get('enc_image_id')
      });
    });

    allImgCount = imgList.size;
    selectedImgList = imgList.filter(img => !!img.get('selected'));
    selectedImgUidList = selectedImgList.map(img => img.get('enc_image_id'));
    count = selectedImgList.size;
  }

  const newDetail = detail.merge({
    photos: photos.merge({
      allImgCount,
      selectedImgList,
      selectedImgUidList,
      selectedImgCount: count
    }),
    images: imgList,
    is_original,
    hideRetoucher
  });

  return newDetail;
};

const getDefaultImgs = (urls = fromJS({})) => {
  const saasBaseUrl = urls.get('saasBaseUrl');
  return fromJS({
    defaultCoverSmall: template(DEFAULT_COVER_URL_SMALL)({ saasBaseUrl }),
    defaultCoverXs: template(DEFAULT_COVER_URL_XS)({ saasBaseUrl })
  });
};

export {
  getConvertCollectionsList,
  getCollectionDetail,
  transformCoverData,
  getDefaultImgs,
  getConvertEffectsList
};
