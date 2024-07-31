import Vimeo from '@u-wave/react-vimeo';
import { merge } from 'lodash';
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import ReactPlayer from 'react-player';

const defaultVideoConfig = {
  file: {
    attributes: {
      controlsList: 'nodownload',
    },
  },
};
const Player = (props, ref) => {
  const {
    className,
    url,
    controls = true,
    width,
    height,
    config = {},
    style = {},
    light,
    playing,
    onPlay,
    onPause,
    onDuration,
    useVimeo,
  } = props;
  const playerRef = useRef(null);
  const videoConfig = merge(defaultVideoConfig, config);
  // ref代理句柄
  useImperativeHandle(
    ref,
    () => {
      return {
        getContentRect() {
          return {
            clientWidth: playerRef.current.wrapper.clientWidth,
            clientHeight: playerRef.current.wrapper.clientHeight,
          };
        },
        showPreview() {
          playerRef.current.showPreview();
        },
      };
    },
    [playerRef]
  );
  const isUseVimeo = url.indexOf('vimeo') !== -1 && useVimeo;
  return (
    <div>
      {isUseVimeo ? (
        <Vimeo
          style={style}
          video={url.indexOf('https') !== -1 ? url : `https://${url}`}
          width={width}
          height={height}
          muted={true}
          controls={controls}
          onPlay={onPlay}
          onPause={onPause}
          playing={playing}
        />
      ) : (
        <ReactPlayer
          ref={playerRef}
          className={className}
          controls={controls}
          url={url.indexOf('https') !== -1 ? url : `https://${url}`}
          width={width}
          height={height}
          muted={true}
          style={style}
          light={light}
          playing={playing}
          config={videoConfig}
          onPlay={onPlay}
          onPause={onPause}
          onDuration={onDuration}
        />
      )}
    </div>
  );
};

export default forwardRef(Player);
