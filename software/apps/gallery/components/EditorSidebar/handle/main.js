import pathToRegexp from 'path-to-regexp';
import { EDIT_MODAL } from '@apps/gallery/constants/modalTypes';

export function handleRenameCover() {
  const { params = {}, collectionDetail, boundGlobalActions, boundProjectActions } = this.props;
  const collectionUid = params.id;
  const { showModal, hideModal, addNotification } = boundGlobalActions;
  const { updateCollection, updateCollectionNameInSetting } = boundProjectActions;
  const data = {
    initialValue: collectionDetail.get('collection_name'),
    title: t('EDIT_COLLECTION'),
    message: t('COLLECTION_NAME'),
    requiredTip: t('CREATE_COLLECTION_REQUIRED_TIP'),
    illegalTip: t('CREATE_COLLECTION_ILLEGAL_TIP'),
    handleSave: inputValue => {
      window.logEvent.addPageEvent({
        name: 'SlideshowsEditSlideshow_Click_Save'
      });

      updateCollection(collectionUid, inputValue).then(
        response => {
          const { ret_code } = response;
          if (ret_code === 200000) {
            addNotification({
              message: t('COLLECTION_UPDATE_SUCCESSED_TOAST', { collectionName: inputValue }),
              level: 'success',
              autoDismiss: 2
            });
            updateCollectionNameInSetting(inputValue);
            hideModal(EDIT_MODAL);
          } else {
            // error handler
            // debugger
            if (ret_code === 420303) {
              return;
            }
            addNotification({
              message: t('COLLECTION_UPDATE_FAILED_TOAST', { collectionName: inputValue }),
              level: 'error',
              autoDismiss: 2
            });
          }
        },
        err => {
          console.log(err);
          addNotification({
            message: t('COLLECTION_UPDATE_FAILED_TOAST', { collectionName: inputValue }),
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
    }
  };

  showModal(EDIT_MODAL, data);
}

export function getCurrentSidebarKey(pathname, tabsConfig) {
  let currentTabIndex = 0,
    selectedKeys;
  const l = tabsConfig.length;
  // 根据路径匹配设置 currentTabIndex
  for (let i = 0; i < l; i++) {
    const { key, tabIndex = i, path } = tabsConfig[i];
    const match = pathToRegexp(path).exec(pathname);
    if (match) {
      currentTabIndex = tabIndex;
      selectedKeys = [key];
      break;
    }
  }
  return { currentTabIndex, selectedKeys };
}
