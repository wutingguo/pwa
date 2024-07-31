import { fromJS } from 'immutable';
import { get, truncate } from 'lodash';
import React from 'react';

import { UPLOAD_MODAL, VIDEO_MODAL_STATUS } from '@resource/lib/constants/modalTypes';
import { saasProducts } from '@resource/lib/constants/strings';

import { NEW_COLLECTION_MODAL } from '@apps/aiphoto/constants/modalTypes';
import { retoucherTutorialVideos } from '@apps/aiphoto/constants/strings';

import photoMain from '../../Detail/Photos/handle/main';

/**
 * 点击card，跳转详情
 * @param {*} that
 * @param {*} id
 */
const handleClick = (that, id) => {
  const { history, boundProjectActions } = that.props;

  boundProjectActions.resetDetail();
  history.push(`/software/retoucher/collection/${id}/photos`);
};

/**
 * 创建 collection
 * @param {*} that
 */
const handleCreate = that => {
  const { boundGlobalActions, boundProjectActions } = that.props;
  const { hideModal, showModal, getMySubscription } = boundGlobalActions;
  const { createCollection } = boundProjectActions;

  const data = {
    title: t('CREATE_NEW_COLLECTION'),
    requiredTip: t('AIPHOTO_COLLECTION_REQUIRED_TIP'),
    illegalTip: t('CREATE_COLLECTION_ILLEGAL_TIP'),
    isHideSelect: true,
    handleSave: inputValue => {
      createCollection(inputValue)
        .then(response => {
          const { ret_code } = response;
          if (ret_code === 200000) {
            hideModal(NEW_COLLECTION_MODAL);
            getMySubscription && getMySubscription();
            const enc_collection_uid = get(response, 'data.id');
            if (enc_collection_uid) {
              handleClick(that, enc_collection_uid);
            }
          } else {
            // error handler
            if (ret_code === 420303) {
              return;
            }
          }
        })
        .catch(error => {
          console.log('error: ', error);
        });
    },
    handleCancel: () => {
      hideModal(NEW_COLLECTION_MODAL);
    },
    close: () => {
      hideModal(NEW_COLLECTION_MODAL);
    },
  };

  showModal(NEW_COLLECTION_MODAL, data);
};

const dorpCreate = (that, folderName, foldersFiles) => {
  const { boundGlobalActions, boundProjectActions } = that.props;
  const { getMySubscription } = boundGlobalActions;
  const { createCollection } = boundProjectActions;

  const defaultEffect = 'SYS_TOPIC_BEAUTIFYPLUS'; // 默认一键磨皮
  const name = folderName.substr(0, 50); // 文件名截取前50个字符

  createCollection(name, defaultEffect)
    .then(response => {
      const { ret_code } = response;
      if (ret_code === 200000) {
        getMySubscription && getMySubscription();
        const enc_collection_uid = get(response, 'data.id');
        if (enc_collection_uid) {
          handleClick(that, enc_collection_uid);

          boundProjectActions.addImages(foldersFiles);
          boundGlobalActions.showModal(UPLOAD_MODAL, { collectionId: enc_collection_uid });
        }
      } else {
        // error handler
        if (ret_code === 420303) {
          return;
        }
      }
    })
    .catch(error => {
      console.log('error: ', error);
    });
};

/**
 * 删除 collection
 * @param {*} that
 * @param {*} collectionUid
 */
const handleDelete = (that, collectionUid, collectionName) => {
  const { boundGlobalActions, boundProjectActions } = that.props;

  const { addNotification, hideConfirm, showConfirm } = boundGlobalActions;
  const { deleteCollection } = boundProjectActions;

  const data = {
    className: 'ai-delete-collection-modal',
    close: hideConfirm,
    title: `${t('DELETE_COLLECTION_AI')}?`,
    message: t('DELETE_COLLECTION_AI_TIP'),
    buttons: [
      {
        className: 'white pwa-btn',
        text: t('CANCEL'),
        onClick: () => {
          hideConfirm();
        },
      },
      {
        className: 'pwa-btn',
        text: t('DELETE'),
        onClick: () => {
          deleteCollection(collectionUid).then(
            response => {
              const { ret_code } = response;
              if (ret_code === 200000) {
                that.getCollectionList(1);
                addNotification({
                  message: t('COLLECTION_AI_DELETE_SUCCESSED_TOAST', { collectionName }),
                  level: 'success',
                  autoDismiss: 2,
                });
              } else {
                addNotification({
                  message: t('COLLECTION_AI_DELETE_FAILED_TOAST', { collectionName }),
                  level: 'error',
                  autoDismiss: 2,
                });
              }
              hideConfirm();
            },
            error => {
              console.log(error);
              addNotification({
                message: t('COLLECTION_AI_DELETE_FAILED_TOAST', { collectionName }),
                level: 'error',
                autoDismiss: 2,
              });
            }
          );
        },
      },
    ],
  };
  showConfirm(data);
};

const failedModal = that => {
  const {
    boundGlobalActions: { hideConfirm, showConfirm, showModal, hideModal, getMySubscription },
    urls,
  } = that.props;

  const data = {
    className: 'ai-delete-collection-modal',
    close: hideConfirm,
    // title: `${t('DELETE_COLLECTION_AI')}?`,
    message: t('NOT_HAVE_ENOUGH_CREDITS'),
    buttons: [
      {
        className: 'white pwa-btn',
        text: t('OK'),
        onClick: () => {
          hideConfirm();
        },
      },
      {
        className: 'pwa-btn',
        text: t('ORDER'),
        onClick: () => {
          hideConfirm();
          // let curInfo = (curInfo = aiphotoInfo[1] || {});
          window.location.href = `/saascheckout.html?product_id=${saasProducts.retoucher}&plan_id=30&from=saas`;
          // showModal(SAAS_CHECKOUT_MODAL, {
          //   product_id: saasProducts.aiphoto,
          //   aiphotoParams: {
          //     ...curInfo,
          //     combos: aiphotoInfo.slice(1)
          //   },
          //   level: curInfo.level_id,
          //   cycle: curInfo.cycle_id,
          //   escapeClose: true,
          //   onClosed: () => {
          //     hideModal(SAAS_CHECKOUT_MODAL);
          //     getMySubscription(urls.get('saasBaseUrl'));
          //   }
          // });
        },
      },
    ],
  };
  showConfirm(data);
};

//发起修图
const startCollectionImage = async (that, opt) => {
  const {
    isPart = false, //是否是部分修图
    collectionDetail,
    imageCount,
    collection_id,
    enc_image_uid,
  } = opt;
  const {
    boundGlobalActions: { addNotification, showModal, hideModal },
    boundProjectActions: {
      startCollectionImageAction,
      updateCollectionStatus,
      getPfcTopicEffects,
      handleClearSelectImg,
    },
  } = that.props;

  const photos = collectionDetail ? collectionDetail.get('photos') : fromJS({});
  const selectedImgList = photos.get('selectedImgList');
  const selectedCount = isPart ? selectedImgList.size : imageCount;

  if (selectedCount < 1) {
    addNotification({
      message: t('NOT_SELECTED_PHOTOS'),
      level: 'success',
      autoDismiss: 3,
    });
    return false;
  }

  if (selectedCount === 1) {
    // const selectedImageId =
    //   selectedImgList.size > 0 ? selectedImgList.getIn([0, 'enc_image_id']) : '';
    let selectedImageId = '';
    if (imageCount === 1) {
      const res = await that.getCollectionDetail(collection_id);
      selectedImageId = enc_image_uid;
    } else {
      selectedImageId = selectedImgList.size > 0 ? selectedImgList.getIn([0, 'enc_image_id']) : '';
    }
    photoMain.toAiClick(
      that,
      {
        selectedImageId,
      },
      () => {
        handleClearSelectImg();
      }
    );
    return false;
  }

  const hasCorrect = isPart && selectedImgList.filter(i => +i.get('correct_status') === 1).size > 0;
  if (hasCorrect) {
    addNotification({
      message: t('SELECTED_PHOTOS_BING_RETOUCHED'),
      level: 'success',
      autoDismiss: 3,
    });
    return false;
  }

  showModal(NEW_COLLECTION_MODAL, {
    title: t('READY_FOR_RETOUCHING'),
    effectsList: fromJS([]),
    categoryList: fromJS([]),
    isHideInput: true,
    getPfcTopicEffects,
    okBtnText: t('CONTINUE'),
    handleCancel: () => {
      hideModal(NEW_COLLECTION_MODAL);
    },
    close: () => {
      hideModal(NEW_COLLECTION_MODAL);
    },
    handleSave: ({ topic_code }) => {
      const image_uids = isPart && selectedImgList.map(i => i.get('enc_image_id')).toJS();
      hideModal(NEW_COLLECTION_MODAL);
      startCollectionImageAction(collection_id, topic_code, image_uids).then(
        response => {
          const { ret_code } = response;
          if (ret_code === 200000) {
            updateCollectionStatus(1);
            addNotification({
              message: t('RETOUCHING_STARTED'),
              level: 'success',
              autoDismiss: 2,
            });
          } else if (ret_code === 400313) {
            failedModal(that);
          } else {
            addNotification({
              message: t('RETOUCH_FAILED'),
              level: 'error',
              autoDismiss: 2,
            });
          }

          if (isPart) {
            handleClearSelectImg();
          }
        },
        error => {
          console.log(error);
          addNotification({
            message: t('RETOUCH_FAILED'),
            level: 'error',
            autoDismiss: 2,
          });
        }
      );
    },
  });
};

const endCollectionImage = (that, collectionUid, collectionName) => {
  const {
    boundGlobalActions: {
      addNotification,
      hideConfirm,
      showConfirm,
      showGlobalLoading,
      hideGlobalLoading,
    },
    boundProjectActions: { endCollectionImageAction },
  } = that.props;

  const data = {
    className: 'ai-delete-collection-modal',
    close: hideConfirm,
    message: t('PAUSE_RETOUCH_TIP'),
    buttons: [
      {
        className: 'white pwa-btn',
        text: t('CANCEL'),
        onClick: () => {
          hideConfirm();
        },
      },
      {
        className: 'pwa-btn',
        text: t('OK'),
        onClick: () => {
          showGlobalLoading();
          endCollectionImageAction(collectionUid).then(
            response => {
              const { ret_code } = response;
              setTimeout(() => {
                hideGlobalLoading();
                if (ret_code === 200000) {
                  addNotification({
                    message: t('RETOUCHING_PAUSED'),
                    level: 'success',
                    autoDismiss: 2,
                  });
                } else {
                  addNotification({
                    message: t('PAUSED_RETOUCHING_FAILED'),
                    level: 'error',
                    autoDismiss: 2,
                  });
                }
              }, 3000);
            },
            error => {
              console.log(error);
              addNotification({
                message: t('PAUSED_RETOUCHING_FAILED'),
                level: 'error',
                autoDismiss: 2,
              });
            }
          );
        },
      },
    ],
  };
  showConfirm(data);
};

const downCollectionImage = (that, collectionUid, collectionName) => {
  const { urls } = that.props;
  const url = urls.get('saasBaseUrl');
  // window.open(`${url}software/retoucher/download?collectionUid=${collectionUid}`, '__blank');
  window.open(
    `${url}software/retoucher/download?collectionUid=${collectionUid}&collectionName=${collectionName}`
  );
};

const openTutorialVideo = (that, type) => {
  window.logEvent.addPageEvent({
    name: `Retoucher_Click_Tutorial0${type}`,
  });
  const { boundGlobalActions } = that.props;
  const { showModal } = boundGlobalActions;

  showModal(VIDEO_MODAL_STATUS, {
    className: 'slideshow-tutorial-wrapper',
    groupVideos: retoucherTutorialVideos,
  });
};

export default {
  handleClick,
  handleCreate,
  handleDelete,
  startCollectionImage,
  endCollectionImage,
  downCollectionImage,
  dorpCreate,
  openTutorialVideo,
};
