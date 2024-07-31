import React, { Component } from 'react';
import SlideShowPreview from '@resource/components/pwa/SlideShowPreview';
import { XPureComponent, XLoading, EmptyContent, XSocialShare } from '@common/components';
import main from './handle/main';
import renderHandler from './handle/render';
import {
  getThemeColor,
  getThemeBgColor,
  checkFullTheme
} from './handle/theme';
import './index.scss';

class EditorPublishViewContent extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false,
      isShowShare: false,
    }
  }

  playVideo = () => main.playVideo(this);
  onAudioEnded = () => main.onAudioEnded(this);
  resetStatus = () => main.resetStatus(this);
  getShareProps = () => main.getShareProps(this);
  handleMouseOver = () => main.handleMouseOver(this);
  handleMouseOut = () => main.handleMouseOut(this);
  getPlaySection = () => renderHandler.getPlaySection(this);
  getPPTcontent = () => renderHandler.getPPTcontent(this);
  getVideoContainer = () => renderHandler.getVideoContainer(this);

  //WARNING! To be deprecated in React v17. Use new lifecycle static getDerivedStateFromProps instead.
  componentWillReceiveProps(nextProps) {
    main.receiveProps(this, nextProps);
  }

  render() {
    const { isPlaying } = this.state;
    const { collectionDetail } = this.props;
    const themeId = collectionDetail.getIn(['theme', 'id']);
    const collectionName = collectionDetail.get('name');
    const isFullTheme = checkFullTheme(themeId);
    const themeColor = getThemeColor(themeId);
    const themeBgColor = getThemeBgColor(themeId);
    
    const outerContainerStyle = {
      color: themeColor,
      backgroundColor: themeBgColor
    }; 
    return (
      <div
        className="slide-show-view-section"
        ref={node => this.containerNode = node}
        style={outerContainerStyle}
      >
        {isFullTheme && this.getVideoContainer()}
        
        {!(isFullTheme && isPlaying) && (
          <div className="slide-show-theme-container">
            {/* <div className="slide-show-studio-name"></div> */}
            <div className="slide-show-project-name">{collectionName}</div>
            {!isFullTheme && this.getVideoContainer()}
            {!isPlaying && isFullTheme && this.getPlaySection()}
          </div>
        )}
        
      </div>
    );
  }
}
 
export default EditorPublishViewContent;