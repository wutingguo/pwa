import { fromJS } from 'immutable';
import { template } from 'lodash';

import { getCoverImageUrl, getSlideShowImageUrl } from '@resource/lib/saas/image';
import { transformCoverData } from '@resource/lib/saas/mapStateHelper';

import { getDegree } from '@resource/lib/utils/exif';

import { thumbnailSizeTypes } from '@resource/lib/constants/strings';

import {
  COLLECTION_COVER_TEMPLATE_URL,
  COLLECTION_GALLERY_STYLE_URL_M,
  COLLECTION_GALLERY_STYLE_URL_PC,
  DEFAULT_COVER_URL_LARGE,
  DEFAULT_COVER_URL_SMALL,
  DEFAULT_COVER_URL_XS,
} from '@apps/slide-show/constants/imageUrl';
import { SLIDESHOW_MUSIC_URL } from '@apps/slide-show/constants/mediaUrl';

const emptyArr = fromJS([]);
const emptyMap = fromJS({});

// 0-Free 1-Basic 2-standard 3-power
// const planNamesArr = ['Free', 'Basic', 'Standard', 'Power'];
const planLevelArr = [10, 20, 30, 40];
const getLevel = planLevel => {
  return planLevelArr.indexOf(planLevel);
};
// 0-已创建 1-制作中 2-已发布 3-生成中 4-已生成
// const slideshowStatus = [0, 1, 2, 3, 4];
const getSlideshowStatus = (videoStatus, projectStatus) => {
  if (projectStatus <= 2 && videoStatus === 0) {
    return projectStatus;
  }
  if (projectStatus === 1 && videoStatus === 1) {
    return 1;
  }
  if (projectStatus === 2 && videoStatus === 1) {
    return 3;
  }
  if (projectStatus === 2 && videoStatus === 2) {
    return 4;
  }
};

const getCollectionList = (data, level, urls) => {
  const { list } = data;
  if (!list || !list.size || !level || !urls || !urls.size) {
    return emptyArr;
  }

  const galleryBaseUrl = urls.get('galleryBaseUrl');

  let slideshowLevel = '';
  level.get('items').map(item => {
    const productId = item.get('product_id');
    let planLevel = item.get('plan_level');
    // 免费试用等级
    const trailPlanLevel = item.get('trial_plan_level');
    if (trailPlanLevel && trailPlanLevel !== -1) {
      planLevel = trailPlanLevel;
    }
    if (productId === 'SAAS_SLIDE_SHOW') {
      slideshowLevel = getLevel(planLevel);
    }
  });

  const convertList = list.map(item => {
    // coverUrl
    let convertCoverItem = item;
    const itemImage = item.get('cover_img');
    if (!itemImage) {
      convertCoverItem = item;
    } else {
      const encImageUid = itemImage.get('enc_image_uid');
      const coverUrlSmall = getSlideShowImageUrl({
        galleryBaseUrl,
        enc_image_uid: encImageUid,
        thumbnail_size: thumbnailSizeTypes.SIZE_350,
        isWaterMark: true,
      });
      convertCoverItem = item.mergeIn(['cover_img'], {
        coverUrlSmall,
        imgRot: getDegree(item.getIn(['cover_img', 'orientation'])),
      });
    }

    // projectStatus
    const videoStatus = item.get('video_status'); // 未生成 生成中 已生成

    /**
     * project status
     * 0 已创建
     * 1 制作中
     * 2 已发布
     */
    const projectStatus = item.get('project_status'); // 已创建 制作中 已发布
    const slideshowStatus = getSlideshowStatus(videoStatus, projectStatus);
    const convertItem = convertCoverItem.set('slideshowStatus', slideshowStatus);

    return convertItem.set('slideshowLevel', slideshowLevel);
  });
  return convertList;
};

/**
 * 列表数据加默认图片
 * @param {*} data
 * @param {*} urls
 */
const getConvertCollectionsList = (data, urls) => {
  const { list } = data;
  if (!list || !list.size || !urls || !urls.size) {
    return emptyArr;
  }
  const saasBaseUrl = urls.get('saasBaseUrl');
  const galleryBaseUrl = urls.get('galleryBaseUrl');
  const defaultCoverUrlSmall = template(DEFAULT_COVER_URL_SMALL)({
    saasBaseUrl,
  });

  const convertList = fromJS(list).map(item => {
    const isShowDefaultCover = !item.getIn(['cover', 'image_uid']);
    const coverUrlSmall = getCoverImageUrl({
      galleryBaseUrl,
      collection_uid: item.get('enc_collection_uid'),
      cover_version: item.getIn(['cover', 'cover_version']),
      thumbnail_size: thumbnailSizeTypes.SIZE_350,
    });
    return item.mergeIn(['cover'], {
      isShowDefaultCover,
      defaultCoverUrlSmall,
      coverUrlSmall,
      imgRot: getDegree(item.getIn(['cover', 'orientation'])),
    });
  });

  return convertList;
};

/**
 * 转换collection的detail数据, 使他可以在组件中直接使用.
 * @param {*} data
 */
const getCollectionDetail = (data, urls, studioInfo) => {
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
          image: image.merge({ imgRot: getDegree(m.getIn(['image', 'orientation'])) }),
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
        timestamp,
      });
      imgUrlMid = getSlideShowImageUrl({
        galleryBaseUrl,
        enc_image_uid,
        thumbnail_size: thumbnailSizeTypes.SIZE_1000,
        isWaterMark: true,
        timestamp,
      });

      socailShareImageUrl = getSlideShowImageUrl({
        galleryBaseUrl,
        enc_image_uid,
        timestamp,
        thumbnail_size: null,
      });

      imgRot = getDegree(useImg.get('orientation'));
    }
    cover_img = cover_img.merge({ imgUrl, imgRot, imgUrlMid, socailShareImageUrl });
  }

  //云服的logo需要从get_studio_info获取
  let logo = detail.get('logo') || emptyMap;
  const studioList = studioInfo.get('studioList');
  if (__isCN__ && studioList && studioList.length > 0) {
    const { studio_logo } = studioList[0];
    logo = fromJS({
      orientation: 3,
      enc_image_uid: studio_logo,
    });
  }

  const newDetail = detail.merge({
    photos: photos.merge({
      allImgCount,
      selectedframeList,
      selectedImgUidList,
      selectedImgCount: count,
    }),
    cover: cover_img,
    frameList,
    logo,
  });
  return newDetail;
};

/**
 * 获取collection的预览链接.
 * @param {*} detail
 * @param {*} userInfo
 */
const getCollectionPreviewUrl = (detail, userInfo) => {
  const customer_uid = userInfo ? userInfo.get('uidPk') : '';
  const collection_uid = detail ? detail.get('enc_collection_uid') : '';

  if (collection_uid && customer_uid) {
    return `/gallery-client/index.html?collection_uid=${collection_uid}&customer_uid=${customer_uid}&share_uid=`;
  }
  return '';
};

/**
 * 转换detail的sets数据
 * @param {*} detail
 */
const getCollectionDetailSets = detail => {
  const sets = detail.get('sets');
  // const currentSetUid = detail.get('current_set_uid');
  // console.log('currentSetUid: ', currentSetUid);
  if (!sets || sets.size === 0) {
    return emptyArr;
  }
  // 根据当前 set_uid 更新当前set下的图片数量
  // const defaultSetId = detail.getIn(['default_set', 'set_uid']);
  // const photoCount = detail.get('images') ? detail.get('images').size : 0;

  return fromJS(sets).map(m => {
    const set = fromJS(m);
    const obj = {
      id: `${set.get('set_uid')}`,
      set_name: `${set.get('set_name')}`,
      photo_count: `${set.get('photo_count')}`,
    };
    return set.merge(obj);
  });
};

/**
 * 邮件分享数据加默认图片
 * @param {*} data
 * @param {*} urls
 */
const transformEmailThemeData = (data, urls) => {
  const emailTheme = data.get('emailTheme');
  if (!emailTheme || !urls) {
    return emptyArr;
  }
  const saasBaseUrl = urls.get('saasBaseUrl');
  const hasCover = emailTheme.get('have_cover');

  // exif
  const imgRot = getDegree(emailTheme.getIn(['cover', 'orientation']));
  // const cover_version = emailTheme.getIn(['cover', 'cover_version']);

  const emailCoverUrl = hasCover
    ? getSlideShowImageUrl({
        galleryBaseUrl: urls.get('galleryBaseUrl'),
        enc_image_uid: emailTheme.getIn(['cover', 'enc_image_uid']),
        thumbnail_size: thumbnailSizeTypes.SIZE_1000,
        // cover_version
      })
    : template(DEFAULT_COVER_URL_LARGE)({ saasBaseUrl });

  // exif
  return emailTheme.merge({ imgRot, emailCoverUrl });
};

/**
 * 组装design模板渲染所需数据
 * @param {*} data
 * @param {*} urls
 */
const transformDetailData = (data, urls) => {
  const detail = fromJS(data).get('detail');
  if (!detail || !urls) {
    return emptyArr;
  }
  const saasBaseUrl = urls.get('saasBaseUrl');
  const convertDetail = detail.setIn(
    ['cover', 'defaultCoverLarge'],
    template(DEFAULT_COVER_URL_LARGE)({ saasBaseUrl })
  );
  const designSettings = fromJS(data).getIn(['settings', 'design_setting']);
  return convertDetail.set('design_setting', designSettings);
};

/**
 * settings 数据加默认封面图、模板缩略图及gallery样式图
 * @param {*} data
 * @param {*} urls
 */
const transformCollectionSettings = (data, urls) => {
  const settings = fromJS(data).get('settings');
  if (!settings || settings.size === 0 || !urls) {
    return emptyArr;
  }

  const saasBaseUrl = urls.get('saasBaseUrl');
  const designSettings = settings.get('design_setting');
  const templateId = designSettings.getIn(['cover', 'template']);
  const typography = designSettings.getIn(['gallery', 'typography']);
  const gridStyle = designSettings.getIn(['gallery', 'grid_style']);
  const color = designSettings.getIn(['gallery', 'color']);
  const thumbnailSize = designSettings.getIn(['gallery', 'thumbnail_size']);
  const gridSpacing = designSettings.getIn(['gallery', 'grid_spacing']);
  const navigationStyle = designSettings.getIn(['gallery', 'navigation_style']);

  const galleryPhotoName = `${typography}-${gridStyle}-${color}-${thumbnailSize}-${gridSpacing}-${navigationStyle}`;
  const galleryStyleUrlPC = template(COLLECTION_GALLERY_STYLE_URL_PC)({
    saasBaseUrl,
    galleryPhotoName,
  });
  const galleryStyleUrlM = template(COLLECTION_GALLERY_STYLE_URL_M)({
    saasBaseUrl,
    galleryPhotoName,
  });
  const coverTemplateUrl = template(COLLECTION_COVER_TEMPLATE_URL)({
    saasBaseUrl,
    templateId,
  });

  const setCoverTemplate = settings.mergeIn(['design_setting', 'cover'], {
    coverTemplateUrl,
  });
  return setCoverTemplate.mergeIn(['design_setting', 'gallery'], {
    galleryStyleUrlPC,
    galleryStyleUrlM,
  });
};

const getDefaultImgs = (urls = fromJS({})) => {
  const saasBaseUrl = urls.get('saasBaseUrl');
  return fromJS({
    defaultCoverSmall: template(DEFAULT_COVER_URL_SMALL)({ saasBaseUrl }),
    defaultCoverXs: template(DEFAULT_COVER_URL_XS)({ saasBaseUrl }),
  });
};

const transformCollectionFavorite = (favorite, detail) => {
  if (!favorite || !detail) {
    return emptyMap;
  }

  const allFavoriteList = favorite.get('allFavoriteList');
  const images = detail.get('images');

  if (!allFavoriteList || !images) {
    return favorite;
  }

  // 添加imgrot
  const newFavoriteList = allFavoriteList.map(item => {
    const enc_cover_image_uid = item.get('enc_cover_image_uid');
    const image = images.find(m => m.get('enc_image_uid') === enc_cover_image_uid);

    return image ? item.merge({ imgRot: image.get('imgRot') }) : item;
  });
  let newFavorite = favorite.merge({ allFavoriteList: newFavoriteList });

  // 添加imgrot
  const records = favorite.getIn(['guestFavoriteInfo', 'favorite_image_list', 'records']);
  if (records) {
    const newRecords = records.map(item => {
      const enc_image_uid = item.get('enc_image_uid');
      const image = images.find(m => m.get('enc_image_uid') === enc_image_uid);

      return image ? item.merge({ imgRot: image.get('imgRot') }) : item;
    });

    newFavorite = newFavorite.setIn(
      ['guestFavoriteInfo', 'favorite_image_list', 'records'],
      newRecords
    );
  }

  return newFavorite;
};

const getCurrentSegment = (detail, urls) => {
  const segments = detail.get('segments');
  const galleryBaseUrl = urls.get('galleryBaseUrl');
  if (!segments || segments.size === 0 || !urls) {
    return emptyMap;
  }
  const currentSegment = segments.filter(segment => segment.get('selected')).get('0');
  if (!currentSegment) {
    return emptyMap;
  }

  const duration = currentSegment.getIn(['music', 'duration']);
  const musicEncId = currentSegment.getIn(['music', 'audios', '0', 'enc_id']);
  const artist_name = currentSegment.getIn(['music', 'audios', '0', 'artist_name']);
  const music_title = currentSegment.getIn(['music', 'audios', '0', 'music_title']);
  const region_start = currentSegment.getIn(['music', 'audios', '0', 'start']);
  const region_end = currentSegment.getIn(['music', 'audios', '0', 'end']);
  const segmentImages = currentSegment.get('frames');

  const musicUrl = template(SLIDESHOW_MUSIC_URL)({
    saasBaseUrl: '/',
    encId: musicEncId,
  });
  const setting = currentSegment.get('setting');

  let timePerImage = 0;
  if (region_end) {
    timePerImage = ((region_end - region_start) / segmentImages.size).toFixed(2);
  }

  return fromJS({
    musicEncId,
    duration,
    musicUrl,
    segmentImages,
    setting,
    artist_name,
    music_title,
    timePerImage,
    region_start,
    region_end,
  });
};

const getStorageStatus = subscription => {
  const subscriptionList = subscription.get('items');
  if (!subscriptionList || !subscriptionList.size) {
    return emptyMap;
  }

  let storageStatus = emptyMap;
  subscriptionList.forEach(item => {
    const productId = item.get('product_id');
    const usageSize = item.getIn(['storage_info', 'usage_size']);
    const maxSize = item.getIn(['storage_info', 'max_size']);
    if (productId === 'SAAS_SLIDE_SHOW') {
      let reachStorageLimit = false;
      if (maxSize === 'Unlimited') {
        reachStorageLimit = false;
      } else if (+usageSize === +maxSize) {
        reachStorageLimit = true;
      } else {
        reachStorageLimit = false;
      }
      storageStatus = storageStatus.merge({ maxSize, usageSize, reachStorageLimit });
    }
  });
  return storageStatus;
};
const getPostCardList = data => {
  return data.get('list');
};

const getPostCardDetail = (data, urls) => {
  return data.get('detail');
};

const getUsedPostCardDetail = (data, urls) => {
  return data.get('usedDetail');
};

const getUrlsHelper = urls => {
  if (!__isCN__) {
    // 因为美国的SaaS就在www域名下，并且目前项目中大量存在使用galleryBaseUrl的情况，存在跨域问题。
    // 所以在此同一替换为baseUrl
    return urls.merge({
      galleryBaseUrl: urls.get('baseUrl'),
    });
  }
  return urls;
};

export {
  getConvertCollectionsList,
  getCollectionPreviewUrl,
  getCollectionDetail,
  getCollectionDetailSets,
  transformCoverData,
  transformEmailThemeData,
  transformDetailData,
  transformCollectionSettings,
  transformCollectionFavorite,
  getDefaultImgs,
  getCurrentSegment,
  getCollectionList,
  getStorageStatus,
  getPostCardList,
  getPostCardDetail,
  getUsedPostCardDetail,
  getUrlsHelper,
};
