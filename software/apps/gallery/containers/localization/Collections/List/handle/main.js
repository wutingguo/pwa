import { get } from 'lodash';

import { EDIT_MODAL, NEW_COLLECTION_MODAL } from '@apps/gallery/constants/modalTypes';

/**
 * 点击card，跳转详情
 * @param {*} that
 * @param {*} id
 */
const handleClick = (that, id) => {
  const { history, boundProjectActions, boundGlobalActions } = that.props;

  boundProjectActions.resetDetail();
  history.push(`/software/gallery/collection/${id}/photos`);
};

/**
 * 创建 collection
 * @param {*} that
 */
const handleCreate = that => {
  const { boundGlobalActions, boundProjectActions, userAuth, urls, history } = that.props;
  const { hideModal, showModal, addNotification, getMySubscription } = boundGlobalActions;
  const { createCollection } = boundProjectActions;
  const { maxOrdering } = that.state;
  const data = {
    title: t('CREATE_NEW_COLLECTION'),
    message: t('COLLECTION_NAME'),
    eventDatemessage: '事件日期',
    eventDatePlaceholder: '选择日期（选填）',
    showEventDate: true,
    requiredTip: t('CREATE_COLLECTION_REQUIRED_TIP'),
    illegalTip: t('CREATE_COLLECTION_ILLEGAL_TIP'),
    userAuth,
    urls,
    boundProjectActions,
    history,
    showSelectPreset: true,
    handleSave: (inputValue, template_id, event_time) => {
      window.logEvent.addPageEvent({
        name: 'GallerynewCollection_Click_Create',
      });

      createCollection(inputValue, true, template_id, maxOrdering + 1, event_time)
        .then(response => {
          const { ret_code } = response;
          if (ret_code === 200000) {
            that.setState({
              maxOrdering: maxOrdering + 1,
            });
            hideModal(NEW_COLLECTION_MODAL);
            getMySubscription && getMySubscription();
            const enc_collection_uid = get(response, 'data.enc_collection_uid');
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
      window.logEvent.addPageEvent({
        name: 'GallerynewCollection_Click_Cancel',
      });

      hideModal(NEW_COLLECTION_MODAL);
    },
    close: () => {
      hideModal(NEW_COLLECTION_MODAL);
    },
  };

  showModal(NEW_COLLECTION_MODAL, data);
};

/**
 * 编辑 collection
 * @param {*} that
 * @param {*} item
 */

const handleEdit = (that, item) => {
  const { boundGlobalActions, boundProjectActions } = that.props;

  const { addNotification, hideModal, showModal } = boundGlobalActions;
  const { updateCollection } = boundProjectActions;

  const collectionUid = item.get('enc_collection_uid');
  const collectionName = item.get('collection_name');
  const data = {
    title: t('EDIT_COLLECTION'),
    cancelText: t('CANCEL'),
    confirmText: t('SAVE'),
    initialValue: collectionName,
    message: t('COLLECTION_NAME'),
    requiredTip: t('CREATE_COLLECTION_REQUIRED_TIP'),
    illegalTip: t('CREATE_COLLECTION_ILLEGAL_TIP'),
    handleSave: inputValue => {
      updateCollection(collectionUid, inputValue).then(
        response => {
          const { ret_code } = response;
          if (ret_code === 200000) {
            addNotification({
              message: t('COLLECTION_UPDATE_SUCCESSED_TOAST', { collectionName }),
              level: 'success',
              autoDismiss: 2,
            });
            hideModal(EDIT_MODAL);
          } else {
            // error handler
            if (ret_code === 420303) {
              return;
            }
            addNotification({
              message: t('COLLECTION_UPDATE_FAILED_TOAST', { collectionName }),
              level: 'error',
              autoDismiss: 2,
            });
          }
        },
        err => {
          console.log(err);
          addNotification({
            message: t('COLLECTION_UPDATE_FAILED_TOAST', { collectionName }),
            level: 'error',
            autoDismiss: 2,
          });
        }
      );
    },
    handleCancel: () => hideModal(EDIT_MODAL),
    close: () => hideModal(EDIT_MODAL),
  };

  showModal(EDIT_MODAL, data);
};

/**
 * 删除 collection
 * @param {*} that
 * @param {*} collectionUid
 */
const handleDelete = (that, item, cb) => {
  window.logEvent.addPageEvent({
    name: 'GalleryCollection_Click_Delete',
  });

  const { boundGlobalActions, boundProjectActions, collectionList } = that.props;
  const {
    paginationInfo: { current_page },
    searchText,
  } = that.state;
  const { addNotification, hideConfirm, showConfirm, getMySubscription } = boundGlobalActions;
  const { deleteCollection, getCollectionList } = boundProjectActions;
  const collectionUid = item.get('enc_collection_uid');
  const collectionName = item.get('collection_name');

  const data = {
    className: 'delete-collection-modal delete',
    close: hideConfirm,
    title: `${t('DELETE_COLLECTION')}?`,
    message: t('DELETE_COLLECTION_TIP'),
    buttons: [
      {
        className: 'white pwa-btn',
        text: t('CANCEL'),
        onClick: () => {
          window.logEvent.addPageEvent({
            name: 'GalleryDeleteCollection_Click_Cancel',
          });

          hideConfirm();
        },
      },
      {
        className: 'pwa-btn',
        text: t('DELETE'),
        onClick: () => {
          window.logEvent.addPageEvent({
            name: 'GalleryDeleteCollection_Click_Delete',
          });

          deleteCollection(collectionUid).then(
            response => {
              const { ret_code } = response;
              if (ret_code === 200000) {
                addNotification({
                  message: t('COLLECTION_DELETE_SUCCESSED_TOAST', { collectionName }),
                  level: 'success',
                  autoDismiss: 2,
                });
                if (current_page !== 1 && collectionList.size === 1) {
                  that.getCollectionList(searchText, current_page - 1);
                  return;
                }
                that.getCollectionList(searchText, current_page);
                that.setState({
                  isShowEmptyContent: collectionList.size === 1,
                });
              } else {
                // error handler
                addNotification({
                  message: t('COLLECTION_DELETE_FAILED_TOAST', { collectionName }),
                  level: 'error',
                  autoDismiss: 2,
                });
              }
              hideConfirm();
            },
            error => {
              console.log(error);

              addNotification({
                message: t('COLLECTION_DELETE_FAILED_TOAST', { collectionName }),
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

export default {
  handleClick,
  handleCreate,
  handleEdit,
  handleDelete,
};
