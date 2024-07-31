import {
  playSlideShowVideoEvent,
  resetSlideShowVideoEvent
} from '@apps/slide-show/utils/eventBus';
const getShareProps = that => {
  const { collectionDetail } = that.props;
  return {
    // slideshow的分享链接.
    shareUrl: 'https://www.zno.com',

    // slide show的名称.
    title: collectionDetail.get('name'),

    // pinterst中需要使用的封面图.
    imageUrl: 'https://assets.znocdn.net/clientassets/portal/v2/images/pc/home/1.20191227.jpg',
  };
}

const playVideo = that => {
  that.setState({
    isPlaying: true
  });
  setTimeout(playSlideShowVideoEvent.dispatch, 10);
}

const onAudioEnded = (that) => {
  that.setState({ isPlaying: false });
}

const resetStatus = that => {
  resetSlideShowVideoEvent.dispatch();
  that.setState({
    isPlaying: false
  });
}

const receiveProps = (that, nextProps, nextState) => {
  const { collectionDetail } = that.props;
  const newCollectionDetail = nextProps.collectionDetail;
  const oldThemeId = collectionDetail.getIn(['theme', 'id']);
  const newThemeId = newCollectionDetail.getIn(['theme', 'id']);
  const oldCoverImage = collectionDetail.getIn(['cover', 'imgUrlMid']);
  const newCoverImage = newCollectionDetail.getIn(['cover', 'imgUrlMid']);
  if (oldThemeId !== newThemeId || oldCoverImage !== newCoverImage) {
    that.resetStatus();
  }
}

const handleMouseOver = (that) => {
  that.setState({
    isShowShare: true,
  });
}

const handleMouseOut = (that) => {
  that.setState({
    isShowShare: false,
  });
}

export default {
  getShareProps,
  playVideo,
  resetStatus,
  receiveProps,
  onAudioEnded,
  handleMouseOver,
  handleMouseOut,
};