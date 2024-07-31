import { fromJS } from 'immutable';

import Toast from '@apps/dashboard-mobile/components/vant/Toast';

/**
 * 更新 settings
 * @param {*} that
 * @param {*} settingItem
 */
const addNotification = ({ message }) => {
  // Toast(message);
};
const updateSettings = (that, favorite, setting, checked) => {
  const { collectionsSettings = fromJS({}), boundProjectActions, boundGlobalActions } = that.props;
  //   const { collectionsSettings = fromJS({}) } = collectionList;
  // const { addNotification } = boundGlobalActions;
  const collectionUid = collectionsSettings.get('enc_collection_uid');
  const settingType = collectionsSettings.getIn(['favorite', 'setting_type']);
  const params = {
    collection_uid: collectionUid,
    setting_type: settingType,
    favorite,
  };
  boundProjectActions.updateCollectionsSettings(params).then(
    res => {
      console.log('res: ', res);
      if (setting) {
        addNotification({
          message: `${setting} ${checked ? t('SWITCH_ON') : t('SWITCH_OFF')}`,
          level: 'success',
          autoDismiss: 2,
        });
      }
    },
    error => {
      console.log(error);
      if (setting) {
        addNotification({
          message: `${setting} ${checked ? t('SWITCH_ON') : t('SWITCH_OFF')} ${t(
            'COLLECTIOIN_SETTINGS_FAILED_TOAST'
          )}`,
          level: 'error',
          autoDismiss: 2,
        });
      }
    }
  );
};
const getCollectionSetting = that => {
  const { boundProjectActions } = that.props;
  const { enc_collection_uid } = that.state;
  boundProjectActions.getCollectionsSettings(enc_collection_uid).then(res => {
    // console.log('res', res);
    if (res.ret_code === 200000) {
      const { favorite } = res.data;
      that.setState({
        isOpenFavoriteStatus: !!favorite.favorite_enabled,
        isOpenNotes: !!favorite.favorite_comment_enabled,
        isShowNoteSwitch: !!favorite.favorite_enabled,
        labels: favorite.labels,
        isOpenFavoriteViewImg: !!favorite.image_name_enabled,
        isOpenPreviewSave: !!favorite.save_preview_enabled,
      });
    }
  });
};

const onNotesSwitch = (that, checked) => {
  that.setState({
    isOpenNotes: checked,
  });
  updateSettings(that, { favorite_comment_enabled: checked ? 1 : 0 }, t('NOTES'), checked);
};
const onFavoriteStatusSwitch = (that, checked) => {
  that.setState({
    isOpenFavoriteStatus: checked,
    isShowNoteSwitch: checked,
  });
  updateSettings(that, { favorite_enabled: checked ? 1 : 0 }, t('FAVORITE_STATUS'), checked);
};
const onFavoriteViewImg = (that, checked) => {
  that.setState({
    isOpenFavoriteViewImg: checked,
  });
  updateSettings(that, { image_name_enabled: +checked }, t('FAVORITE_VIEW_IMAGE'), checked);
};

const onOpenPreviewSave = (that, checked) => {
  that.setState({
    isOpenPreviewSave: checked,
  });
  updateSettings(that, { save_preview_enabled: +checked }, t('FAVORITE_PREVIEW_SAVE'), checked);
};

const onLabelsSwitch = (that, checked, label_code) => {
  const { collectionsSettings = fromJS({}), boundGlobalActions, boundProjectActions } = that.props;
  const collection_uid = collectionsSettings.get('enc_collection_uid');
  const { updateLabelSetting } = boundProjectActions;
  updateLabelSetting({
    collection_uid,
    label_code,
    label_enable: checked,
    modify_type: 2,
  }).then(
    response => {
      const { ret_code } = response;
      console.log(response, 'response');
      if (ret_code === 200000) {
        that.setState(
          {
            labels: response.data,
          },
          () => {
            addNotification({
              message: `自定义标签已${checked ? '打开' : '关闭'}`,
              level: 'success',
              autoDismiss: 2,
            });
          }
        );
      }
    },
    err => {
      console.log(err);
      addNotification({
        message: '状态修改失败',
        level: 'error',
        autoDismiss: 2,
      });
    }
  );
};
const handleRename = (that, labelParams, callBack) => {
  const { collectionsSettings = fromJS({}), boundGlobalActions, boundProjectActions } = that.props;
  //   const { collectionsSettings = fromJS({}) } = collectionList;
  const collection_uid = collectionsSettings.get('enc_collection_uid');

  // const { addNotification } = boundGlobalActions;
  const { updateLabelSetting } = boundProjectActions;
  const { label_code, label_name } = labelParams;

  // window.logEvent.addPageEvent({
  //     name: 'GalleryFavorite_EditTagNamePop_Click_Confirm',
  // });
  updateLabelSetting({
    collection_uid,
    label_code,
    label_name,
    modify_type: 1,
  }).then(
    response => {
      const { ret_code } = response;
      console.log(response, 'response');
      if (ret_code === 200000) {
        that.setState(
          {
            labels: response.data,
          },
          () => {
            addNotification({
              message: t('自定义标签修改成功'),
              level: 'success',
              autoDismiss: 2,
            });
          }
        );
      } else {
        if (ret_code === 420303) {
          return;
        }
        addNotification({
          message: t('COLLECTION_UPDATE_FAILED_TOAST', { collectionName: label_name }),
          level: 'error',
          autoDismiss: 2,
        });
      }
      callBack();
    },
    err => {
      console.log(err);
      addNotification({
        message: t('COLLECTION_UPDATE_FAILED_TOAST', { collectionName: label_name }),
        level: 'error',
        autoDismiss: 2,
      });
      callBack();
    }
  );
};
const init = that => {
  getCollectionSetting(that);
};
export default {
  getCollectionSetting,
  onOpenPreviewSave,
  init,
  onNotesSwitch,
  onFavoriteStatusSwitch,
  onLabelsSwitch,
  handleRename,
  onFavoriteViewImg,
};
