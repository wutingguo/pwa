import { fromJS } from 'immutable';
import { template } from 'lodash';

import { getCoverImageUrl } from '@resource/lib/saas/image';
import { transformCoverData, transformPresetCoverData } from '@resource/lib/saas/mapStateHelper';

import { getDegree } from '@resource/lib/utils/exif';

import { thumbnailSizeTypes } from '@resource/lib/constants/strings';

import {
  COLLECTION_COVER_TEMPLATE_URL,
  COLLECTION_GALLERY_STYLE_URL_M,
  COLLECTION_GALLERY_STYLE_URL_PC,
  DEFAULT_COVER_URL_LARGE,
  DEFAULT_COVER_URL_SMALL,
  DEFAULT_COVER_URL_XS,
} from '@apps/gallery/constants/imageUrl';

const emptyArr = fromJS([]);
const emptyMap = fromJS({});

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
  const cloudBaseUrl = urls.get('cloudBaseUrl');
  const defaultCoverUrlSmall = template(DEFAULT_COVER_URL_SMALL)({
    saasBaseUrl,
  });
  const defaultCloudCoverUrlSmall = template(DEFAULT_COVER_URL_SMALL)({
    saasBaseUrl: cloudBaseUrl,
  });
  const convertList = fromJS(list).map(item => {
    if (item.get('cover')) {
      const isShowDefaultCover = !item.getIn(['cover', 'image_uid']);
      const coverUrlSmall = getCoverImageUrl({
        galleryBaseUrl: cloudBaseUrl,
        collection_uid: item.get('enc_collection_uid'),
        cover_version: item.getIn(['cover', 'cover_version']),
        thumbnail_size: thumbnailSizeTypes.SIZE_350,
      });
      const cloudCoverUrlSmall = getCoverImageUrl({
        galleryBaseUrl: cloudBaseUrl,
        collection_uid: item.get('enc_collection_uid'),
        cover_version: item.getIn(['cover', 'cover_version']),
        thumbnail_size: thumbnailSizeTypes.SIZE_350,
      });
      return item.mergeIn(['cover'], {
        isShowDefaultCover,
        defaultCoverUrlSmall: __isCN__ ? defaultCoverUrlSmall : defaultCloudCoverUrlSmall,
        coverUrlSmall: __isCN__ ? coverUrlSmall : cloudCoverUrlSmall,
        imgRot: getDegree(item.getIn(['cover', 'orientation'])),
      });
    }
    return item;
  });

  return convertList;
};

/**
 * 转换collection的detail数据, 使他可以在组件中直接使用.
 * @param {*} data
 */
const getCollectionDetail = (data, urls) => {
  const { detail } = data;
  if (!detail || !urls) {
    return emptyArr;
  }

  const galleryBaseUrl = urls.get('galleryBaseUrl');
  const defaultCoverSmall = getDefaultImgs(urls).get('defaultCoverSmall');
  const image_uid = detail.getIn(['cover', 'image_uid']);
  const timestamp = detail.getIn(['cover', 'coverTimestamp']);
  const collection_uid = detail.get('enc_collection_uid');

  let imgList = detail.get('images');
  let cover = detail.get('cover');
  const photos = detail.get('photos') || fromJS({});
  let count = 0;
  let allImgCount = 0;
  let watermarkLoading = {
    loading: false,
    apply_all: false,
  };
  let selectedImgList = fromJS([]);
  let selectedImgUidList = fromJS([]);
  let sets = detail.get('sets');
  let currentSetUid = detail.get('currentSetUid');

  if (imgList && imgList.size) {
    // 照片按创建时间从新到旧排序
    // imgList = imgList.sort((a, b) => {
    //   return b.get('create_time') - a.get('create_time');
    // });

    // 计算图片的旋转角度.
    imgList = imgList.map(m => {
      return m.merge({
        imgRot: getDegree(m.get('orientation')),
        encImgId: m.get('enc_image_uid') || m.get('encImgId'),
      });
    });

    allImgCount = imgList.size;
    selectedImgList = imgList.filter(img => !!img.get('selected'));
    selectedImgUidList = selectedImgList.map(img => {
      // if(img.get('enc_corrected_image_uid')) {
      //   return img.get('enc_corrected_image_uid')
      // }
      return img.get('enc_image_uid') || img.get('encImgId');
    });
    count = selectedImgList.size;
  }

  if (cover) {
    let imgUrl = defaultCoverSmall;

    // 使用非默认图的情况:
    // 1. 封面有图片信息时,
    // 2. 封面没有图片信息时, 但选片集中由图片
    if (image_uid || (imgList && imgList.size)) {
      imgUrl = getCoverImageUrl({
        galleryBaseUrl,
        collection_uid,
        timestamp,
        cover_version: cover.get('cover_version'),
        thumbnail_size: thumbnailSizeTypes.SIZE_350,
      });
    }

    let imgRot = getDegree(cover.get('orientation'));
    let exifOrientation = cover.get('orientation');
    if (!image_uid) {
      if (imgList && imgList.size) {
        const orientation = imgList.getIn(['0', 'orientation']);
        imgRot = getDegree(orientation);
        exifOrientation = orientation;
      }
    }
    cover = cover.merge({ imgUrl, imgRot, orientation: exifOrientation });
  }

  if (!currentSetUid && sets) {
    currentSetUid = String(sets.getIn(['0', 'set_uid']));
  }

  const newDetail = detail.merge({
    currentSetUid,
    photos: photos.merge({
      allImgCount,
      selectedImgList,
      selectedImgUidList,
      selectedImgCount: count,
    }),
    cover,
    // watermarkLoading,
    images: imgList,
  });

  return newDetail;
};

/**
 * 获取collection的预览链接.
 * @param {*} detail
 * @param {*} userInfo
 */
const getCollectionPreviewUrl = (detail, userInfo, urls, estoreInfo, shareData) => {
  const customer_uid = userInfo ? userInfo.get('uidPk') : '';
  const collection_uid = detail ? detail.get('enc_collection_uid') : '';
  const shareDirectLink = shareData.get('shareDirectLink');
  const estoreId = estoreInfo ? estoreInfo.id : '';

  if (collection_uid && customer_uid && __isCN__) {
    let url = `${urls.get(
      'saasShareUrl'
    )}gallery-client/index.html?collection_uid=${collection_uid}&customer_uid=${customer_uid}&share_uid=`;
    if (estoreId) {
      url += `&storeId=${estoreId}`;
    }
    return url;
  }
  // 美国需要用到 subdomain 的url
  if (!__isCN__) {
    return shareDirectLink;
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
  const cover_version = emailTheme.getIn(['cover', 'cover_version']);
  const emailCoverUrl = hasCover
    ? getCoverImageUrl({
        galleryBaseUrl: urls.get('galleryBaseUrl'),
        collection_uid: emailTheme.get('enc_collection_uid'),
        thumbnail_size: thumbnailSizeTypes.SIZE_1000,
        cover_version,
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
  const saasBaseUrl = __isCN__ ? urls.get('saasBaseUrl') : urls.get('cloudBaseUrl'); //图片跨域兼容
  const convertDetail = detail.setIn(
    ['cover', 'defaultCoverLarge'],
    template(DEFAULT_COVER_URL_LARGE)({ saasBaseUrl })
  );
  const designSettings = fromJS(data).getIn(['settings', 'design_setting']);
  return convertDetail.set('design_setting', designSettings);
};
/**
 * 组装预设design模板渲染所需数据
 * @param {*} data
 * @param {*} urls
 */
const transformPresetDetailData = (data, urls) => {
  const detail = fromJS(data).get('detail');
  if (!detail || !urls) {
    return emptyArr;
  }
  const saasBaseUrl = __isCN__ ? urls.get('saasBaseUrl') : urls.get('cloudBaseUrl'); //图片跨域兼容
  const convertDetail = detail.setIn(
    ['cover', 'defaultCoverLarge'],
    template(DEFAULT_COVER_URL_LARGE)({ saasBaseUrl })
  );
  const designSettings = fromJS(data).getIn(['settings', 'presetSettings', 'design_setting']);
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

  if (!settings.get('design_setting')) {
    console.log('design_setting is empty');
    return settings;
  }

  const baseUrl = urls.get('baseUrl');
  const saasBaseUrl = urls.get('saasBaseUrl');

  const designSettings = settings.get('design_setting');
  const templateId = designSettings.getIn(['cover', 'template']);
  const typography = designSettings.getIn(['gallery', 'typography']);
  const gridStyle = designSettings.getIn(['gallery', 'grid_style']);
  const color = designSettings.getIn(['gallery', 'color']);
  const thumbnailSize = designSettings.getIn(['gallery', 'thumbnail_size']);
  const gridSpacing = designSettings.getIn(['gallery', 'grid_spacing']);
  const navigationStyle = designSettings.getIn(['gallery', 'navigation_style']);
  // 兼容之前大小写情况
  const galleryPhotoName =
    `${typography}-${gridStyle}-${color}-${thumbnailSize}-${gridSpacing}-${navigationStyle}-1`.toLowerCase();
  const galleryStyleUrlPC = template(COLLECTION_GALLERY_STYLE_URL_PC)({
    baseUrl,
    galleryPhotoName,
  });
  const galleryStyleUrlM = template(COLLECTION_GALLERY_STYLE_URL_M)({
    baseUrl,
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

const transformPresetSettings = (data, urls) => {
  const settings = fromJS(data).get('settings');

  if (!settings || settings.size === 0 || !urls) {
    return emptyArr;
  }
  if (settings.get('presetSettings')) {
    return transformCollectionSettings(fromJS({ settings: settings.get('presetSettings') }), urls);
  }
  return emptyArr;
};

const getDefaultImgs = (urls = fromJS({})) => {
  const saasBaseUrl = __isCN__ ? urls.get('saasBaseUrl') : urls.get('cloudBaseUrl'); //图片跨域兼容
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

const getWatermarkLoading = (props, type) => {
  const { collectionDetail, boundGlobalActions } = props;
  const { loading, apply_all } = collectionDetail.get('watermarkLoading')?.toJS() || {};
  const currentSetUid = collectionDetail.get('currentSetUid');
  const sets = collectionDetail.get('sets').toJS();
  const currentSetArray = sets.filter(set => set.set_uid == currentSetUid);
  const currentSet = !!currentSetArray && currentSetArray[0];
  const watermarkStatus = (currentSet && currentSet.watermarkStatus) || false;
  if (loading && type === 'btn') {
    boundGlobalActions.addNotification({
      message: t('WATERMARK_PROCESSING'),
      level: 'warning',
      autoDismiss: 2,
    });
    return loading;
  } else if (watermarkStatus && type === 'selectAll') {
    boundGlobalActions.addNotification({
      message: t('WATERMARK_PROCESSING'),
      level: 'warning',
      autoDismiss: 2,
    });
  }
  return watermarkStatus;
};

export {
  getConvertCollectionsList,
  getCollectionPreviewUrl,
  getCollectionDetail,
  getCollectionDetailSets,
  transformCoverData,
  transformPresetCoverData,
  transformEmailThemeData,
  transformDetailData,
  transformPresetDetailData,
  transformCollectionSettings,
  transformCollectionFavorite,
  getDefaultImgs,
  getWatermarkLoading,
  transformPresetSettings,
};
