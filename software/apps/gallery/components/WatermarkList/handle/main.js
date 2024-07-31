import React from 'react';
import { fromJS } from 'immutable';
import { template } from 'lodash';
import {
  UPLOAD_WATEMARK_MODAL,
  CREAT_WATEMARK_MODAL,
  SHOW_WATER_MARK_UPGRADE
} from '@apps/gallery/constants/modalTypes';
import { SAAS_POST_WATERMARK_UPLOAD } from '@resource/lib/constants/apiUrl';
import { guid } from '@resource/lib/utils/math';
import { getImageUrl } from '@resource/lib/saas/image';
import { thumbnailSizeTypes, saasProducts } from '@resource/lib/constants/strings';

const onAddImages = (that, files) => {
  const { boundGlobalActions, urls } = that.props;
  // const isOrderGallery = that.getIsFree();
  const params = {
    title: t('UPLOAD_WATEMARK'),
    acceptFileTip: t('UPLOADSTICKERMODAL_TYPE_CONFLICT'),
    isShown: true,
    maxUploadNum: 1,
    maxFileSize: 10,
    cusTypeCheck: {
      type: 'image/x-png,image/png',
      errorText: t('ONLY_PNG_IS_SUPPORTED')
    },
    uploadingImages: files.map(file => {
      file.guid = guid();
      return { file };
    }),
    transformPostBody: opt => opt,
    uploadUrl: template(SAAS_POST_WATERMARK_UPLOAD)({
      galleryBaseUrl: urls.get('galleryBaseUrl')
    }),
    actions: {
      onCloseModal: images => {
        boundGlobalActions.hideModal(UPLOAD_WATEMARK_MODAL);
      },

      onShowConfirm: boundGlobalActions.showConfirm,
      onHideConfirm: boundGlobalActions.hideConfirm,

      onAddImages: () => {},
      onUploadSuccess: fields => uploadComplete(that, fields),
      onShowHelp: boundGlobalActions.showFeedback
    }
  };
  boundGlobalActions.showModal(UPLOAD_WATEMARK_MODAL, { params });
};

const uploadComplete = (that, fields) => {
  const { boundGlobalActions, urls, collectionDetail } = that.props;
  const watermarkList = collectionDetail.get('watermarkList');
  boundGlobalActions.hideModal(UPLOAD_WATEMARK_MODAL);
  const params = {
    fields,
    urls,
    close: () => boundGlobalActions.hideModal(CREAT_WATEMARK_MODAL),
    watermarkList,
    onSave: (...opt) => creatAndUpdateWatermark(that, ...opt)
  };
  boundGlobalActions.showModal(CREAT_WATEMARK_MODAL, { params });
};

const creatAndUpdateWatermark = (that, parmas) => {
  const { name, isRepeatedName } = parmas;
  const { boundGlobalActions, boundProjectActions } = that.props;
  const { creatWatermark, udateWatermark } = boundProjectActions;
  if (isRepeatedName) {
    return boundGlobalActions.addNotification({
      message: t('WATER_NAME_EXISTS'),
      level: 'error',
      autoDismiss: 2
    });
  }
  const fn = parmas.watermark_uid ? udateWatermark : creatWatermark;
  fn(parmas).then(res => {
    that.getWatermarkList();
    boundGlobalActions.hideModal(CREAT_WATEMARK_MODAL);
  });
};

const editWatermark = (that, item) => {
  const { boundGlobalActions, urls, collectionDetail } = that.props;
  const watermarkList = collectionDetail.get('watermarkList');
  const params = {
    fields: item.toJS(),
    urls,
    watermarkList,
    close: () => boundGlobalActions.hideModal(CREAT_WATEMARK_MODAL),
    onSave: (...opt) => creatAndUpdateWatermark(that, ...opt)
  };
  boundGlobalActions.showModal(CREAT_WATEMARK_MODAL, { params });
};

const deleteWatermark = (that, item) => {
  const { boundGlobalActions, boundProjectActions } = that.props;

  const { addNotification, hideConfirm, showConfirm } = boundGlobalActions;
  const { deleteWatermark } = boundProjectActions;

  const data = {
    className: 'delete-collection-modal',
    close: hideConfirm,
    message: t('SURE_TO_DELETE_WATERMARK'),
    buttons: [
      {
        className: 'white pwa-btn',
        text: t('CANCEL'),
        onClick: () => {
          hideConfirm();
        }
      },
      {
        className: 'pwa-btn',
        text: t('DELETE'),
        onClick: () => {
          deleteWatermark(item.toJS()).then(response => {
            // addNotification({
            //   message: t('COLLECTION_DELETE_SUCCESSED_TOAST', { collectionName }),
            //   level: 'success',
            //   autoDismiss: 2
            // });
            that.getWatermarkList();
            hideConfirm();
          });
        }
      }
    ]
  };
  showConfirm(data);
};

const getWatermarkList = async that => {
  const { boundProjectActions } = that.props;
  const { getWatermarkList, updateWatermarkList } = boundProjectActions;
  const res = await getWatermarkList();
  let list = res.data;
  for (let item of list) {
    if (item.enc_image_uid) {
      item.markSrc = await getImageSrc(that, {
        image_uid: item.enc_image_uid
      });
      item.scale = Math.round(item.scale * 100);
      item.opacity = Math.round(item.opacity * 100);
    }
  }
  updateWatermarkList(list);
};

const filterList = that => {
  const { collectionDetail } = that.props;
  const watermarkList = collectionDetail.get('watermarkList');
  if (watermarkList && watermarkList.size > 0) {
    return watermarkList.filter(i => !!i.get('can_edit'));
  }
  return fromJS([]);
};

const getIsFree = that => {
  let { mySubscription } = that.props;
  mySubscription = mySubscription.toJS();
  let showUpgrade = false;
  if (mySubscription && mySubscription.items && mySubscription.items.length) {
    const curInfo = mySubscription.items.find(i => i.product_id === saasProducts.gallery);
    // console.log("curInfo..",curInfo)
    if (curInfo) {
      const { plan_level, trial_plan_level } = curInfo;
      showUpgrade = plan_level === 10 && trial_plan_level <= 10;
      // showUpgrade = true
    }
  }

  // debugger

  return showUpgrade;
};

const getImageSrc = (that, obj) => {
  const { urls } = that.props;
  return getImageUrl({
    galleryBaseUrl: urls.get('galleryBaseUrl'),
    thumbnail_size: thumbnailSizeTypes.SIZE_200,
    isWaterMark: false,
    ...obj
  });
};

//
const showUpgradeModal = that => {
  const { boundGlobalActions } = that.props;
  const { showModal } = boundGlobalActions;

  let params = {
    url: '/saascheckout.html?level=20&cycle=1&product_id=SAAS_GALLERY',
    upgradeContent:
      'Custom Watermark feature is included in Zno Gallery Basic Plan and above. Upgrade your plan to use this feature.',
    btnText: 'Upgrade'
  };
  showModal(SHOW_WATER_MARK_UPGRADE, {
    id: 12312312333,
    params,
    close: () => {
      // 关闭弹窗
      boundGlobalActions.hideModal('SHOW_WATER_MARK_UPGRADE');
    }
  });
};

export default {
  onAddImages,
  getWatermarkList,
  filterList,
  editWatermark,
  deleteWatermark,
  getIsFree,
  showUpgradeModal
};
