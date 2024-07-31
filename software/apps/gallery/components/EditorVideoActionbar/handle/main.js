import { get, template } from 'lodash';
import React from 'react';

import { VIDEO_URL } from '@resource/lib/constants/apiUrl';
import { CONFIRM_MODAL } from '@resource/lib/constants/modalTypes';

import * as xhr from '@resource/websiteCommon/utils/xhr';

// 删除视频
function onDelete() {
  const { collectionDetail, boundGlobalActions, boundProjectActions } = this.props;
  const { showModal, hideModal, addNotification } = boundGlobalActions;
  const title = t('Remove Video From Set?');
  const message = t('Are you sure you want to remove the video from this set?');

  const set_uid =
    collectionDetail.get('currentSetUid') || collectionDetail.getIn(['default_set', 'set_uid']);
  const uidpk = collectionDetail.getIn(['gallery_video_info', 'uidpk']);
  const video_source = collectionDetail.getIn(['gallery_video_info', 'video_source']);

  const data = {
    title,
    message: (
      <div style={{ textAlign: 'left', marginBottom: '46px' }}>
        {message}
        {video_source === 3 && (
          <div style={{ marginTop: '32px', color: '#7B7B7B', fontSize: '14px' }}>
            * This will not affect your original video.
          </div>
        )}
      </div>
    ),
    close: () => hideModal(CONFIRM_MODAL),
    buttons: [
      {
        text: t('CANCEL'),
        className: 'confirm-btn-delete-cancel',
      },
      {
        text: t('Remove'),
        className: 'confirm-btn-delete-confirm',
        onClick: () => {
          const bodyParams = { uidpk };
          boundProjectActions.deleteSetVideoInfo(bodyParams).then(
            response => {
              const { ret_code } = response;
              if (ret_code === 200000) {
                boundProjectActions.getSetVideoInfo({
                  collection_set_id: set_uid,
                });
                addNotification({
                  message: t('Successfully removed.'),
                  level: 'success',
                  autoDismiss: 2,
                });
              } else {
                // error handler
                addNotification({
                  message: t('FAILED_TO_DELETE_VIDEO'),
                  level: 'error',
                  autoDismiss: 2,
                });
              }
            },
            error => {
              addNotification({
                message: t('FAILED_TO_DELETE_VIDEO'),
                level: 'error',
                autoDismiss: 2,
              });
            }
          );
        },
      },
    ],
  };
  showModal(CONFIRM_MODAL, data);
}

function onClickView() {
  const { boundGlobalActions, urls, collectionDetail, boundProjectActions } = this.props;
  const curSetVideo = collectionDetail.getIn(['gallery_video_info', 'video_id']);
  const video_source = collectionDetail.getIn(['gallery_video_info', 'video_source']);
  const baseUrl = urls.get('baseUrl');
  const video_url =
    video_source === 1 ? template(VIDEO_URL)({ baseUrl, curSetVideo }) : curSetVideo;

  if (video_source === 2 && typeof curSetVideo !== 'number') {
    boundGlobalActions.addNotification({
      message: t('Slideshow Not Found!'),
      level: 'error',
      autoDismiss: 3,
    });
    return;
  }
  boundGlobalActions.showModal('VIDEO_VIEWER_MODAL', {
    videoUrl: video_url,
    video_id: curSetVideo,
    video_source,
  });
}
export default {
  onDelete,
  onClickView,
};
