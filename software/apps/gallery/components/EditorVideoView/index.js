import classnames from 'classnames';
import { template } from 'lodash';
import React, { useRef } from 'react';

import XLoading from '@resource/components/XLoading';

import { getSlideShowImageUrl } from '@resource/lib/saas/image';

import { VIDEO_URL } from '@resource/lib/constants/apiUrl';

import jinggao from '@resource/static/icons/jinggao.png';

import { ReactPlayerVideo, XImg, XPureComponent } from '@common/components';

import './index.scss';

function EditorVideoView(props) {
  const { collectionDetail, curSetVideo, urls } = props;
  const videoRef = useRef(null);

  const selectedImgCount = collectionDetail.getIn(['photos', 'selectedImgCount']);
  const selectedVideo = collectionDetail.getIn(['gallery_video_info', 'isSelectVideo']);
  const video_source = collectionDetail.getIn(['gallery_video_info', 'video_source']);
  const showLoding = collectionDetail.getIn(['gallery_video_info', 'showLoding']);
  const galleryBaseUrl = urls.get('galleryBaseUrl');
  const baseUrl = urls.get('baseUrl');
  const cover_img_id = collectionDetail.getIn(['gallery_video_info', 'cover_img_id']);
  const wrapclassName = classnames('gallery-video-container', {
    'editor-selected': selectedVideo,
    disabled: selectedImgCount > 0,
  });
  const handleSelectVideo = () => {
    const { boundProjectActions } = props;
    boundProjectActions.handleSelectionVideo();
  };
  const imgUrl = getSlideShowImageUrl({
    galleryBaseUrl,
    enc_image_uid: cover_img_id,
    isWaterMark: false,
    thumbnail_size: 3,
  });
  const video_url =
    video_source === 1 ? template(VIDEO_URL)({ baseUrl, curSetVideo }) : curSetVideo;
  const playerVideoProps = {
    playing: false,
    style: {
      pointerEvents: 'none',
    },
    ref: videoRef,
    url: video_url,
    className: 'video-player',
    width: '356px',
    height: '200px',
    useVimeo: true,
    id: 'vimeo-video',
  };
  const wrapperStyle = {
    '--background-image': `url(${imgUrl})`,
  };
  return (
    <div className="editor-list">
      <div className="list-title">Video</div>
      <div className={wrapclassName} onClick={() => handleSelectVideo()}>
        {(video_source === 1 || video_source === 3) && (
          <div className="preview-container">
            <ReactPlayerVideo {...playerVideoProps} />
          </div>
        )}
        {video_source === 2 && typeof curSetVideo === 'number' ? (
          <div className="slideshow-preview-container" style={wrapperStyle}>
            <XImg
              src={imgUrl}
              rootClassName="video-overlay-image"
              style={{ width: '100%', height: '100%' }}
            />
            <div className="video-overlay-color"></div>
            <div className="play-icon"></div>
          </div>
        ) : (
          video_source === 2 && (
            <div className="not-found">
              {showLoding ? (
                <XLoading type="imageLoading" isShown={showLoding} zIndex={10} />
              ) : (
                <>
                  <div className="not-found-icon">
                    <img src={jinggao} alt="" />
                  </div>
                  <div className="not-found-text-desc">Slideshow Not Found</div>
                </>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default EditorVideoView;
