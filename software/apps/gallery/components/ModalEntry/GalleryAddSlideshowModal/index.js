import classNames from 'classnames';
import { template } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';

import { SAAS_GET_IMAGE_WITH_ORIENTATION_URL } from '@resource/lib/constants/apiUrl';

import { XButton, XCheckBox, XModal, XRadio } from '@common/components';

import './index.scss';

const GalleryAddSlideshowModal = props => {
  const { closeModal, boundGlobalActions, boundProjectActions, collectionDetail } = props;
  const set_uid = collectionDetail.currentSetUid;

  const [slideshowList, setSlideshowList] = useState(null);
  const [params, setParams] = useState(null);
  useEffect(() => {
    boundProjectActions.getSetSlideshowList().then(data => {
      if (data) {
        // const records = data.records.map((item, index) => {
        //   if (index === 0) {
        //     const { enc_project_id, slides_name } = item;
        //     item.selected = true;
        //     setParams({
        //       uidpk: '',
        //       collection_set_id: set_uid,
        //       video_id: enc_project_id,
        //       video_source: 2,
        //       video_name: slides_name,
        //       video_size: '',
        //       video_suffix: '',
        //     });
        //   }
        //   return item;
        // });
        const records = data.records;
        setSlideshowList(records);
      }
    });
  }, []);
  const handleSelect = item => {
    const { enc_project_id, slides_name } = item;
    setParams({
      uidpk: '',
      collection_set_id: set_uid,
      video_id: enc_project_id,
      video_source: 2,
      video_name: slides_name,
      video_size: '',
      video_suffix: '',
    });
    setSlideshowList(() => {
      return slideshowList.map(slideshow => {
        if (slideshow.id === item.id) {
          slideshow.selected = true;
        } else {
          slideshow.selected = false;
        }
        return slideshow;
      });
    });
  };
  const onAddSlideshow = () => {
    boundProjectActions.saveSetSlideshowVideo(params).then(res => {
      const { ret_code } = res;
      if (ret_code === 200000) {
        boundProjectActions
          .getSetVideoInfo({
            collection_set_id: set_uid,
          })
          .then(videoInfo => {
            const { video_source, video_id } = videoInfo;
            if (video_source === 2) {
              boundProjectActions.getSlideshowInfo(video_id);
            }
          });
        closeModal();
        boundGlobalActions.addNotification({
          level: 'success',
          message: 'Slideshow successfully added.',
          autoDismiss: 3,
        });
      }
    });
  };
  const onCancle = () => {
    closeModal();
  };
  const hasSelectVideo = slideshowList && slideshowList.find(item => item.selected);

  return (
    <XModal className="gallery-add-slideshow-modal" opened onClosed={closeModal}>
      <div className="title-text">Add From Zno Slideshow</div>
      <div className="tips-text">Select your slideshows created by Zno Slideshow.</div>
      <div className="slideshow-list-container">
        {slideshowList &&
          slideshowList.map((item, index) => {
            return (
              <div
                className={classNames('slideshow-item-container', {
                  'selector-active': item.selected,
                })}
                key={index}
                onClick={() => handleSelect(item)}
              >
                {item.slides_name}
              </div>
            );
          })}
        {!slideshowList ||
          (slideshowList.length === 0 && (
            <div className="slideshow-empty-content">
              <div className="empty-title">No Published Slideshows!</div>
            </div>
          ))}
      </div>

      <div className="footer-btn">
        <XButton className="white pwa-btn" onClicked={onCancle}>
          Cancel
        </XButton>
        <XButton
          className="pwa-btn"
          onClicked={onAddSlideshow}
          disabled={!slideshowList || slideshowList.length === 0 || !hasSelectVideo}
        >
          Add Slideshow
        </XButton>
      </div>
    </XModal>
  );
};

export default GalleryAddSlideshowModal;
