import classnames from 'classnames';
import { fromJS } from 'immutable';
import { isEqual } from 'lodash';
import React, { Fragment, useEffect, useRef, useState } from 'react';

import { saasProducts } from '@resource/lib/constants/strings';

import { ReactPlayerVideo, XModal } from '@common/components';

import './index.scss';

function VideoViewerModal(props) {
  const { videoUrl, closeModal, video_id, video_source, boundProjectActions } = props;
  const [state, setState] = useState({
    playing: true,
    style: {},
    url: videoUrl,
  });
  const { playing, config, style, url } = state;
  useEffect(() => {
    if (video_source === 2) {
      boundProjectActions.getSlideshowShareUrl(video_id).then(res => {
        const { ret_code, data } = res;
        if (ret_code === 200000) {
          setState({ ...state, url: data });
        }
      });
    } else if (video_source === 3) {
      setState({ ...state, url: video_id });
    }
  }, []);
  const videoRef = useRef(null);

  const handlePlay = () => {
    setState({ ...state, playing: true });
  };
  const handlePause = () => {
    setState({ ...state, playing: false });
  };

  const playerProps = {
    playing,
    config,
    style,
    ref: videoRef,
    url,
    className: 'video-player',
    width: '1000px',
    height: '563px',
    onPlay: handlePlay,
    onPause: handlePause,
    useVimeo: true,
  };
  return (
    <XModal
      className="gallery-video-viewer-modal"
      opened={true}
      onClosed={closeModal}
      isHideIcon={false}
    >
      {(video_source === 1 || video_source === 3) && (
        <ReactPlayerVideo {...playerProps}></ReactPlayerVideo>
      )}
      {video_source === 2 && (
        <div className="slideshow-video-view">
          {url ? (
            <iframe className="slideshow-video-iframe" src={url}></iframe>
          ) : (
            <div className="slideshow-video-error">
              Opps... <br />
              Slideshow Not Found!
            </div>
          )}
        </div>
      )}
    </XModal>
  );
}

export default VideoViewerModal;
