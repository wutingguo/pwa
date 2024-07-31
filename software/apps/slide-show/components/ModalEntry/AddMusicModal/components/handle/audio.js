import musicHandle from './music';

export const startRenderLoop = that => {
  that.animationFrameId = requestAnimationFrame(function renderAnimationFrame() {
    that.setAudioStatusToState();
    that.animationFrameId = requestAnimationFrame(renderAnimationFrame);
  });
};

export const cancelRenderLop = that => {
  cancelAnimationFrame(that.animationFrameId);
};

export const setAudioStatusToState = that => {
  const audioNode = that.audioNode;
  if (!audioNode) return;
  const { currentTime, duration, paused, muted, volume } = audioNode;
  that.setState({
    currentTime,
    duration,
    paused,
    muted,
    volume,
  });
};

export const onAudioPlay = that => {
  const { isShowFavoriteList } = that.state;
  window.logEvent.addPageEvent({
    name: 'SlideshowsSongList_Click_Play',
    category: isShowFavoriteList ? 'MyFavoriteSongsList' : 'MyUploadSongsList',
  });

  that.startRenderLoop();
};

export const onAudioPause = that => {
  const { isShowFavoriteList } = that.state;
  window.logEvent.addPageEvent({
    name: 'SlideshowsSongList_Click_Pause',
    category: isShowFavoriteList ? 'MyFavoriteSongsList' : 'MyUploadSongsList',
  });

  that.cancelRenderLop();
};

const extractRouteWithParamsFromURL = url => {
  try {
    const urlObject = new URL(url);
    const routeWithParams = urlObject.pathname + urlObject.search;
    return routeWithParams;
  } catch (error) {
    return '';
  }
};

export const tooglePlay = that => {
  const audioNode = that.audioNode;
  if (!audioNode) return;
  const { paused } = audioNode;
  const handleFn = paused ? 'play' : 'pause';

  const audioUrl = `${musicHandle.combineAudioUrl(that)}`;
  // 地址不同时, 表示要切换视频.
  // 换视频后, 直接执行play方法.
  if (extractRouteWithParamsFromURL(audioNode.src) !== audioUrl) {
    audioNode.src = audioUrl;
    audioNode.play();
  } else {
    // 暂停和播放的相互切换.
    audioNode[handleFn]();
  }

  that.setAudioStatusToState();
};

export const toogleMuted = that => {
  const audioNode = that.audioNode;
  if (!audioNode) return;
  audioNode.muted = !audioNode.muted;
  that.setAudioStatusToState();
};
export const changeTime = (that, time) => {
  const audioNode = that.audioNode;
  if (!audioNode) return;
  audioNode.currentTime = time;
  that.setAudioStatusToState();
};

export const bindAudioEvents = that => {
  const audioNode = that.audioNode;
  if (!audioNode) return;
  audioNode.addEventListener('play', that.onAudioPlay);
  audioNode.addEventListener('pause', that.onAudioPause);
};

export const removeAudioEvents = that => {
  const audioNode = that.audioNode;
  if (!audioNode) return;
  audioNode.removeEventListener('play', that.onAudioPlay);
  audioNode.removeEventListener('pause', that.onAudioPause);
};
