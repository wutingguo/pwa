import { assign } from 'lodash';
import React, { Component } from 'react';

import SlideShowPreview from '@resource/components/pwa/SlideShowPreview';

import { getOrientationAppliedStyle } from '@resource/lib/utils/exif';
import { getDegree } from '@resource/lib/utils/exif';

import { packageListMap } from '@resource/lib/constants/strings';

import { XImg, XSocialShare } from '@common/components';

import * as localModalTypes from '@apps/slide-show-client/constants/modalTypes';

import playIcon from '../play.png';
import waterMarkImage from '../watermark.png';

import main from './main';
import { checkFullTheme } from './theme';

export const getVideoSize = (containerNode, isFull) => {
  // let ideaRatio = 16/9;
  let ideaRatio = 15 / 10;
  if (!containerNode) {
    return {
      width: 0,
      height: 0,
    };
  }
  let wrapWidth = containerNode.offsetWidth;
  let wrapHeight = containerNode.offsetHeight;
  const useHeight = isFull ? wrapHeight : wrapHeight - 180;
  const wrapWHRatio = wrapWidth / useHeight;
  let width = 0;
  let height = 0;
  if (wrapWHRatio > ideaRatio) {
    height = useHeight;
    width = useHeight * ideaRatio;
  } else {
    width = wrapWidth;
    // height = width / ideaRatio;
    height = isFull ? wrapHeight : width / ideaRatio;
  }
  return {
    width,
    height,
  };
};

const getPPTcontent = that => {
  const {
    collectionDetail,
    urls,
    isMobile = false,
    usedPostCardDetail,
    mySubscription,
  } = that.props;
  const { isPlaying, videoSize } = that.state;
  const contentProps = {
    urls,
    isMobile,
    mySubscription,
    isPlaying,
    playVideo: that.playVideo,
    usedPostCardDetail,
    onAudioEnded: that.onAudioEnded,
    collectionDetail,
    videoSize,
    controllerOptions: {
      backgroundColor: 'rgba(0,0,0,0.2)',
      outterPadding: '10px',
      // showFullScreenIcon: !isMobile,
      showFullScreenIcon: true,
    },
  };
  return <SlideShowPreview {...contentProps} />;
};

// 校验 Pin code
const handleCheckPin = (that, { inputValue, download_url }) => {
  const { boundGlobalActions, boundProjectActions } = that.props;
  const { getClientDownloadUrl, getClientDownloadCheckPin } = boundProjectActions;
  getClientDownloadCheckPin({ pin: inputValue }).then(res => {
    if (res.ret_code === 200000 && res.data) {
      const { check_pin_result } = res.data;
      if (check_pin_result) {
        boundGlobalActions.hideModal(localModalTypes.CHECK_DOWNLOAD_PIN);
        window.location.href = download_url;
      } else {
        boundGlobalActions.addNotification({
          message: 'Download PIN is incorrect.',
          level: 'error',
          autoDismiss: 2,
        });
      }
    }
  });
};

const downloadVideo = that => {
  window.logEvent.addPageEvent({
    name: 'SlideshowClientDownload_Click_Download',
  });
  const { boundGlobalActions, boundProjectActions } = that.props;
  const { getClientDownloadUrl, getClientDownloadCheckPin } = boundProjectActions;
  const { isPlaying, isShowShare } = that.state;

  getClientDownloadUrl().then(res => {
    if (res.ret_code === 200000 && res.data) {
      let { download_url, video_status } = res.data;
      if (video_status === 2) {
        // 视频 已经生  校验 是设置PIN
        getClientDownloadCheckPin({ pin: '' }).then(res => {
          if (res.ret_code === 200000 && res.data && res.data.download_pin_status) {
            // const {check_pin_result,download_pin_status} = res.data;
            // 开启PIN 需要弹窗 PIn验证
            // that.setState({
            //   isPlaying: false
            // });
            if (isPlaying) {
              // that.setState({isPlaying:false})
              main.pausVideo(that);
            }

            boundGlobalActions.showModal(localModalTypes.CHECK_DOWNLOAD_PIN, {
              close: () => {
                boundGlobalActions.hideModal(localModalTypes.CHECK_DOWNLOAD_PIN);
              },
              onOk: inputValue => {
                // debugger
                handleCheckPin(that, { inputValue, download_url });
              },
              title: 'Download Slideshow',
              desc: 'Please enter the download PIN to download this slideshow.',
              boundProjectActions,
              boundGlobalActions,
              download_url,
            });
          } else {
            window.location.href = download_url;
          }
        });
      } else {
        let data = {
          close: () => {
            window.logEvent.addPageEvent({
              name: 'SlideshowClientDownloadPop_Click_OK',
            });
            boundGlobalActions.hideModal(localModalTypes.DOWN_LOAD_MSGINFO_MODAL);
          },
        };
        // video_status = 1
        if (video_status === 2 && download_url) {
          window.location.href = download_url;
        } else if (video_status < 2) {
          assign(data, {
            title: `The playback is being generated and try downloading it in approximately 30 minutes.`,
            className: '',
          });
        } else if (video_status === 4) {
          assign(data, {
            title: `Playback generation failure! Please contact the slideshow maker for help.`,
            className: 'red-text',
          });
        }
        if (video_status !== 2) {
          boundGlobalActions.showModal(localModalTypes.DOWN_LOAD_MSGINFO_MODAL, data);
        }
      }

      //
    }
  });
};

const getVideoContainer = (that, logoData) => {
  const { isPlaying, isShowShare, videoSize } = that.state;
  const { collectionDetail, showShare = true, mySubscription } = that.props;
  const themeId = collectionDetail.getIn(['theme', 'id']) || 'classic-dark';
  const isFullTheme = checkFullTheme(themeId);
  const coverImage = collectionDetail.getIn(['cover', 'imgUrlMid']);
  const coverImageRotate = collectionDetail.getIn(['cover', 'orientation']);
  const shareProps = that.getShareProps();
  const coverImageStyle = {
    display: isPlaying ? 'none' : 'block',
  };

  const videoContainerStyle = {
    position: isFullTheme ? 'absolute' : 'relative',
    width: videoSize.width,
    height: videoSize.height,
    left: isFullTheme ? '50%' : 0,
    marginLeft: isFullTheme ? `-${videoSize.width / 2}px` : '',
  };
  const videoContentStyle = {
    display: isPlaying ? 'block' : 'none',
    width: videoSize.width,
    height: videoSize.height,
  };

  const planItems = mySubscription && mySubscription.get('items');
  const slideShowItem =
    planItems && planItems.find(el => el.get('product_id') === 'SAAS_SLIDE_SHOW');
  const license = collectionDetail.get('license') || {};
  // console.log('license==>', license)
  const isFree =
    (slideShowItem && slideShowItem.get('is_free')) || license.level === packageListMap.free;
  const hasTrailPlanLevel =
    (slideShowItem && slideShowItem.get('trial_plan_level') > 10) || license.trial_plan_level > 10;

  const isShowWaterMark = isFree && !hasTrailPlanLevel;
  const downloadSetting = collectionDetail.get('downloadSetting') || {};
  const downloadUrl = collectionDetail.get('downloadUrl') || {};
  const logoShow = !!collectionDetail.get('logo_show');
  // console.log('downloadSetting-----downloadUrl------', downloadSetting, downloadUrl);
  // console.log("this.props------",that.props)
  const settingStatus =
    downloadSetting.hasOwnProperty('download_status') &&
    downloadSetting.download_status &&
    !__isCN__;

  return (
    <div
      style={videoContainerStyle}
      className="slide-video-container"
      onMouseOver={that.handleMouseOver}
      onMouseLeave={that.handleMouseOut}
    >
      <div className="slide-show-preview-content">
        <div className="slide-show-video-content" style={videoContentStyle}>
          {that.getPPTcontent()}
          {showShare && !__isCN__ && isShowShare && (
            <div className="third-share-container">
              <XSocialShare {...shareProps} />
            </div>
          )}

          {settingStatus && isShowShare ? (
            <div
              className="download-video"
              onClick={() => {
                downloadVideo(that);
              }}
            >
              <div className="download-video-left">Download</div>
              <div className="download-video-right"></div>
            </div>
          ) : null}
        </div>
        <div className="slide-show-theme-content" style={coverImageStyle}>
          <XImg
            type="background"
            hasWaterMark={!__isCN__ && isShowWaterMark && !isFullTheme}
            className={isFullTheme ? '' : 'background-size-contain'}
            imgRot={coverImageRotate}
            src={coverImage}
          />
          {!__isCN__ && isShowWaterMark && isFullTheme ? (
            <img
              className="water-mark"
              src={waterMarkImage}
              style={{ width: '75px', height: '75px' }}
            />
          ) : null}
        </div>
        {!isPlaying && !isFullTheme && (
          <div className="center-play-container">{that.getPlaySection()}</div>
        )}

        {!isPlaying && !isFullTheme && logoData && logoShow && that.getLogoSection(logoData)}
      </div>
    </div>
  );
};

const getPlaySection = that => {
  const { collectionDetail, isMobile } = that.props;
  const themeId = collectionDetail.getIn(['theme', 'id']) || 'classic-dark';
  const isFullTheme = checkFullTheme(themeId);
  const nofullStyle = {
    marginTop: '80%',
    color: themeId.includes('-light') && isMobile ? '#3A3A3A' : '#fff',
  };
  const playIconBlack = (
    <svg
      t="1698134014758"
      class="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="1454"
      width="30"
      height="32"
    >
      <path
        d="M256 832c-11.712 0-23.36-3.2-33.664-9.536A64.170667 64.170667 0 0 1 192 768V256c0-22.208 11.52-42.816 30.336-54.464a64.298667 64.298667 0 0 1 62.272-2.816l512 256a64.064 64.064 0 0 1 0 114.56l-512 256c-8.96 4.48-18.88 6.72-28.608 6.72z"
        p-id="1455"
        fill="#cdcdcd"
      ></path>
    </svg>
  );

  return (
    <div
      className="slide-show-play-wrap"
      onClick={() => that.playVideo()}
      style={!isFullTheme && isMobile ? nofullStyle : {}}
    >
      {/* <img src={playIcon} /> */}
      {!isFullTheme ? playIconBlack : <img src={playIcon} />}
      <span>{!__isCN__ ? t('PLAY_SLIDE_SHOW') : 'PLAY'}</span>
    </div>
  );
};

const getLogoSection = (that, logoData) => {
  const style = {
    ...getOrientationAppliedStyle(logoData.orientation),
  };
  return (
    <div className="slide-show-logo-container" style={logoData.style}>
      <img src={logoData.src} style={style} />
    </div>
  );
};

export default {
  getVideoContainer,
  getPlaySection,
  getPPTcontent,
  getLogoSection,
  downloadVideo,
};
