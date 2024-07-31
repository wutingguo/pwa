import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import SlideShowPreview from '@resource/components/pwa/SlideShowPreview';
import { XPureComponent, XLoading, EmptyContent, XSocialShare } from '@common/components';
import main from './handle/main';
import renderHandler from './handle/render';
import { getThemeColor, getThemeBgColor, checkFullTheme, getBackDropColor } from './handle/theme';
import { getLogoData } from './handle/logo';
import './index.scss';

class EditorPublishViewContent extends XPureComponent {
  constructor(props) {
    super(props);
    this.observer = null;
    this.containerRef = React.createRef();
    this.state = {
      isPlaying: false,
      triggleRenderMarkNumber: 0,
      isShowShare: false,
      videoSize: {
        width: '100%',
        height: '100%',
      }
    };
  }

  playVideo = () => main.playVideo(this);
  onAudioEnded = () => main.onAudioEnded(this);
  resetStatus = () => main.resetStatus(this);
  getShareProps = () => main.getShareProps(this);
  handleMouseOver = () => main.handleMouseOver(this);
  handleMouseOut = () => main.handleMouseOut(this);
  triggleRenderUpdate = () => main.triggleRenderUpdate(this);
  updateVideoSize = () => main.updateVideoSize(this);
  getPlaySection = () => renderHandler.getPlaySection(this);
  getPPTcontent = () => renderHandler.getPPTcontent(this);
  getVideoContainer = data => renderHandler.getVideoContainer(this, data);
  getLogoSection = data => renderHandler.getLogoSection(this, data);

  downloadVideo = data => renderHandler.downloadVideo(this, data);

  //WARNING! To be deprecated in React v17. Use new lifecycle static getDerivedStateFromProps instead.  downloadVideo
  componentWillReceiveProps(nextProps) {
    main.receiveProps(this, nextProps);
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateVideoSize, false);

    const config = { attributes: true, childList: true, subtree: true };
    this.observer = new MutationObserver(this.updateVideoSize);
    this.observer.observe(this.containerNode, config);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateVideoSize);
    this.observer.disconnect();
  }

  render() {
    const { isPlaying } = this.state;
    const { collectionDetail, urls } = this.props;
    const themeId = collectionDetail.getIn(['theme', 'id']) || 'classic-dark';
    const collectionName = collectionDetail.get('name');
    const logo = collectionDetail.get('logo');
    const logoShow = !!collectionDetail.get('logo_show');

    const isFullTheme = checkFullTheme(themeId);
    const themeColor = getThemeColor(themeId);
    const themeBgColor = getThemeBgColor(themeId);
    const logoData = getLogoData(isFullTheme, logo, urls);
    const downloadSetting = collectionDetail.get('downloadSetting') || {};

    const outerContainerStyle = {
      color: themeColor,
      backgroundColor: themeBgColor
    };

    const backgroundStyle = {
      backgroundColor: getBackDropColor(themeId)
    };

    const classicList = ['classic-dark', 'classic-light'];
    const settingStatus =
      downloadSetting.hasOwnProperty('download_status') &&
      downloadSetting.download_status &&
      !__isCN__;

    let downloadClass = classNames(
      'download-video',
      { 'playing-not': isFullTheme },
      { 'classic-theme': !isFullTheme }
    );

    return (
      <div
        className="slide-show-view-section"
        ref={node => (this.containerNode = node)}
        style={outerContainerStyle}
      >
        {settingStatus && !isPlaying && !(isFullTheme && isPlaying) ? (
          <div
            className={downloadClass}
            onClick={() => {
              this.downloadVideo();
            }}
          >
            <div className="download-video-left">Download</div>
            <div className="download-video-right"></div>
          </div>
        ) : null}

        {isFullTheme && this.getVideoContainer()}

        {!(isFullTheme && isPlaying) && (
          <div className="slide-show-theme-container" style={backgroundStyle}>
            {/* <div className="slide-show-studio-name"></div> */}

            <div className="slide-show-project-name">{collectionName}</div>
            {!isFullTheme && this.getVideoContainer(logoData)}
            {!isPlaying && isFullTheme && this.getPlaySection()}
          </div>
        )}
        {!isPlaying && isFullTheme && logoData && logoShow && this.getLogoSection(logoData)}
      </div>
    );
  }
}

export default EditorPublishViewContent;
