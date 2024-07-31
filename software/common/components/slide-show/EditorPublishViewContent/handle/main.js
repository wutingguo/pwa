import { isEqual, debounce } from 'lodash';
import {
  playSlideShowVideoEvent,
  resetSlideShowVideoEvent,
  pauseWaveformVideoEvent
} from '@apps/slide-show/utils/eventBus';
import { getVideoSize } from './render';
import { checkFullTheme } from './theme';

const getShareProps = that => {
  const { collectionDetail, shareUrl } = that.props;
  const coverImage = collectionDetail.getIn(['cover', 'imgUrlMid']);

  return {
    // slideshow的分享链接.
    shareUrl: shareUrl || window.location.href,

    // slide show的名称.
    title: collectionDetail.get('name'),

    // pinterst中需要使用的封面图.
    imageUrl: coverImage
  };
};

const isSupporAudioBrowser = () => {
  var userAgent = navigator.userAgent;
  var mobileBrowsers = ['UC', 'Quark',  'MQQBrowser'];
  
  for (var i = 0; i < mobileBrowsers.length; i++) {
    if (userAgent.indexOf(mobileBrowsers[i]) > -1) {
      return true;
    }
  }
  return false;
}

const playVideo = that => {
  that.setState({
    isPlaying: true
  });
  const { boundGlobalActions } = that.props
  const audioNode = that.audioNode
  audioNode && audioNode.play()
  if (isSupporAudioBrowser() && __isCN__) {
    boundGlobalActions.addNotification({
      message: '当前浏览器暂不支持，推荐使用系统默认浏览器',
      level: 'warning',
      autoDismiss: 3
    });
  }
  setTimeout(playSlideShowVideoEvent.dispatch, 10);
  window.logEvent.addPageEvent({
    name: 'SlideshowsVideo_Click_PlaySlideshow',
    PageURL: window.location.href
  });
};

const pausVideo = that => {
  that.setState({
    isPlaying: false
  });
  setTimeout(playSlideShowVideoEvent.dispatch, 10);
};

const onAudioEnded = that => {
  that.setState({ isPlaying: false });
};

const resetStatus = that => {
  resetSlideShowVideoEvent.dispatch();
  that.setState({
    isPlaying: false
  });
};

const triggleRenderUpdate = that => {
  that.setState({
    triggleRenderMarkNumber: that.state.triggleRenderMarkNumber + 1
  });
};

// 韩超 +　王亚伟（更改监听死循环和封面不显示的问题）
const updateVideoSize = debounce(that => {
  const { videoSize } = that.state;
  const { collectionDetail } = that.props;
  const themeId = collectionDetail.getIn(['theme', 'id']) || 'classic-dark';
  const isFullTheme = checkFullTheme(themeId);
  const newVideoSize = getVideoSize(that.containerNode, isFullTheme);
  if (!isEqual(videoSize, newVideoSize)) {
    that.setState({ videoSize: newVideoSize });
  }
}, 100)

const receiveProps = (that, nextProps) => {
  const { collectionDetail } = that.props;
  const newCollectionDetail = nextProps.collectionDetail;
  const oldThemeId = collectionDetail.getIn(['theme', 'id']);
  const newThemeId = newCollectionDetail.getIn(['theme', 'id']);
  const oldCoverImage = collectionDetail.getIn(['cover', 'imgUrlMid']);
  const newCoverImage = newCollectionDetail.getIn(['cover', 'imgUrlMid']);
  if (oldThemeId !== newThemeId || oldCoverImage !== newCoverImage) {
    that.resetStatus();
  }
};

const handleMouseOver = that => {
  that.setState({
    isShowShare: true
  });
};

const handleMouseOut = that => {
  that.setState({
    isShowShare: false
  });
};

export default {
  getShareProps,
  playVideo,
  resetStatus,
  receiveProps,
  onAudioEnded,
  triggleRenderUpdate,
  handleMouseOver,
  handleMouseOut,
  pausVideo,
  updateVideoSize,
};
