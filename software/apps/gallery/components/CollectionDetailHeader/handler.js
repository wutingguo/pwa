import { fromJS } from 'immutable';

import * as modalTypes from '@resource/lib/constants/modalTypes';
import * as notificationTypes from '@resource/lib/constants/notificationTypes';
import { aiphotoInfo, saasProducts } from '@resource/lib/constants/strings';

import { ensurePFCReady, getWASMPath } from '@resource/lib/perfectlyClear/utils/help';

import { setFreeSubscribeProduct } from '@resource/pwa/services/subscription';

import * as localModalTypes from '@apps/gallery/constants/modalTypes';

const onOpenAiphotoClick = (that, opt) => {
  const {
    boundGlobalActions: {
      showModal,
      hideModal,
      showGlobalLoading,
      hideGlobalLoading,
      showConfirm,
      hideConfirm,
      getMySubscription,
      addNotification,
    },
    boundProjectActions: {
      postAiCollectionUpload,
      postLiveCollectionUpload,
      postResortImages,
      changeSelectedSet,
      getCountFreshImages,
    },
    collectionDetail,
    urls,
    preCheckUploadCondition,
    tabName,
  } = that.props;
  let modalType = modalTypes.ADD_AIPHOTO_MODAL;
  if (opt.type === 'live') {
    modalType = modalTypes.ADD_LIVEPHOTO_MODAL;
    window.logEvent.addPageEvent({
      name: 'Gallery_AddFromLivePhoto',
    });
  } else {
    window.logEvent.addPageEvent({
      name: 'GalleryPhotos_Click_AddPhotosFromRetoucher',
    });
  }
  if (!preCheckUploadCondition()) {
    return false;
  }
  const gallerySetImagesNum = collectionDetail
    .get('sets')
    .toJS()
    .reduce((a, b) => a + b.photo_count, 0);
  showModal(modalType, {
    urls,
    gallerySetImages: collectionDetail.get('images'),
    gallerySetImagesNum,
    tabName,
    close: () => {
      hideModal(modalType);
    },
    addAiphotoModalOk: selectedParams => {
      const params =
        opt.type === 'live'
          ? {
              album_info_list: selectedParams,
              gallery_collection_param: {
                collection_id: collectionDetail.get('collection_uid'),
                set_id: collectionDetail.get('currentSetUid'),
              },
            }
          : {
              correct_image_param: selectedParams,
              gallery_collection_param: {
                collection_id: collectionDetail.get('collection_uid'),
                set_id: collectionDetail.get('currentSetUid'),
              },
            };
      showGlobalLoading();
      (opt.type === 'live' ? postLiveCollectionUpload(params) : postAiCollectionUpload(params))
        .then(res => {
          hideGlobalLoading();
          hideModal(modalType);
          if (res.ret_code === 200000) {
            //拉取并固定排序
            that.props.getCollectionDetail();
            // const setUid = collectionDetail.get('currentSetUid');
            setTimeout(() => {
              // changeSelectedSet(setUid);
              // showGlobalLoading();
              // getSetPhotoList(collectionDetail.get('collection_uid'), setUid)
              //   .then(response => {
              //     hideGlobalLoading();
              //   })
              //   .catch(err => {});
              const imageList = that.props.collectionDetail.get('images');
              const imageUidsList = imageList.map(i => i.get('enc_image_uid'));
              console.log(imageList, imageUidsList.toJS(), 'imageUidsList');
              imageUidsList.size && postResortImages(imageUidsList.toJS());
              // 上传完成后，获取新增图片接口
              const enc_collection_uid = collectionDetail.get('enc_collection_uid');
              const collection_group_info = collectionDetail.get('collection_group_info');
              const group_status =
                collection_group_info && collection_group_info.get('group_status');
              if (group_status === 2 || group_status === 1) {
                getCountFreshImages(enc_collection_uid);
              }
            }, 500);
          } else if (res.ret_code === 400313) {
            showConfirm({
              title: t('ARE_YOU_SURE'),
              message: t('PRE_CHECK_MESSAGE_GALLERY_INSUFFICIENT_STORAGE'),
              close: hideConfirm,
              buttons: [
                {
                  onClick: () => {
                    hideConfirm();
                    if (__isCN__) {
                      const { mySubscription } = that.props;
                      const list = mySubscription.get('items');
                      const findGallery = list.find(
                        item => item.get('product_id') === saasProducts.gallery
                      );
                      showModal(modalTypes.SAAS_CHECKOUT_MODAL, {
                        product_id: saasProducts.gallery,
                        escapeClose: true,
                        level: findGallery.get('plan_level') + 10,
                        onClosed: () => {
                          hideModal(modalTypes.SAAS_CHECKOUT_MODAL);
                          getMySubscription(urls.get('saasBaseUrl'));
                        },
                      });
                    } else {
                      location.href = `/saascheckout.html?from=saas&product_id=${saasProducts.gallery}`;
                    }
                  },

                  text: t('UPGRADE'),
                },
              ],
            });
          } else if (res.ret_code === 420302) {
            addNotification({
              message: t('STATUS_420302'),
              level: 'error',
              autoDismiss: 2,
            });
          }
        })
        .catch(err => {
          console.log('postAiCollectionUpload--catch-->', err);
          hideGlobalLoading();
        });
    },
  });
};

const onAiphoto = async that => {
  const { collectionDetail, boundGlobalActions } = that.props;

  const selectedImgCount = collectionDetail.getIn(['photos', 'selectedImgCount']);
  const selectedImgList = collectionDetail.getIn(['photos', 'selectedImgList']);
  const images = collectionDetail.getIn(['images']) && collectionDetail.getIn(['images']).toJS();
  const needPrompt = images.some(item => item.suffix === '.png' && item.selected);
  if (selectedImgCount === 0) {
    boundGlobalActions.addNotification({
      message: t('请选择图片'),
      level: 'success',
      autoDismiss: 2,
    });
    return false;
  }

  if (needPrompt) {
    boundGlobalActions.addNotification({
      message: '修图服务当前仅支持JPG、JPEG格式图片。',
      level: 'error',
      autoDismiss: 2,
    });
    return false;
  }
  // 订阅智能修图
  await updateFreeSubscribeProduct.call(that);

  if (selectedImgCount === 1) {
    that.creatAiSingle(selectedImgList);
    return false;
  }

  if (selectedImgCount > 1) {
    const correctList = selectedImgList.filter(i => i.get('correct_status') > 0);
    if (correctList.size > 0) {
      boundGlobalActions.addNotification({
        message: t('您选中照片中包含已修照片，请勿重复勾选。'),
        level: 'success',
        autoDismiss: 2,
      });
      return false;
    }
    that.creatAiCollection(selectedImgList);
  }
};

function updateFreeSubscribeProduct() {
  const { urls } = this.props;
  const baseUrl = urls.get('galleryBaseUrl');
  const params = {
    baseUrl,
    type: 'aiphoto',
  };
  return setFreeSubscribeProduct(params);
}

const creatAiCollection = (that, selectedImgList) => {
  const { boundGlobalActions, boundProjectActions, collectionDetail } = that.props;
  const { hideModal, showModal, addNotification } = boundGlobalActions;
  const {
    // getAiPfcTopicEffects,
    postAiCollectionStart,
    getPfcTopicEffects,
    updateSelectedImgStatus,
  } = boundProjectActions;
  const imageIds = selectedImgList.toJS().map(i => i.enc_image_uid);

  const data = {
    title: '即将开始修图',
    effectsList: fromJS([]),
    categoryList: fromJS([]),
    getPfcTopicEffects,
    isHideInput: true,
    selectedTotal: selectedImgList.size,
    okBtnText: 'OK',
    handleSave: ({ preset_code, topic_code }) => {
      const params = {
        collection_uid: collectionDetail.get('collection_uid'),
        set_uid: collectionDetail.get('currentSetUid'),
        enc_image_ids: imageIds,
        topic_code,
        preset_code,
      };
      postAiCollectionStart(params).then(res => {
        const { ret_code } = res;
        if (ret_code === 200000) {
          addNotification({
            message: t('开始修图'),
            level: 'success',
            autoDismiss: 2,
          });
          updateSelectedImgStatus(imageIds, 1);
        } else if (ret_code === 400313) {
          that.aiFailedModal();
        } else {
          addNotification({
            message: t('修图失败'),
            level: 'error',
            autoDismiss: 2,
          });
        }
      });
      hideModal(localModalTypes.AI_COLLECTION_MODAL);
    },
    handleCancel: () => {
      hideModal(localModalTypes.AI_COLLECTION_MODAL);
    },
    close: () => {
      hideModal(localModalTypes.AI_COLLECTION_MODAL);
    },
  };

  showModal(localModalTypes.AI_COLLECTION_MODAL, data);
};

const aiFailedModal = that => {
  const {
    boundGlobalActions: { hideConfirm, showConfirm, showModal, hideModal, getMySubscription },
    urls,
  } = that.props;

  const data = {
    className: 'ai-delete-collection-modal',
    close: hideConfirm,
    // title: `${t('DELETE_COLLECTION_AI')}?`,
    message: t('您的可用修片额度不足，需购买套餐，或者减少照片数量再发起修片服务'),
    buttons: [
      {
        className: 'white pwa-btn',
        text: t('知道了'),
        onClick: () => {
          hideConfirm();
        },
      },
      {
        className: 'pwa-btn',
        text: t('购买'),
        onClick: () => {
          hideConfirm();
          let curInfo = (curInfo = aiphotoInfo[1] || {});
          showModal(modalTypes.SAAS_CHECKOUT_MODAL, {
            product_id: saasProducts.aiphoto,
            aiphotoParams: {
              ...curInfo,
              combos: aiphotoInfo.slice(1),
            },
            level: curInfo.level_id,
            cycle: curInfo.cycle_id,
            escapeClose: true,
            onClosed: () => {
              hideModal(modalTypes.SAAS_CHECKOUT_MODAL);
              getMySubscription(urls.get('saasBaseUrl'));
            },
          });
        },
      },
    ],
  };
  showConfirm(data);
};

const creatAiSingle = async (that, selectedImgList, pfcOtherParams = {}) => {
  const { boundGlobalActions, collectionDetail } = that.props;

  const pfcParams = {
    imageArray: fromJS(selectedImgList),
    pfcFromModule: saasProducts.gallery,
    galleryPfcParams: {
      collection_uid: collectionDetail.get('collection_uid'),
      set_uid: collectionDetail.get('currentSetUid'),
    },
    onCloseModalCallback: () => {
      that.props.getCollectionDetail();
    },
    ...pfcOtherParams,
  };

  try {
    const wasmJsFile = await getWASMPath();

    boundGlobalActions.showModal(modalTypes.DOWN_WASM_MODAL, {
      wasmJsFile,
      success: () => {
        boundGlobalActions.showModal(modalTypes.PERFECTLY_CLEAR_MODAL, pfcParams);
      },
      lose: () => {
        boundGlobalActions.addNotification({
          message: t('PERFECTLY_CLEAR_LOAD_FAILED'),
          level: 'success',
          uid: notificationTypes.PERFECTLY_CLEAR_LOAD_FAILED,
          autoDismiss: 2,
        });
      },
    });
  } catch (e) {
    console.log('showModal-DOWN_WASM_MODAL', e);
    // loadWasm 方法在index.html中挂载到window上
    boundGlobalActions.showGlobalLoading();
    loadWasm()
      .then(async () => {
        await ensurePFCReady();
        boundGlobalActions.hideGlobalLoading();
        boundGlobalActions.showModal(modalTypes.PERFECTLY_CLEAR_MODAL, pfcParams);
      })
      .catch(() => {
        boundGlobalActions.hideGlobalLoading();
        boundGlobalActions.addNotification({
          message: t('PERFECTLY_CLEAR_LOAD_FAILED'),
          level: 'success',
          uid: notificationTypes.PERFECTLY_CLEAR_LOAD_FAILED,
          autoDismiss: 2,
        });
      });
  }
};

export default {
  onOpenAiphotoClick,
  onAiphoto,
  creatAiCollection,
  aiFailedModal,
  creatAiSingle,
};
