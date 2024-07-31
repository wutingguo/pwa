import { get, assign } from 'lodash';
import { NEW_COLLECTION_MODAL, EDIT_MODAL } from '@apps/slide-show/constants/modalTypes';
import { slideshowTutorialVideos } from '@apps/slide-show/constants/strings';
import {
  VIDEO_MODAL_STATUS,
  SHOW_TABLE_PRICE_MODAL,
  PACKAGE_LIST_BOX_MODAL,
  SHARE_SLIDESHOW_MODAL
} from '@resource/lib/constants/modalTypes';
import { saasProducts } from '@resource/lib/constants/strings';
import { fromJS } from 'immutable';
import fbqLogEvent from '@resource/lib/utils/saasfbqLogEvent';

/**
 * 点击card，跳转详情
 * @param {*} that
 * @param {*} id
 */
const handleClick = (that, id) => {
  window.logEvent.addPageEvent({
    name: 'SlideshowsList_EditSlideshow'
  });

  const { history, boundProjectActions, postCardList } = that.props;
  const defaultPostCard = postCardList.find(item => item.get('is_default') === true);
  const defaultPostCardId = defaultPostCard ? defaultPostCard.get('id') : 0;

  boundProjectActions.resetDetail();
  if (!__isCN__) history.push(`/software/slide-show/collection/${id}/photos`);

  // 创建collection时,添加默认名片
  if (__isCN__) {
    boundProjectActions
      .setPostCard({
        project_id: id,
        visiting_card_id: defaultPostCardId
      })
      .then(() => {
        history.push(`/software/slide-show/collection/${id}/photos`);
      });
  }
};

/**
 * 创建 collection
 * @param {*} that
 */
const handleCreate = that => {
  const { boundGlobalActions, boundProjectActions, storageStatus, history, userInfo } = that.props;

  window.logEvent.addPageEvent({
    name: 'SlideshowsList_AddNewSlideshow'
  });
  fbqLogEvent('click_Create', 'ws_slideshow', userInfo);

  const {
    hideModal,
    showModal,
    hideConfirm,
    showConfirm,
    addNotification,
    getMySubscription
  } = boundGlobalActions;
  const { createSlideshow } = boundProjectActions;
  const reachStorageLimit = storageStatus.get('reachStorageLimit');

  const confirmData = {
    className: 'creat-slideshow-limit-modal',
    close: hideConfirm,
    title: '',
    message: t('SLIDESHOW_COPY_CREATE_LIMIT_TIP'),
    buttons: [
      {
        className: 'white pwa-btn',
        text: t('CANCEL'),
        onClick: () => {
          window.logEvent.addPageEvent({
            name: 'SlideshowsList_UpperLimitPromptPop_Cancel'
          });

          hideConfirm();
        }
      },
      {
        className: 'pwa-btn',
        text: t('SLIDESHOW_UPGRADE_BTN'),
        onClick: () => {
          window.logEvent.addPageEvent({
            name: 'SlideshowsList_UpperLimitPromptPop_Upgrade'
          });

          location.href = `/saascheckout.html?from=saas&product_id=${saasProducts.slideshow}`;
        }
      }
    ]
  };

  if (reachStorageLimit) {
    showConfirm(confirmData);
    return;
  }

  const data = {
    title: t('CREATE_NEW_SLIDESHOW'),
    message: t('SLIDESHOW_NAME'),
    placeholder: t('SLIDESHOW_NAME_PLACEHOLDER'),
    requiredTip: t('CREATE_SLIDESHOW_REQUIRED_TIP'),
    illegalTip: t('CREATE_SLIDESHOW_ILLEGAL_TIP'),
    handleSave: inputValue => {
      window.logEvent.addPageEvent({
        name: 'SlideshowsNewSlideshow_Click_Create'
      });

      createSlideshow(inputValue)
        .then(response => {
          const { ret_code } = response;
          if (ret_code === 200000) {
            hideModal(NEW_COLLECTION_MODAL);
            getMySubscription();
            const id = get(response, 'data.id');
            if (id) {
              handleClick(that, id);
            }
          } else {
            // error handler
            if (ret_code === 409320) {
              return;
            }
            if (ret_code === 400313) {
              hideModal(NEW_COLLECTION_MODAL);
              showConfirm(confirmData);
            }
          }
        })
        .catch(error => {
          console.log('error: ', error);
        });
    },
    handleCancel: () => {
      window.logEvent.addPageEvent({
        name: 'SlideshowsNewSlideshow_Click_Cancel'
      });

      hideModal(NEW_COLLECTION_MODAL);
    },
    close: () => {
      hideModal(NEW_COLLECTION_MODAL);
    }
  };

  showModal(NEW_COLLECTION_MODAL, data);
};

/**
 * 编辑 collection
 * @param {*} that
 * @param {*} item
 */

const handleEdit = (that, item) => {
  window.logEvent.addPageEvent({
    name: 'SlideshowsList_Pull-downMenu_QuickEdit'
  });

  const { boundGlobalActions, boundProjectActions } = that.props;

  const { addNotification, hideModal, showModal } = boundGlobalActions;
  const { updateSlideshow } = boundProjectActions;

  const slideshowUid = item.get('id');
  const slideshowName = item.get('slides_name');
  const data = {
    title: t('EDIT_SLIDESHOW'),
    cancelText: t('CANCEL'),
    confirmText: t('SAVE'),
    initialValue: slideshowName,
    message: t('SLIDESHOW_NAME'),
    requiredTip: t('CREATE_SLIDESHOW_REQUIRED_TIP'),
    illegalTip: t('CREATE_SLIDESHOW_ILLEGAL_TIP'),
    handleSave: inputValue => {
      window.logEvent.addPageEvent({
        name: 'SlideshowsEditSlideshow_Click_Save'
      });

      updateSlideshow(slideshowUid, inputValue).then(
        response => {
          const { ret_code } = response;
          if (ret_code === 200000) {
            addNotification({
              message: t('SLIDESHOW_UPDATE_SUCCESSED_TOAST', { slideshowName }),
              level: 'success',
              autoDismiss: 2
            });

            // 编辑名称需要更新当前collection的状态及版本
            boundProjectActions.getSlideshowList();

            hideModal(EDIT_MODAL);
          } else {
            // error handler
            if (ret_code === 409320) {
              return;
            }
            addNotification({
              message: t('SLIDESHOW_UPDATE_FAILED_TOAST', { slideshowName }),
              level: 'error',
              autoDismiss: 2
            });
          }
        },
        err => {
          console.log(err);
          addNotification({
            message: t('SLIDESHOW_UPDATE_FAILED_TOAST', { slideshowName }),
            level: 'error',
            autoDismiss: 2
          });
        }
      );
    },
    handleCancel: () => {
      window.logEvent.addPageEvent({
        name: 'SlideshowsEditSlideshow_Click_Cancel'
      });

      hideModal(EDIT_MODAL);
    },
    close: () => hideModal(EDIT_MODAL)
  };

  showModal(EDIT_MODAL, data);
};

/**
 * 删除 collection
 * @param {*} that
 * @param {*} slideshowUid
 */
const handleDelete = (that, item, cb) => {
  window.logEvent.addPageEvent({
    name: 'SlideshowsList_Pull-downMenu_Delete'
  });

  const { boundGlobalActions, boundProjectActions, collectionList } = that.props;

  const { addNotification, hideConfirm, showConfirm, getMySubscription } = boundGlobalActions;
  const { deleteSlideshow } = boundProjectActions;
  const slideshowUid = item.get('id');
  const slideshowName = item.get('slides_name');

  const data = {
    className: 'delete-collection-modal',
    close: hideConfirm,
    title: `${t('DELETE_SLIDESHOW')}?`,
    message: t('DELETE_SLIDESHOW_TIP'),
    buttons: [
      {
        className: 'white pwa-btn',
        text: t('CANCEL'),
        onClick: () => {
          window.logEvent.addPageEvent({
            name: 'DeleteSlideshow_Click_Cancel'
          });

          hideConfirm();
        }
      },
      {
        className: 'pwa-btn',
        text: t('DELETE'),
        onClick: () => {
          window.logEvent.addPageEvent({
            name: 'DeleteSlideshow_Click_Delete'
          });

          deleteSlideshow(slideshowUid).then(
            response => {
              const { ret_code } = response;
              if (ret_code === 200000) {
                getMySubscription();
                addNotification({
                  message: t('SLIDESHOW_DELETE_SUCCESSED_TOAST', { slideshowName }),
                  level: 'success',
                  autoDismiss: 2
                });
                that.setState({
                  isShowEmptyContent: collectionList.size === 1
                });
              } else {
                // console.log('error: ', error);
                addNotification({
                  message: t('SLIDESHOW_DELETE_FAILED_TOAST', { slideshowName }),
                  level: 'error',
                  autoDismiss: 2
                });
              }
              hideConfirm();
            },
            error => {
              console.log('error: ', error);
              addNotification({
                message: t('SLIDESHOW_DELETE_FAILED_TOAST', { slideshowName }),
                level: 'error',
                autoDismiss: 2
              });
            }
          );
        }
      }
    ]
  };
  showConfirm(data);
};

/**
 * 复制
 * @param {*} that
 * @param {*} item
 */
const handleCopy = (that, item) => {
  window.logEvent.addPageEvent({
    name: 'SlideshowsList_Pull-downMenu_Copy'
  });

  const { boundGlobalActions, boundProjectActions, storageStatus, history } = that.props;

  const {
    addNotification,
    hideModal,
    showModal,
    hideConfirm,
    showConfirm,
    getMySubscription
  } = boundGlobalActions;
  const { copySlideshow } = boundProjectActions;

  const slideshowUid = item.get('id');
  const slideshowName = item.get('slides_name');

  const reachStorageLimit = storageStatus.get('reachStorageLimit');

  if (reachStorageLimit) {
    console.log('limit');
    const confirmData = {
      className: 'creat-slideshow-limit-modal',
      close: hideConfirm,
      title: '',
      message: t('SLIDESHOW_COPY_CREATE_LIMIT_TIP'),
      buttons: [
        {
          className: 'white pwa-btn',
          text: t('CANCEL'),
          onClick: () => {
            window.logEvent.addPageEvent({
              name: 'SlideshowsList_UpperLimitPromptPop_Cancel'
            });

            hideConfirm();
          }
        },
        {
          className: 'pwa-btn',
          text: t('SLIDESHOW_UPGRADE_BTN'),
          onClick: () => {
            window.logEvent.addPageEvent({
              name: 'SlideshowsList_UpperLimitPromptPop_Upgrade'
            });

            location.href = `/saascheckout.html?from=saas&product_id=${saasProducts.slideshow}`;
          }
        }
      ]
    };
    showConfirm(confirmData);
    return;
  }

  const data = {
    title: t('CLONE_SLIDESHOW'),
    cancelText: t('CANCEL'),
    confirmText: t('COPY'),
    initialValue: `Copy-${slideshowName}`,
    message: t('SLIDESHOW_NAME'),
    requiredTip: t('CREATE_SLIDESHOW_REQUIRED_TIP'),
    illegalTip: t('CREATE_SLIDESHOW_ILLEGAL_TIP'),
    handleSave: inputValue => {
      window.logEvent.addPageEvent({
        name: 'SlideshowsCopySlideshow_Click_Copy'
      });

      copySlideshow(slideshowUid, inputValue).then(
        response => {
          const { ret_code } = response;
          if (ret_code === 200000) {
            getMySubscription();
            // addNotification({
            //   message: t('SLIDESHOW_CLONE_SUCCESSED_TOAST', {slideshowName}),
            //   level: 'success',
            //   autoDismiss: 2
            // });
            const id = get(response, 'data.id');
            if (id) {
              handleClick(that, id);
            }
            hideModal(EDIT_MODAL);
          } else {
            // error handler
            if (ret_code === 409320) {
              return;
            }
            addNotification({
              message: t('SLIDESHOW_CLONE_FAILED_TOAST', { slideshowName }),
              level: 'error',
              autoDismiss: 2
            });
          }
        },
        err => {
          console.log(err);
          addNotification({
            message: t('SLIDESHOW_CLONE_FAILED_TOAST', { slideshowName }),
            level: 'error',
            autoDismiss: 2
          });
        }
      );
    },
    handleCancel: () => {
      window.logEvent.addPageEvent({
        name: 'SlideshowsCopySlideshow_Click_Cancel'
      });

      hideModal(EDIT_MODAL);
    },
    close: () => hideModal(EDIT_MODAL)
  };

  showModal(EDIT_MODAL, data);
};

/**
 * 下载分享
 * @param {*} that
 * @param {*} item
 * @param {*} shareSlideshowTabKey
 */
const handleDownloadAndShare = (that, item, shareSlideshowTabKey) => {
  const { boundGlobalActions, boundProjectActions, history } = that.props;
  const { addNotification, hideModal, showModal } = boundGlobalActions;
  const {
    getSlideshowShareUrl,
    getResolutionOptions,
    getSlideshowDownloadUrl,
    getResolutionStatus
  } = boundProjectActions;

  const slideshowUid = item.get('id');
  const slideName = item.get('slides_name');
  const data = {
    history,
    title: t('SLIDESHOW_SHARE_TITLE'),
    slideName,
    projectId: slideshowUid,
    shareSlideshowTabKey,
    getSlideshowDownloadUrl,
    handleCancel: () => hideModal(EDIT_MODAL),
    close: () => hideModal(SHARE_SLIDESHOW_MODAL)
  };

  // 获取分享链接、视频套餐列表
  Promise.all([
    getSlideshowShareUrl(slideshowUid),
    getResolutionOptions(),
    getResolutionStatus({ project_id: slideshowUid, definition: 1 })
  ]).then(responses => {
    // Link
    const shareResponse = responses[0];
    const { data: shareDirectLink } = shareResponse;

    // Download
    let resolutionResponse = responses[1];
    const { data: resolutionData } = resolutionResponse;

    const makeVideoResponse = responses[2];
    const { data: makeVideoStatus } = makeVideoResponse;

    assign(data, {
      shareDirectLink: shareDirectLink,
      resolutionData: fromJS(resolutionData)
      // makeVideoStatus
    });
    showModal(SHARE_SLIDESHOW_MODAL, data);
  });
};

const handleUpgrade = that => {
  window.logEvent.addPageEvent({
    name: 'Slideshows_UpperLimitPromptTip_Upgrade'
  });
};

const openTutorialVideo = (that, type) => {
  window.logEvent.addPageEvent({
    name: `Slideshow_Click_Tutorial0${type}`
  });
  const { boundGlobalActions } = that.props;
  const { showModal } = boundGlobalActions;

  showModal(VIDEO_MODAL_STATUS, {
    className: 'slideshow-tutorial-wrapper',
    groupVideos: slideshowTutorialVideos
  });
};

// 打开 galerry 价格表
const openTablePriceModal = (that, data) => {
  const { boundGlobalActions } = that.props;
  const { showModal } = boundGlobalActions;
  const { priceData, tableTitle = '', product_id = '' } = data;
  showModal(PACKAGE_LIST_BOX_MODAL, {
    className: 'gallery-tutorial-wrapper',
    priceData,
    tableTitle,
    product_id
  });
};

export default {
  handleClick,
  handleCreate,
  handleEdit,
  handleDelete,
  handleCopy,
  handleDownloadAndShare,
  handleUpgrade,
  openTutorialVideo,
  openTablePriceModal
};
