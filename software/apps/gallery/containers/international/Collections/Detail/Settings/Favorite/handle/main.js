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
    favorite
  };
  console.log('favorite: ', favorite);
  boundProjectActions.updateCollectionsSettings(params).then(
    res => {
      console.log('res: ', res);
      if (setting) {
        addNotification({
          message: `${setting} ${checked ? t('SWITCH_ON') : t('SWITCH_OFF')}`,
          level: 'success',
          autoDismiss: 2
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
          autoDismiss: 2
        });
      }
    }
  );
};

const onFavoriteStatusSwitch = (that, checked) => {
  window.logEvent.addPageEvent({
    name: 'GalleryFavorite_Click_Favorite',
    FavoriteStatus: checked ? 'On' : 'Off'
  });

  that.setState({
    isOpenFavoriteStatus: checked,
    isShowNoteSwitch: checked
  });
  if (!checked) {
    that.setState({
      isOpenNotes: checked
    });
    updateSettings(that, { favorite_comment_enabled: +checked });
  }
  updateSettings(that, { favorite_enabled: +checked }, t('FAVORITE_STATUS'), checked);
};

const getFavoriteStatusSwitchProps = that => {
  const { isOpenFavoriteStatus } = that.state;
  const favoriteStatusSwitchProps = {
    id: 'status',
    checked: isOpenFavoriteStatus,
    onSwitch: checked => onFavoriteStatusSwitch(that, checked)
  };
  return favoriteStatusSwitchProps;
};

const onNotesSwitch = (that, checked) => {
  window.logEvent.addPageEvent({
    name: 'GalleryFavorite_Click_Note',
    Note: checked ? 'On' : 'Off'
  });

  that.setState({
    isOpenNotes: checked
  });
  updateSettings(that, { favorite_comment_enabled: +checked }, t('NOTES'), checked);
};

const getNotesSwitchProps = that => {
  const { isOpenNotes } = that.state;
  const notesSwitchProps = {
    id: 'note',
    checked: isOpenNotes,
    onSwitch: checked => onNotesSwitch(that, checked)
  };
  return notesSwitchProps;
};

const willReceiveProps = (that, nextProps) => {
  const { collectionsSettings } = nextProps || that.props;
  if (collectionsSettings && collectionsSettings.size) {
    const favoriteEnabled = collectionsSettings.getIn(['favorite', 'favorite_enabled']);
    const favoriteCommentEnabled = collectionsSettings.getIn([
      'favorite',
      'favorite_comment_enabled'
    ]);

    that.setState({
      isOpenFavoriteStatus: Boolean(favoriteEnabled),
      isOpenNotes: Boolean(favoriteCommentEnabled),
      isShowNoteSwitch: Boolean(favoriteEnabled)
    });
  }
};

export default {
  willReceiveProps,
  getFavoriteStatusSwitchProps,
  getNotesSwitchProps
};
