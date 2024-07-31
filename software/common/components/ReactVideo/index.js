import React, { useRef } from 'react';
import { useState } from 'react';

// import ReactPlayer from 'react-player';
import './index.scss';

export default function ReactVideo(props) {
  const { url, coverUrl, ...rest } = props;
  const [playing, setPlaying] = useState(true);
  const videoRef = useRef(null);

  function playClick() {
    videoRef.current.play();
  }
  return (
    <div className="react_video">
      <video
        ref={videoRef}
        src={url}
        poster={coverUrl}
        crossOrigin="anonymous"
        controls
        playsInline
        style={{ height: '100%', width: '100%' }}
      >
        <source src={url} type="video/mp4" />
      </video>
      {/* <ReactPlayer ref={videoRef} url={url} light={coverUrl} {...rest} /> */}
      {/* {coverUrl ? <div className='coverImage' onClick={playClick}>
            <img src={coverUrl} className='img' />
        </div> : null} */}
    </div>
  );
}
