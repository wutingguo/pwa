import { EDIT_MODAL } from '@apps/gallery/constants/modalTypes';

/**
 * 更新 settings
 * @param {*} that
 * @param {*} settingItem
 */
const updateSettings = (that, favorite, setting, checked) => {
  const { collectionsSettings, boundProjectActions, boundGlobalActions } = that.props;
  const { addNotification } = boundGlobalActions;
  const collectionUid = collectionsSettings.get('enc_collection_uid');
  const settingType = collectionsSettings.getIn(['favorite', 'setting_type']);
  const params = {
    collection_uid: collectionUid,
    setting_type: settingType,
    favorite,
  };
  console.log('favorite: ', favorite);
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

const onFavoriteStatusSwitch = (that, checked) => {
  const { presetState } = that.props;
  window.logEvent.addPageEvent({
    name: 'GalleryFavorite_Click_Favorite',
    FavoriteStatus: checked ? 'On' : 'Off',
  });

  that.setState({
    isOpenFavoriteStatus: checked,
    isShowNoteSwitch: checked,
  });
  if (!checked) {
    that.setState({
      isOpenNotes: checked,
    });
    if (presetState) {
      // const msg = `${t('NOTES')} ${t('SWITCH_OFF')}`;
      that.instantUpdate('favorite_comment_enabled', false);
    } else {
      updateSettings(that, { favorite_comment_enabled: +checked });
    }
  }
  if (presetState) {
    const msg = `${t('FAVORITE_STATUS')} ${t(checked ? 'SWITCH_ON' : 'SWITCH_OFF')}`;
    that.instantUpdate('favorite_enabled', !!checked, msg);
  } else {
    updateSettings(that, { favorite_enabled: +checked }, t('FAVORITE_STATUS'), checked);
  }
};
const onFavoriteViewImg = (that, checked) => {
  const { presetState } = that.props;

  that.setState({
    isOpenFavoriteViewImg: checked,
  });

  if (presetState) {
    const msg = `${t('FAVORITE_VIEW_IMAGE')} ${t(checked ? 'SWITCH_ON' : 'SWITCH_OFF')}`;
    that.instantUpdate('image_name_enabled', !!checked, msg);
  } else {
    updateSettings(that, { image_name_enabled: +checked }, t('FAVORITE_VIEW_IMAGE'), checked);
  }
};

const onPrevieSaveImg = (that, checked) => {
  const { presetState } = that.props;

  that.setState({
    isOpenPreviewSave: checked,
  });

  if (presetState) {
    const msg = `${t('FAVORITE_PREVIEW_SAVE')} ${t(checked ? 'SWITCH_ON' : 'SWITCH_OFF')}`;
    that.instantUpdate('save_preview_enabled', !!checked, msg);
  } else {
    updateSettings(that, { save_preview_enabled: +checked }, t('FAVORITE_PREVIEW_SAVE'), checked);
  }
};

const getFavoriteStatusSwitchProps = that => {
  const { isOpenFavoriteStatus } = that.state;
  const favoriteStatusSwitchProps = {
    id: 'status',
    checked: isOpenFavoriteStatus,
    onSwitch: checked => onFavoriteStatusSwitch(that, checked),
  };
  return favoriteStatusSwitchProps;
};
const getFavoriteViewImgSwitchProps = that => {
  const { isOpenFavoriteViewImg } = that.state;
  const favoriteViewImgSwitchProps = {
    id: 'status',
    checked: isOpenFavoriteViewImg,
    onSwitch: checked => onFavoriteViewImg(that, checked),
  };
  return favoriteViewImgSwitchProps;
};

const getFavoritePreViewSaveProps = that => {
  const { isOpenPreviewSave } = that.state;
  const favoriteViewImgSwitchProps = {
    id: 'status',
    checked: isOpenPreviewSave,
    onSwitch: checked => onPrevieSaveImg(that, checked),
  };
  return favoriteViewImgSwitchProps;
};

const onNotesSwitch = (that, checked) => {
  const { presetState } = that.props;
  window.logEvent.addPageEvent({
    name: 'GalleryFavorite_Click_Note',
    Note: checked ? 'On' : 'Off',
  });

  that.setState({
    isOpenNotes: checked,
  });
  if (presetState) {
    const msg = `${t('NOTES')} ${t(checked ? 'SWITCH_ON' : 'SWITCH_OFF')}`;
    that.instantUpdate('favorite_comment_enabled', !!checked, msg);
  } else {
    updateSettings(that, { favorite_comment_enabled: +checked }, t('NOTES'), checked);
  }
};
const onLabelsSwitch = (that, checked, label_code) => {
  console.log('label_code: ', label_code, checked);
  const { collectionsSettings, boundGlobalActions, boundProjectActions, presetState } = that.props;
  const { labels } = that.state;
  const collection_uid = collectionsSettings.get('enc_collection_uid');
  window.logEvent.addPageEvent({
    name: 'GalleryFavorite_Click_EditTagStatus',
    status: checked ? 'on' : 'off',
  });
  const { addNotification } = boundGlobalActions;
  const { updateLabelSetting } = boundProjectActions;
  if (presetState) {
    that.setState(
      {
        labels: labels.map(item => {
          if (item.label_code === label_code) {
            return {
              ...item,
              label_enabled: !!checked,
            };
          }
          return item;
        }),
      },
      () => {
        const msg = `自定义标签已${checked ? '打开' : '关闭'}`;
        that.instantUpdate('labels', that.state.labels, msg);
      }
    );
    return;
  }
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

const getNotesSwitchProps = that => {
  const { isOpenNotes } = that.state;
  const notesSwitchProps = {
    id: 'note',
    checked: isOpenNotes,
    onSwitch: checked => onNotesSwitch(that, checked),
  };
  return notesSwitchProps;
};
const getLabelsSwitchProps = (that, item) => {
  const labelsSwitchProps = {
    id: 'label',
    checked: item.label_enable || item.label_enabled,
    onSwitch: (checked, id) => onLabelsSwitch(that, checked, id),
    iconProps: {
      iconHeight: 13,
      iconWidth: 26,
    },
    isShowText: false,
    label_code: item.label_code,
  };
  return labelsSwitchProps;
};

const willReceiveProps = (that, nextProps) => {
  const { collectionsSettings } = nextProps || that.props;
  if (collectionsSettings && collectionsSettings.size) {
    const favoriteEnabled = collectionsSettings.getIn(['favorite', 'favorite_enabled']);
    const imageNameEnabled = collectionsSettings.getIn(['favorite', 'image_name_enabled']);
    const save_preview_enabled = collectionsSettings.getIn(['favorite', 'save_preview_enabled']);
    const favoriteCommentEnabled = collectionsSettings.getIn([
      'favorite',
      'favorite_comment_enabled',
    ]);
    let labels = null;
    if (that.state.labels.length) {
      labels = that.state.labels;
    } else {
      labels = collectionsSettings.getIn(['favorite', 'labels']).toJS();
    }
    that.setState({
      isOpenFavoriteStatus: Boolean(favoriteEnabled),
      isOpenNotes: Boolean(favoriteCommentEnabled),
      isShowNoteSwitch: Boolean(favoriteEnabled),
      labels,
      isOpenFavoriteViewImg: Boolean(imageNameEnabled),
      isOpenPreviewSave: Boolean(save_preview_enabled),
    });
  }
};

const handleRename = (that, labelParams) => {
  const { collectionsSettings, boundGlobalActions, boundProjectActions, presetState } = that.props;
  const collection_uid = collectionsSettings.get('enc_collection_uid');

  const { showModal, hideModal, addNotification } = boundGlobalActions;
  const { updateLabelSetting } = boundProjectActions;
  const { label_code } = labelParams;
  const { labels } = that.state;
  const data = {
    initialValue: labels.find(i => i.label_code === label_code).label_name,
    title: '编辑自定义标签',
    message: '标签名称',
    requiredTip: '标签名称为必填项',
    illegalTip: t('CREATE_COLLECTION_ILLEGAL_TIP'),
    handleSave: inputValue => {
      window.logEvent.addPageEvent({
        name: 'GalleryFavorite_EditTagNamePop_Click_Confirm',
      });
      if (presetState) {
        that.setState(
          {
            labels: labels.map(item => {
              if (item.label_code === label_code) {
                return {
                  ...item,
                  label_name: inputValue,
                };
              }
              return item;
            }),
          },
          () => {
            hideModal(EDIT_MODAL);
            const msg = '自定义标签修改成功';
            that.instantUpdate('labels', that.state.labels, msg);
          }
        );
        return;
      }
      updateLabelSetting({
        collection_uid,
        label_code,
        label_name: inputValue,
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
                hideModal(EDIT_MODAL);
              }
            );
          } else {
            if (ret_code === 420303) {
              return;
            }
            addNotification({
              message: t('COLLECTION_UPDATE_FAILED_TOAST', { collectionName: inputValue }),
              level: 'error',
              autoDismiss: 2,
            });
          }
        },
        err => {
          console.log(err);
          addNotification({
            message: t('COLLECTION_UPDATE_FAILED_TOAST', { collectionName: inputValue }),
            level: 'error',
            autoDismiss: 2,
          });
        }
      );
    },
    handleCancel: () => {
      window.logEvent.addPageEvent({
        name: 'GalleryFavorite_EditTagNamePop_Click_Cancel',
      });

      hideModal(EDIT_MODAL);
    },
    close: () => {
      window.logEvent.addPageEvent({
        name: 'GalleryFavorite_EditTagNamePop_Click_Cancel',
      });
      hideModal(EDIT_MODAL);
    },
  };

  showModal(EDIT_MODAL, data);
};

export default {
  willReceiveProps,
  getFavoriteStatusSwitchProps,
  getFavoritePreViewSaveProps,
  getFavoriteViewImgSwitchProps,
  getNotesSwitchProps,
  getLabelsSwitchProps,
  handleRename,
};
