import pathToRegexp from 'path-to-regexp';
import { EDIT_MODAL } from '@apps/slide-show/constants/modalTypes';

export function handleRenameCover() {
  const { params = {}, collectionDetail, boundGlobalActions, boundProjectActions } = this.props;
  const slideshowUid = params.id;
  const { showModal, hideModal, addNotification } = boundGlobalActions;
  const { updateSlideshow } = boundProjectActions;
  const data = {
    initialValue: collectionDetail.get('name'),
    title: t('EDIT_SLIDESHOW'),
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
              message: t('SLIDESHOW_UPDATE_SUCCESSED_TOAST', { slideshowName: inputValue }),
              level: 'success',
              autoDismiss: 2
            });

            // TODO: 重命名，需要更新slideshow状态
            boundProjectActions.saveSlideshow();

            hideModal(EDIT_MODAL);
          } else {
            // error handler
            if (ret_code === 409320) {
              return;
            }
            addNotification({
              message: t('SLIDESHOW_UPDATE_FAILED_TOAST', { slideshowName: inputValue }),
              level: 'error',
              autoDismiss: 2
            });
          }
        },
        err => {
          console.log(err);
          addNotification({
            message: t('SLIDESHOW_UPDATE_FAILED_TOAST', { slideshowName: inputValue }),
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
}

export function getCurrentSidebarKey(pathname, tabsConfig) {
  let currentTabIndex = 0,
    selectedKeys;
  const l = tabsConfig.length;
  // 根据路径匹配设置 currentTabIndex
  for (let i = 0; i < l; i++) {
    const { key, tabIndex, path } = tabsConfig[i];
    const match = pathToRegexp(path).exec(pathname);
    if (match) {
      currentTabIndex = tabIndex;
      selectedKeys = [key];
      break;
    }
  }
  return { currentTabIndex, selectedKeys };
}
