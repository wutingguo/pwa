import { fromJS } from 'immutable';
import { template } from 'lodash';
import { thumbnailSizeTypes } from '@resource/lib/constants/strings';
import { getImageUrl, getSlideShowImageUrl } from '@resource/lib/saas/image';
import { getDegree } from '@resource/lib/utils/exif';

import { transformCoverData } from '@resource/lib/saas/mapStateHelper';

import { DEFAULT_COVER_URL_SHARE } from '@apps/slide-show-client-mobile/constants/imageUrl';

const emptyArr = fromJS([]);
const emptyMap = fromJS({});

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
    const image_uid = m.get('enc_image_uid');
    const timestamp = m.get('imgTimestamp') || m.get('image_version');

    return m.merge(
      fromJS({
        imgRot: getDegree(m.get('orientation')),

        // 缩略图的url
        src: getImageUrl({
          galleryBaseUrl,
          image_uid,
          timestamp,
          thumbnail_size: thumbnailSizeTypes.SIZE_350
        }),

        // 预览时的url
        previewSrc: getImageUrl({
          galleryBaseUrl,
          image_uid,
          timestamp,
          thumbnail_size: thumbnailSizeTypes.SIZE_1500
        }),

        // todo
        isFavorite: false
      })
    );
  });
};

/**
 * 转换collection的detail数据, 使他可以在组件中直接使用.
 * @param {*} data
 */
const getCollectionDetail = (data, urls) => {
  const { detail } = data;
  if (!detail || !urls) {
    return emptyMap;
  }

  const segments = detail.get('segments');
  let selectedSegment = emptyArr;
  if (segments && segments.size) {
    selectedSegment = segments.find(item => item.get('selected')) || segments.get('0');
  }
  let frameList = selectedSegment.get('frames') || emptyArr;
  let cover_img = detail.get('cover_img') || emptyMap;
  const photos = fromJS({});
  let count = 0;
  let allImgCount = 0;
  let selectedframeList = fromJS([]);
  let selectedImgUidList = fromJS([]);

  if (frameList && frameList.size) {
    // 计算图片的旋转角度.
    frameList = frameList.map(m => {
      const image = m.get('image');
      if (image) {
        return m.merge({
          image: image.merge({ imgRot: getDegree(m.getIn(['image', 'orientation'])) })
        });
      }

      return m;
    });

    allImgCount = frameList.size;
    selectedframeList = frameList.filter(frame => !!frame.get('selected'));
    selectedImgUidList = selectedframeList.map(frame => frame.getIn(['image', 'enc_image_uid']));
    count = selectedframeList.size;
  }

  if (cover_img) {
    let socailShareImageUrl = '';
    let imgUrl = '';
    let imgUrlMid = '';
    let imgRot = 0;

    const coverEncId = cover_img.get('enc_image_uid');
    if (coverEncId || frameList.size) {
      const useImg = coverEncId ? cover_img : frameList.getIn([0, 'image']);
      const enc_image_uid = useImg.get('enc_image_uid');
      const galleryBaseUrl = urls.get('galleryBaseUrl');
      const timestamp = useImg.get('imgTimestamp') || useImg.get('image_version');
      imgUrl = getSlideShowImageUrl({
        galleryBaseUrl,
        enc_image_uid,
        thumbnail_size: thumbnailSizeTypes.SIZE_350,
        isWaterMark: true,
        timestamp
      });
      imgUrlMid = getSlideShowImageUrl({
        galleryBaseUrl,
        enc_image_uid,
        thumbnail_size: thumbnailSizeTypes.SIZE_700,
        isWaterMark: true,
        timestamp
      });
      socailShareImageUrl = getSlideShowImageUrl({
        galleryBaseUrl,
        enc_image_uid,
        timestamp,
        thumbnail_size: null
      });

      imgRot = getDegree(useImg.get('orientation'));
    }
    cover_img = cover_img.merge({ imgUrl, imgRot, imgUrlMid, socailShareImageUrl });
  }

  const newDetail = detail.merge({
    photos: photos.merge({
      allImgCount,
      selectedframeList,
      selectedImgUidList,
      selectedImgCount: count
    }),
    cover: cover_img,
    frameList
  });
  return newDetail;
};

const getPostCardList = data => {
  return data.get('list');
};

const getUsedPostCardDetail = (data, urls) => {
  return data.get('usedDetail');
};
const transformDetailData = (data, urls) => {
  const detail = fromJS(data).get('detail');
  if (!detail || !urls) {
    return emptyArr;
  }
  const saasBaseUrl = urls.get('saasBaseUrl');
  const enc_image_uid = detail.getIn(['cover', 'enc_image_uid']);
  const setting = detail.get('setting');
  let convertDetail = detail.setIn(
    ['cover', 'defaultCoverLarge'],
    template(DEFAULT_COVER_URL_SHARE)({ saasBaseUrl })
  );
  if (enc_image_uid) {
    convertDetail = convertDetail.setIn(
      ['cover', 'cover_img'],
      `${saasBaseUrl}cloudapi/slideshow/image/view?enc_image_uid=${enc_image_uid}&thumbnail_size=4`
    );
  }
  // console.log('convertDetail: ', convertDetail.toJS());
  return convertDetail;
};

export {
  transformCoverData,
  transformSetImages,
  transformDetailData,
  getCollectionDetail,
  getPostCardList,
  getUsedPostCardDetail
};
