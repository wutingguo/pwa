import React, { Component } from 'react';
import { getSize } from '@resource/lib/utils/helper';
import SlideShowPreview from '@resource/components/pwa/SlideShowPreview';
import { XSocialShare, XImg } from '@common/components';
import playIcon from '../play.png';
import {
  checkFullTheme
} from './theme';
import { getDegree } from '@resource/lib/utils/exif';

const getVideoSize = (ContainerHeight, isFull) => {
  let ideaRatio = 16 / 9;
  let wrapHeight = ContainerHeight || getSize().height - 260;
  const height = isFull ? wrapHeight : wrapHeight - 180;
  const width = height * ideaRatio;
  return {
    width,
    height
  }
}

const getPPTcontent = that => {
  const { collectionDetail, urls } = that.props;
  const contentProps = {
    urls,
    onAudioEnded: that.onAudioEnded,
    collectionDetail,
    controllerOptions: {
      backgroundColor: 'rgba(0,0,0,0.1)',
      outterPadding: '10px',
      showFullScreenIcon: true
    }
  };
  return <SlideShowPreview {...contentProps} />
}

const getVideoContainer = that => {
  const { isPlaying, isShowShare, videoSize } = that.state;
  const { collectionDetail } = that.props;
  const themeId = collectionDetail.getIn(['theme', 'id']);
  const isFullTheme = checkFullTheme(themeId);
  const coverImage = collectionDetail.getIn(['cover', 'imgUrlMid']);
  const coverImageRotate = getDegree(collectionDetail.getIn(['cover', 'orientation']));
  const shareProps = that.getShareProps();
  const coverImageStyle = {
    display: isPlaying ? 'none' : 'block'
  };
  const videoContainerStyle = {
    position: isFullTheme ? 'absolute' : 'relative',
    width: videoSize.width,
    height: videoSize.height,
    left: isFullTheme ? '50%' : 0,
    marginLeft: isFullTheme ? `-${videoSize.width / 2}px` : ''
  };
  const videoContentStyle = {
    display: isPlaying ? 'block' : 'none'
  };
  return (
    <div
      style={videoContainerStyle}
      className="slide-video-container"
      onMouseOver={that.handleMouseOver}
      onMouseLeave={that.handleMouseOut}
    >
      <div className="slide-show-preview-content">
        <div
          className="slide-show-video-content"
          style={videoContentStyle}
        >
          {that.getPPTcontent()}
          {
            isShowShare ? <div className="third-share-container">
              <XSocialShare {...shareProps} />
            </div> : null
          }
        </div>
        <div
          className="slide-show-theme-content"
          style={coverImageStyle}
        >
          <XImg
            type="background"
            className={isFullTheme ? '' : 'background-size-contain'}
            imgRot={coverImageRotate}
            src={coverImage}
          />
        </div>
        {!isPlaying && !isFullTheme && (
          <div className="center-play-container">{that.getPlaySection()}</div>
        )}
      </div>
    </div>
  );

}

const getPlaySection = that => {
  return (
    <div
      className="slide-show-play-wrap"
      onClick={that.playVideo}
    >
      <img src={playIcon} />
      <span>{t("PLAY_SLIDE_SHOW")}</span>
    </div>
  );
}

export default {
  getVideoContainer,
  getPlaySection,
  getPPTcontent
}