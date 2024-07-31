import { uploadMusic } from '@resource/pwa/services/music';

const computedProgress = progressEvent => {
  const { loaded, total, lengthComputable } = progressEvent;
  let percent = 0;

  if (lengthComputable) {
    if (!isNaN(loaded) && !isNaN(loaded)) {
      percent = Math.round((loaded / total) * 100);
    }
  }

  return percent;
};

const onUploadingProgress = (that, ret) => {
  console.log(computedProgress(ret));
};

//获取音乐时长
const getMusicDuration = music => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(music);
    const audioElement = new Audio(url);
    let duration = 0;
    audioElement.onloadedmetadata = () => {
      duration = audioElement.duration;
      resolve(duration);
    };
  });
};

const onUploadMusic = (that, musics) => {
  if (!musics || musics.length === 0) {
    return Promise.reject('music is empty');
  }

  const { urls, data, boundGlobalActions, boundProjectActions } = that.props;

  getMusicDuration(musics[0]).then(duration => {
    if (duration < 10) {
      boundGlobalActions.addNotification({
        message: t('ACCEPTED_MINIMUM_LEGTH_10'),
        level: 'error',
        autoDismiss: 3
      });
      return Promise.reject(t('ACCEPTED_MINIMUM_LEGTH_10'));
    }

    const galleryBaseUrl = urls.get('galleryBaseUrl');
    const close = data.get('close');
    boundGlobalActions.showGlobalLoading();

    uploadMusic({
      file: musics[0],
      galleryBaseUrl,
      onProgress: ret => onUploadingProgress(that, ret)
    }).then(
      ret => {
        boundGlobalActions.addNotification({
          message: t('SLIDESHOW_ADD_MUSIC_SUCCESSED'),
          level: 'success',
          autoDismiss: 3
        });
        boundGlobalActions.hideGlobalLoading();

        const { currentCategoryId } = that.state;

        boundProjectActions.getMusicList({ category: currentCategoryId });
        boundProjectActions.replaceAudio(ret).then(() => {
          // TODO: 保存数据以更新状态，并重新获取详情
          boundProjectActions.saveSlideshow();
        });

        close && close(ret);
      },
      error => {
        const isString = typeof error === 'string';
        const isNumber = typeof error === 'number';

        const message = isString
          ? error
          : isNumber && error === 500122
          ? t('ACCEPTED_MAXIMUM_LENGTH')
          : t('SLIDESHOW_ADD_MUSIC_FAILED');

        boundGlobalActions.addNotification({
          message,
          level: 'error',
          autoDismiss: 3
        });

        boundGlobalActions.hideGlobalLoading();
        close && close();
      }
    );
  });
};

const replaceAudio = (that, item) => {
  const { isShowFavoriteList } = that.state;
  window.logEvent.addPageEvent({
    name: 'SlideshowsSongList_Click_Add',
    category: isShowFavoriteList ? 'MyFavoriteSongsList' : 'MyUploadSongsList'
  });

  const { boundGlobalActions, boundProjectActions, data } = that.props;

  const close = data.get('close');

  boundProjectActions.replaceAudio(item.toJS()).then(() => {
    // TODO: 保存数据以更新状态，并重新获取详情
    boundProjectActions.saveSlideshow();
  });

  boundGlobalActions.addNotification({
    message: t('SLIDESHOW_ADD_MUSIC_SUCCESSED'),
    level: 'success',
    autoDismiss: 3
  });

  // 关闭弹框.
  close && close();
};

export default {
  onUploadMusic,
  replaceAudio
};
