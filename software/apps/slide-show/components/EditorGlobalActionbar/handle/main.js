import { fromJS } from 'immutable';
import { assign, get } from 'lodash';

import {
  ADD_PROJECT_PHOTO_MODAL,
  SHARE_SLIDESHOW_MODAL,
  UPLOAD_HISTORY_IMAGES_MODAL,
} from '@resource/lib/constants/modalTypes';

import { ADD_MUSIC_SLIDESHOW_MODAL, PPT_VIEW_MODAL } from '@apps/slide-show/constants/modalTypes';
import { pauseWaveformVideoEvent } from '@apps/slide-show/utils/eventBus';

/**
 *
 * @param {*} that
 */
const onShare = that => {
  const {
    history: { push },
    params: { id },
  } = that.props;
  push(`/software/slide-show/share/${id}`);
};

/**
 *
 * @param {*} that
 */
const onView = that => {
  window.logEvent.addPageEvent({
    name: 'EditSlideshows_Click_Preview',
  });

  pauseWaveformVideoEvent.dispatch();

  const { boundGlobalActions } = that.props;
  boundGlobalActions.showModal(PPT_VIEW_MODAL, {
    close: () => boundGlobalActions.hideModal(PPT_VIEW_MODAL),
  });
};

/**
 *
 * @param {*} that
 * @param {*} files
 */
const onAddImages = (that, files) => {
  // window.logEvent.addPageEvent({
  //   name: 'EditSlideshows_Click_AddPhotos'
  // });

  const { boundProjectActions } = that.props;

  boundProjectActions.addImages(files);
};

const uploadFromComputer = that => {
  // nothing todo.
  window.logEvent.addPageEvent({
    name: 'SlideshowsAddPhotos_Click_UploadFromComputer',
    plantform: 'PWA',
    modal: 'Slideshow',
  });
};

const uploadFromGallery = that => {
  window.logEvent.addPageEvent({
    name: 'SlideshowsAddPhotos_Click_UploadFromZnoGallery',
    plantform: 'PWA',
    modal: 'Slideshow',
  });
  const { boundGlobalActions, uploadParams } = that.props;

  boundGlobalActions.showModal(UPLOAD_HISTORY_IMAGES_MODAL, {
    sortField: 'gallery',
    project_id: uploadParams.project_id,
    close: () => boundGlobalActions.hideModal(UPLOAD_HISTORY_IMAGES_MODAL),
  });
};

const uploadFromProjectOk = (
  slideShowImages,
  selected,
  projectId,
  boundProjectActions,
  boundGlobalActions
) => {
  // window.logEvent.addPageEvent({
  //   name: 'SlideshowsAddPhotos_Click_AddPhotosFromDesigner'
  // });

  if (slideShowImages.size + selected.length > 300) {
    boundGlobalActions.addNotification({
      message: t('FILE_EXCEEDS_MAXIMUM_TIP'),
      level: 'error',
      autoDismiss: 3,
    });
    // boundGlobalActions.hideModal(ADD_PROJECT_PHOTO_MODAL);
    return false;
  }

  const ids = selected.map(i => i.encImgId);
  boundProjectActions.addGalleryImagesToProject(projectId, ids).then(
    ret => {
      const { isRequestSuccess, data } = ret;

      if (isRequestSuccess) {
        boundGlobalActions.addNotification({
          message: t('UPLOAD_IMAGE_FROM_GALLERY_TO_SLIDE_SUCCESSED_TOAST'),
          level: 'success',
          autoDismiss: 3,
        });

        boundProjectActions.uploadAllComplete(data).then(() => {
          // TODO: 保存数据以更新状态，并重新获取详情
          boundProjectActions.saveSlideshow();
        });
        boundGlobalActions.hideModal(ADD_PROJECT_PHOTO_MODAL);
        return ret;
      }

      boundGlobalActions.addNotification({
        message: t('UPLOAD_IMAGE_FROM_GALLERY_TO_SLIDE_FAILED_TOAST'),
        level: 'error',
        autoDismiss: 3,
      });
      boundGlobalActions.hideModal(ADD_PROJECT_PHOTO_MODAL);
      return Promise.reject(ret);
    },
    err => {
      boundGlobalActions.addNotification({
        message: t('UPLOAD_IMAGE_FROM_GALLERY_TO_SLIDE_FAILED_TOAST'),
        level: 'error',
        autoDismiss: 3,
      });
      boundGlobalActions.hideModal(ADD_PROJECT_PHOTO_MODAL);
      return Promise.reject(err);
    }
  );
};

const uploadFromProject = that => {
  window.logEvent.addPageEvent({
    name: 'SlideshowsAddPhotos_Click_UploadFromDesigner',
  });

  const { boundGlobalActions, boundProjectActions, urls, userInfo, frameList, projectId } =
    that.props;
  const slideShowImages = frameList.map(i => i.getIn(['image', 'enc_image_uid']));
  boundGlobalActions.showModal(ADD_PROJECT_PHOTO_MODAL, {
    urls,
    userInfo,
    slideShowImages,
    projectId,
    close: () => {
      window.logEvent.addPageEvent({
        name: 'SlideshowsAddPhotos_Click_CancelAddPhotosFromDesigner',
      });
      boundGlobalActions.hideModal(ADD_PROJECT_PHOTO_MODAL);
    },
    addProjectModalOk: selected =>
      uploadFromProjectOk(
        slideShowImages,
        selected,
        projectId,
        boundProjectActions,
        boundGlobalActions
      ),
  });
};

const addMusic = that => {
  window.logEvent.addPageEvent({
    name: 'EditSlideshows_Click_AddMusic',
  });

  const { boundGlobalActions, boundProjectActions } = that.props;

  pauseWaveformVideoEvent.dispatch();

  boundGlobalActions.showModal(ADD_MUSIC_SLIDESHOW_MODAL, {
    close: () => {
      boundProjectActions.deleteMusicList();
      boundProjectActions.deleteFavoriteList();
      boundGlobalActions.hideModal(ADD_MUSIC_SLIDESHOW_MODAL);
    },
  });
};

const handleContinue = that => {
  window.logEvent.addPageEvent({
    name: 'EditSlideshows_Click_Continue',
  });

  // 保存会更改状态，固不走保存逻辑
  // const { boundProjectActions } = that.props;
  // boundProjectActions.saveSlideshow();
};

const handleShare = that => {
  const {
    boundProjectActions,
    boundGlobalActions,
    params: { id },
    history,
  } = that.props;

  const { addNotification, hideModal, showModal } = boundGlobalActions;
  const { getSlideshowShareUrl, getResolutionOptions, getSlideshowDownloadUrl } =
    boundProjectActions;
  const { push } = history;

  const data = {
    history,
    title: t('SLIDESHOW_SHARE_TITLE'),
    projectId: id,
    shareSlideshowTabKey: 1,
    getSlideshowDownloadUrl,
    handleCancel: () => hideModal(SHARE_SLIDESHOW_MODAL),
    close: () => hideModal(SHARE_SLIDESHOW_MODAL),
  };

  // 获取分享链接、视频套餐列表
  Promise.all([getSlideshowShareUrl(id), getResolutionOptions(), getSlideshowDownloadUrl(id)]).then(
    responses => {
      console.log('responses: ', responses);

      // Link
      const shareResponse = responses[0];
      const { data: shareDirectLink } = shareResponse;

      // Download resolution
      let resolutionResponse = responses[1];
      const { data: resolutionData } = resolutionResponse;

      assign(data, {
        shareDirectLink: shareDirectLink,
        resolutionData: fromJS(resolutionData),
      });

      // Downlaod url
      let downlaodUrlResponse = responses[2];
      const { ret_code } = downlaodUrlResponse;
      if (ret_code === 200000) {
        push(`/software/slide-show/share/${id}`);
      } else {
        showModal(SHARE_SLIDESHOW_MODAL, data);
      }
    }
  );
};

export default {
  onShare,
  onView,
  onAddImages,
  uploadFromGallery,
  uploadFromProject,
  uploadFromComputer,
  addMusic,
  handleContinue,
  handleShare,
};
