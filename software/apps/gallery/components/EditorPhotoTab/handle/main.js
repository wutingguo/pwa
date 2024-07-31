import { fromJS } from 'immutable';

import { EDIT_MODAL, NEW_COLLECTION_MODAL } from '@apps/gallery/constants/modalTypes';

/**
 * 编辑 set
 * @param {*} item
 * @param {*} that
 */
export function handleRenameSet(item, that) {
  window.logEvent.addPageEvent({
    name: 'GalleryPhotos_Click_EditSet',
  });

  const { params = {}, boundGlobalActions, boundProjectActions } = that.props;
  const { showModal, hideModal, addNotification } = boundGlobalActions;
  const { renameCollectionSet } = boundProjectActions;

  const collcetion_uid = params.id;
  const [set_uid, set_name] = [item.get('set_uid'), item.get('set_name')];

  const data = {
    initialValue: set_name,
    title: t('EDIT_PHOTO_SET'),
    message: t('PHOTO_SET_NAME'),
    requiredTip: t('PHOTO_NAME_REQUIRED_TIP'),
    illegalTip: t('CREATE_COLLECTION_ILLEGAL_TIP'),
    handleSave: inputValue => {
      window.logEvent.addPageEvent({
        name: 'GalleryEditSet_Click_Save',
      });
      renameCollectionSet({ collcetion_uid, set_uid, set_name: inputValue }).then(
        response => {
          const { ret_code } = response;
          if (ret_code === 200000) {
            hideModal(EDIT_MODAL);
            addNotification({
              message: t('RENAME_PHOTO_SET_SUCCESSED'),
              level: 'success',
              autoDismiss: 2,
            });
          } else {
            // error handler
            if (ret_code === 420304) {
              return;
            }
            addNotification({
              message: t('RENAME_PHOTO_SET_FAILED'),
              level: 'error',
              autoDismiss: 2,
            });
          }
        },
        error => {
          console.log('error: ', error);
          addNotification({
            message: t('RENAME_PHOTO_SET_FAILED'),
            level: 'error',
            autoDismiss: 2,
          });
        }
      );
    },
    handleCancel: () => {
      window.logEvent.addPageEvent({
        name: 'GalleryEditSet_Click_Cancel',
      });
      hideModal(EDIT_MODAL);
    },
    close: () => {
      window.logEvent.addPageEvent({
        name: 'GalleryEditSet_Click_Close',
      });
      hideModal(EDIT_MODAL);
    },
  };

  showModal(EDIT_MODAL, data);
}

/**
 * 删除 set
 * @param {*} that
 * @param {*} collectionUid
 */
export function handleDeleteSet(item, that) {
  window.logEvent.addPageEvent({
    name: 'GalleryPhoto_Click_DeleteSet',
  });

  const { boundGlobalActions, boundProjectActions, params } = that.props;

  const { addNotification, hideConfirm, showConfirm, getMySubscription } = boundGlobalActions;
  const { deleteSet } = boundProjectActions;

  const setUid = item.get('set_uid');
  const setName = item.get('set_name');

  const data = {
    className: 'delete-collection-set-modal',
    close: () => {
      // window.logEvent.addPageEvent({
      //   name: 'GalleryDeleteSet_Click_Close'
      // });

      hideConfirm();
    },
    title: `${t('DELETE_PHOTO_SET')}?`,
    message: t('DELETE_PHOTO_SET_TIP'),
    buttons: [
      {
        className: 'white pwa-btn',
        text: t('CANCEL'),
        onClick: () => {
          window.logEvent.addPageEvent({
            name: 'GalleryDeleteSet_Click_Cancel',
          });

          hideConfirm();
        },
      },
      {
        className: 'pwa-btn',
        text: t('DELETE'),
        onClick: () => {
          window.logEvent.addPageEvent({
            name: 'GalleryDeleteSet_Click_Delete',
          });

          deleteSet(setUid).then(
            response => {
              const { ret_code } = response;
              if (ret_code === 200000) {
                getMySubscription && getMySubscription();
                const { items } = that.props;
                const firstSetUid = items.getIn(['0', 'set_uid']);
                handleSetSelect({ key: firstSetUid }, that);
                addNotification({
                  message: t('DELETE_PHOTO_SET_SUCCESSED', { setName }),
                  level: 'success',
                  autoDismiss: 2,
                });
              } else {
                // error handler
                addNotification({
                  message: t('DELETE_PHOTO_SET_FAILED', { setName }),
                  level: 'error',
                  autoDismiss: 2,
                });
              }

              hideConfirm();
            },
            error => {
              console.log(error);
              addNotification({
                message: t('DELETE_PHOTO_SET_FAILED', { setName }),
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
}

/**
 * 新增 set
 * @param {*} that
 */
export function handleAddSet(that) {
  window.logEvent.addPageEvent({
    name: 'GalleryPhotos_Click_AddSet',
  });

  const { params = {}, boundGlobalActions, boundProjectActions } = that.props;
  const collcetion_uid = params.id;
  const { hideModal, showModal, addNotification, getMySubscription } = boundGlobalActions;
  const { createSet } = boundProjectActions;
  const data = {
    title: t('CREATE_NEW_SET'),
    message: t('PHOTO_SET_NAME'),
    requiredTip: t('PHOTO_NAME_REQUIRED_TIP'),
    illegalTip: t('CREATE_COLLECTION_ILLEGAL_TIP'),
    handleSave: inputValue => {
      window.logEvent.addPageEvent({
        name: 'GalleryCreateSet_Click_Create',
      });
      createSet(collcetion_uid, inputValue).then(
        response => {
          const { ret_code } = response;
          if (ret_code === 200000) {
            hideModal(NEW_COLLECTION_MODAL);
            getMySubscription && getMySubscription();
            addNotification({
              message: t('ADD_PHOTO_SET_SUCCESSED', { setName: inputValue }),
              level: 'success',
              autoDismiss: 2,
            });
            const {
              data: { set_uid },
            } = response;
            handleSetSelect({ key: set_uid }, that);
          } else {
            // error handler
            if (ret_code === 420304) {
              return;
            }
            addNotification({
              message: t('ADD_PHOTO_SET_FAILED', { setName: inputValue }),
              level: 'error',
              autoDismiss: 2,
            });
          }
        },
        error => {
          addNotification({
            message: t('ADD_PHOTO_SET_FAILED', { setName: inputValue }),
            level: 'success',
            autoDismiss: 2,
          });
        }
      );
    },
    handleCancel: () => {
      window.logEvent.addPageEvent({
        name: 'GalleryCreateSet_Click_Cancel',
      });

      hideModal(NEW_COLLECTION_MODAL);
    },
    close: () => {
      window.logEvent.addPageEvent({
        name: 'GalleryCreateSet_Click_Close',
      });
      hideModal(NEW_COLLECTION_MODAL);
    },
  };
  showModal(NEW_COLLECTION_MODAL, data);
}

/**
 * 切换 set
 * @param {*} item
 * @param {*} that
 */
export function handleSetSelect(item, that) {
  window.logEvent.addPageEvent({
    name: 'GalleryPhotos_Click_Set',
  });

  const { key: setUid } = item;
  const { boundProjectActions, params, collectionDetail } = that.props;
  const { getSetPhotoList, changeSelectedSet, setDetailContentLoading, getSetVideoInfo } =
    boundProjectActions;
  const { id: collectionUid } = params;
  setDetailContentLoading({ loading: true });
  changeSelectedSet(setUid);
  getSetVideoInfo({
    collection_set_id: setUid,
  }).then(videoInfo => {
    const { video_source, video_id } = videoInfo;
    if (video_source === 2) {
      boundProjectActions.getSlideshowInfo(video_id);
    }
  });
  getSetPhotoList(collectionUid, setUid)
    .then(response => {
      console.log('response: ', response);
      setDetailContentLoading({ loading: false });
    })
    .catch(err => {});
}

/**
 * set 拖拽排序
 * @param {*} result
 * @param {*} that
 */
export function handleDragEnd(result, that) {
  window.logEvent.addPageEvent({
    name: 'GalleryExchangeSetOrder_Click_Exchange',
  });

  const { boundProjectActions, boundGlobalActions, items } = that.props;
  const { orderingSet, updateSetListOrder } = boundProjectActions;
  const { addNotification } = boundGlobalActions;
  console.log('result: ', result);

  if (!result.destination) {
    return;
  }

  const sourceIndex = result.source.index;
  const destinationIndex = result.destination.index;

  const sourceSet = items.get(sourceIndex);

  const convertSets = items.remove(sourceIndex).splice(destinationIndex, 0, sourceSet);

  const setUids = [];
  convertSets.map(item => setUids.push(item.get('set_uid')));

  console.log('sets: ', items.toJS());
  console.log('convertSets: ', convertSets.toJS());

  updateSetListOrder(convertSets);
  orderingSet(setUids)
    .then(response => {
      const { ret_code } = response;
      if (ret_code === 200000) {
        addNotification({
          message: t('SORT_PHOTO_SET_SUCCESSED'),
          level: 'success',
          autoDismiss: 2,
        });
      } else {
        // error handler
        addNotification({
          message: t('SORT_PHOTO_SET_FAILED'),
          level: 'error',
          autoDismiss: 2,
        });
        updateSetListOrder(items);
      }
    })
    .catch(err => {
      addNotification({
        message: t('SORT_PHOTO_SET_FAILED'),
        level: 'error',
        autoDismiss: 2,
      });
    });
}
