import { assign } from 'lodash';
import { fromJS } from 'immutable';
import { SHARE_SLIDESHOW_MODAL } from '@resource/lib/constants/modalTypes';
import { projectProsessMap } from '@apps/slide-show/constants/strings';
import { getCollectionStatus } from '@apps/slide-show/utils/helper';

/**
 * 三合一弹窗
 */
const getShareSlideshowModal = that => {
  // debugger
  const { boundProjectActions, boundGlobalActions, collectionDetail, history } = that.props;

  const id = collectionDetail.get('id');
  const slideName = collectionDetail.get('name');
  const { addNotification, hideModal, showModal } = boundGlobalActions;
  const {
    getSlideshowShareUrl,
    getResolutionOptions,
    getSlideshowDownloadUrl,
    getResolutionStatus
  } = boundProjectActions;

  const data = {
    history,
    title: t('SLIDESHOW_SHARE_TITLE'),
    projectId: id,
    slideName,
    shareSlideshowTabKey: 1,
    getSlideshowDownloadUrl,
    handleCancel: () => hideModal(SHARE_SLIDESHOW_MODAL),
    close: () => hideModal(SHARE_SLIDESHOW_MODAL)
  };

  // 获取分享链接、视频套餐列表
  Promise.all([
    getSlideshowShareUrl(id),
    getResolutionOptions(),
    getResolutionStatus({ project_id: id, definition: 1 })
  ]).then(responses => {
    console.log('share Slideshow 弹窗弹起 responses: ', responses);

    // Link
    const shareResponse = responses[0];
    const { data: shareDirectLink } = shareResponse;

    // Download
    let resolutionResponse = responses[1];
    const { data: resolutionData } = resolutionResponse;
    const makeVideoResponse = responses[2];
    const { data: makeVideoStatus } = makeVideoResponse;

    assign(data, {
      shareDirectLink: shareDirectLink,
      resolutionData: fromJS(resolutionData)
      // makeVideoStatus: makeVideoStatus
    });
    showModal(SHARE_SLIDESHOW_MODAL, data);
  });
};

/**
 * 发布slideshow. 先执行保存操作.
 * @param {*} that
 */
const handlePublish = that => {
  const { boundProjectActions, boundGlobalActions, collectionDetail } = that.props;

  const { showRevert } = that.state;

  if (that.state.isPublishing) {
    return;
  }
  const id = collectionDetail.get('id');
  window.logEvent.addPageEvent({
    name: 'SlideshowsConfig&Publish_Click_Publish'
  });
  that.setState({
    isPublishing: true
  });
  boundProjectActions
    .saveSlideshow()
    .then(() => {
      boundProjectActions.publishSlideshow(id).then(ret => {
        const { isRequestSuccess } = ret;

        if (isRequestSuccess) {
          boundGlobalActions.addNotification({
            message: showRevert
              ? t('SLIDESHOW_UPDATE_SUCCESSED')
              : t('SLIDESHOW_PUBLISH_SUCCESSED'),
            level: 'success',
            autoDismiss: 3
          });

          boundProjectActions.getSlideshowList().then(() => {
            // TODO: 保存数据以更新状态，并重新获取详情
            boundProjectActions.getCollectionDetail(id);

            getShareSlideshowModal(that);
          });
        }
        that.setState({
          isPublishing: false
        });
      });
    })
    .catch(error => {
      that.setState({
        isPublishing: false
      });
    });
};

/**
 * 下载
 * @param {*} that
 */
const handleDownload = that => {
  getShareSlideshowModal(that);
  window.logEvent.addPageEvent({
    name: 'SlideshowsConfig&Publish_Click_Download'
  });
};

const handleShare = that => {
  const {
    match: {
      params: { id }
    },
    history
  } = that.props;

  const { push } = history;

  window.logEvent.addPageEvent({
    name: 'SlideshowsConfig&Publish_Click_Share'
  });

  push(`/software/slide-show/share/${id}`);
};

const handleRevert = that => {
  console.log('revert');
  const { boundProjectActions, boundGlobalActions, collectionDetail } = that.props;

  const id = collectionDetail.get('id');
  window.logEvent.addPageEvent({
    name: 'SlideshowsConfig&Publish_Click_RevertEdits'
  });

  const { hideConfirm, showConfirm } = boundGlobalActions;

  const data = {
    className: 'revert-slideshow-modal',
    title: t('SLIDESHOW_REVERT_EDITS'),
    message: t('SLIDESHOW_REVERT_EDITS_DESC'),
    close: () => {
      window.logEvent.addPageEvent({
        name: 'SlideshowsRevertEditsPop_Click_Cancel'
      });

      hideConfirm();
    },
    buttons: [
      {
        className: 'white pwa-btn',
        text: t('CANCEL'),
        onClick: () => {
          window.logEvent.addPageEvent({
            name: 'SlideshowsRevertEditsPop_Click_Cancel'
          });

          hideConfirm();
        }
      },
      {
        className: 'pwa-btn',
        text: t('REVERT'),
        onClick: () => {
          window.logEvent.addPageEvent({
            name: 'SlideshowsRevertEditsPop_Click_Revert'
          });

          boundProjectActions
            .revertSlideshow(id)
            .then(ret => {
              const { isRequestSuccess } = ret;

              if (isRequestSuccess) {
                boundGlobalActions.addNotification({
                  message: t('SLIDESHOW_REVERT_SUCCESSED'),
                  level: 'success',
                  autoDismiss: 3
                });
              }
            })
            .catch(error => {});
        }
      }
    ]
  };
  showConfirm(data);
};

const getBtnsStatus = (that, collectionDetail) => {
  const projectStatus = collectionDetail && collectionDetail.get('status');
  const projectVersion = collectionDetail && collectionDetail.get('version');

  const projectProsess = getCollectionStatus(projectStatus, projectVersion);

  that.setState({
    disableShare: projectProsessMap.PUBLISHED !== projectProsess ? 'disable' : '',
    disableDownload: projectProsessMap.PUBLISHED !== projectProsess ? 'disable' : '',
    disablePublish: projectProsessMap.PUBLISHED === projectProsess ? 'disable' : '',
    showRevert: projectProsessMap.REVERTABLE === projectProsess,
    publishText:
      projectProsessMap.PUBLISHED === projectProsess
        ? t('PUBLISHED')
        : projectProsessMap.REVERTABLE === projectProsess
        ? t('UPDATE')
        : t('PUBLISH')
  });
};

export default {
  handlePublish,
  handleDownload,
  handleShare,
  handleRevert,
  getBtnsStatus
};
