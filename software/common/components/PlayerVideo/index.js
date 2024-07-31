import classnames from 'classnames';
import { fromJS } from 'immutable';
import { template } from 'lodash';
import React, { Fragment, useEffect, useRef, useState } from 'react';

import XLoading from '@resource/components/XLoading';

import { VIDEO_URL } from '@resource/lib/constants/apiUrl';

import { ReactPlayerVideo } from '@common/components';

import icon from './icon.svg';

import './index.scss';

function PlayerVideo(props) {
  const { curSetVideo, urls, width, height, video_source, boundProjectActions, showLoding } = props;
  const baseUrl = urls.get('baseUrl');
  const hasSlideshow = typeof curSetVideo === 'number';
  const [state, setState] = useState({
    playing: false,
    style: {},
    url: '',
  });
  useEffect(() => {
    if (video_source === 2 && hasSlideshow) {
      boundProjectActions.getSlideshowShareUrl(curSetVideo).then(res => {
        const { ret_code, data } = res;
        if (ret_code === 200000) {
          setState({ ...state, url: data });
        }
      });
    } else if (video_source === 3) {
      setState({ ...state, url: curSetVideo });
    } else {
      setState({ ...state, url: template(VIDEO_URL)({ baseUrl, curSetVideo }) });
    }
  }, [curSetVideo, video_source]);
  const { playing, config, style, url } = state;

  const videoRef = useRef(null);

  const handlePlay = () => {
    videoRef.current.play();
    setState({ ...state, playing: true });
  };
  const handlePause = () => {
    videoRef.current.pause();
    setState({ ...state, playing: false });
  };

  const playerProps = {
    playing,
    config,
    style,
    ref: videoRef,
    url,
    className: 'video-player',
    width,
    height,
    onPlay: handlePlay,
    onPause: handlePause,
  };
  return (
    <div className="react-player-video">
      {(video_source === 1 || video_source === 3) && (
        <ReactPlayerVideo {...playerProps}></ReactPlayerVideo>
      )}
      {video_source === 2 && (
        <div className="slideshow-video-view" style={{ width, height }}>
          {showLoding ? (
            <XLoading type="imageLoading" size="lg" isShown={showLoding || !url} zIndex={10} />
          ) : hasSlideshow ? (
            <iframe className="slideshow-video-iframe" src={url}></iframe>
          ) : (
            <div className="error-page">
              <img className="icon" src={icon} />
              <div className="text">
                <div> Opps...</div>
                <div>Slideshow Not Found!</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PlayerVideo;
