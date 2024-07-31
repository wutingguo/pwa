const showFavoriteList = (that, opt = {}) => {
  const { boundProjectActions } = that.props;
  const { currentCategoryId } = that.state;
  window.logEvent.addPageEvent({
    name: 'SlideshowsAddMusic_Favorite'
  });
  const { keywords = '' } = opt;
  // that.backToCategory();
  that.setState({
    keywords,
    isShowList: false,
    isShowUploadBtn: false,
    isShowMusicTagList: false,
    isShowFavoriteList: true
  }, () => {
    boundProjectActions.getFavoriteList({
      keywords,
      category: currentCategoryId,
    })
  });
};

/**
 * 获取收藏列表.
 * @param {*} that
 */
const getFavoriteList = that => {
  const { boundProjectActions } = that.props;
  const { currentCategoryId } = that.state;
  boundProjectActions.getFavoriteList({
    category: currentCategoryId,
  });
};


/**
 * 添加或移除收藏.
 * @param {*} that
 * @param {Map} item
 */
const toggleFavorite = (that, item) => {
  const { musicFavorite, boundProjectActions, boundGlobalActions } = that.props;

  const { isShowFavoriteList } = that.state;
  window.logEvent.addPageEvent({
    name: 'SlideshowsSongList_Click_Favorite',
    category: isShowFavoriteList ? 'MyFavoriteSongsList' : 'MyUploadSongsList'
  });

  // 查看当前的音乐是否已收藏.
  const records = musicFavorite.get('records');
  const isFavoriteOfCurrent = records
    ? !!records.find(v => v.get('enc_id') === item.get('enc_id'))
    : false;

  let fn = boundProjectActions.addToFavorite;

  // 如果已经是在favorite状态, 就变为unfavirote
  if (isFavoriteOfCurrent) {
    fn = boundProjectActions.removeFromFavorite;
  }

  fn(item.get('enc_id')).then(
    ret => {
      const tKey = isFavoriteOfCurrent ? 'UNMARK_FAVORITE_SUCCESS' : 'MARK_FAVORITE_SUCCESS';
      boundGlobalActions.addNotification({
        message: t(tKey),
        level: 'success',
        autoDismiss: 3
      });
    },
    error => {
      const tKey = isFavoriteOfCurrent ? 'UNMARK_FAVORITE_FAILED' : 'MARK_FAVORITE_FAILED';

      boundGlobalActions.addNotification({
        message: t(tKey),
        level: 'error',
        autoDismiss: 3
      });
    }
  );
};

export default {
  showFavoriteList,
  getFavoriteList,
  toggleFavorite
};
