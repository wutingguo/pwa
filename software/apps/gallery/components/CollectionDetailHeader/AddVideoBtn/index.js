import classNames from 'classnames';
import { isEqual } from 'lodash';
import React, { Component, Fragment, memo, useCallback, useEffect, useRef, useState } from 'react';

import '../index.scss';

import VideoLink from './VideoLink';

const AddVideo = memo(props => {
  const { boundGlobalActions, uploadVideoBtn, collectionDetail, curSetVideo, boundProjectActions } =
    props;
  const [popVisible, setPopVisible] = useState(false);
  const [isShowAddLink, setShowAddlink] = useState(false);
  const set_uid = collectionDetail && collectionDetail.get('currentSetUid');
  const handleMouse = useCallback(() => {
    if (curSetVideo) return;
    setPopVisible(true);
  }, [popVisible, collectionDetail]);
  const handleMouseLeave = () => {
    setPopVisible(false);
  };
  const handleClickFromLink = useCallback(() => {
    setPopVisible(false);
    setShowAddlink(true);
  }, [collectionDetail]);
  const handleClickFromSlideshow = () => {
    setShowAddlink(false);
    boundGlobalActions.showModal('GALLERY_ADD_SLIDESHOW_MODAL', {
      collectionDetail,
    });
  };
  const handleAddVideoLink = useCallback(
    (url, video_source) => {
      boundProjectActions
        .saveSetSlideshowVideo({
          video_id: url,
          video_source,
          collection_set_id: set_uid,
        })
        .then(res => {
          const { ret_code } = res;
          if (ret_code === 200000) {
            boundProjectActions
              .getSetVideoInfo({
                collection_set_id: set_uid,
              })
              .then(videoInfo => {
                const { video_source, video_id } = videoInfo;
              });
            boundGlobalActions.addNotification({
              level: 'success',
              message: 'successfully added.',
              autoDismiss: 3,
            });
          }
        });
      setShowAddlink(false);
    },
    [collectionDetail]
  );
  const handleCancelVideoLink = useCallback(() => {
    setShowAddlink(false);
    setPopVisible(false);
  }, [popVisible, isShowAddLink]);
  return (
    <div className="add-video-container" onMouseEnter={handleMouse} onMouseLeave={handleMouseLeave}>
      <div className={classNames('add-btn', { disabled: curSetVideo })}>Add Video</div>
      {!curSetVideo && (
        <ul className={classNames('add-video-menu', { isShow: popVisible })}>
          <li className="add-video-menu-item">{uploadVideoBtn}</li>
          <li className="add-video-menu-item" onClick={handleClickFromLink}>
            Add From Link
          </li>
          <li className="add-video-menu-item" onClick={handleClickFromSlideshow}>
            Add From Zno Slideshow
          </li>
        </ul>
      )}
      {isShowAddLink && <VideoLink onAdd={handleAddVideoLink} onCancel={handleCancelVideoLink} />}
    </div>
  );
});

export default AddVideo;
