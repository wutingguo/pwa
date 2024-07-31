import { template } from 'lodash';
import { fromJS } from 'immutable';
import { CONFIRM_MODAL } from '@resource/lib/constants/modalTypes';
import { SAAS_SET_IMAGE_ORIENTATION_URL } from '@resource/lib/constants/apiUrl';
import { downImage } from '@resource/lib/utils/image';

// 下载图片
function onDownload() {
  const { urls, selectedImgCount, collectionDetail } = this.props;
  if (selectedImgCount < 1) return;
  const selectedImg = collectionDetail.getIn(['photos', 'selectedImgList']);
  selectedImg.forEach(item => {
    const image_uid = item.get('enc_image_id');
    const image_name = item.get('image_name');
    const suffix = item.get('suffix');
    const url = template(SAAS_SET_IMAGE_ORIENTATION_URL)({
      image_uid,
      galleryBaseUrl: urls.get('galleryBaseUrl'),
      thumbnail_size: 1
    });
    const imgName = image_name + suffix;
    downImage(url, imgName);
  });
}

// 删除图片
function onDelete() {
  const {
    collectionDetail,
    boundGlobalActions,
    boundProjectActions,
    selectedImgCount
  } = this.props;
  const { showModal, hideModal, addNotification, getMySubscription } = boundGlobalActions;
  const title = selectedImgCount === 1 ? t('DELETE_PHOTO') : t('DELETE_PHOTOS');
  const message =
    selectedImgCount === 1 ? t('SURE_TO_DELETE_PHOTO') : t('SURE_TO_DELETE_MULTI_PHOTOS');
  const collection_image_uid = collectionDetail
    .getIn(['photos', 'selectedImgList'])
    .map(img => img.get('collection_image_id'));
  const collection_uid = collectionDetail.get('collection_id');
  const data = {
    title,
    message,
    close: () => hideModal(CONFIRM_MODAL),
    buttons: [
      {
        text: t('CANCEL'),
        className: 'confirm-btn-delete-cancel'
      },
      {
        text: t('DELETE'),
        className: 'confirm-btn-delete-confirm',
        onClick: () => {
          const bodyParams = { collection_image_uid, collection_uid };
          boundProjectActions.deletePhotoRequest(bodyParams).then(
            response => {
              const { ret_code, data } = response;
              if (ret_code === 200000 && data) {
                boundProjectActions.updateImgListAfterDelte(collection_image_uid);
                addNotification({
                  message: t('PHOTO_DELETED'),
                  level: 'success',
                  autoDismiss: 2
                });
              } else {
                // error handler
                addNotification({
                  message: t('FAILED_TO_DELETE_PHOTO'),
                  level: 'error',
                  autoDismiss: 2
                });
              }
            },
            error => {
              addNotification({
                message: t('FAILED_TO_DELETE_PHOTO'),
                level: 'error',
                autoDismiss: 2
              });
            }
          );
        }
      }
    ]
  };
  showModal(CONFIRM_MODAL, data);
}

function editImageViewer() {
  const { toAiClick, collectionDetail, boundProjectActions } = this.props;
  const selectedImg = collectionDetail.getIn(['photos', 'selectedImgList']);
  const selectedImageId = selectedImg.size > 0 ? selectedImg.getIn([0, 'enc_image_id']) : '';

  toAiClick(
    {
      selectedImageId
    },
    () => {
      boundProjectActions.handleClearSelectImg();
    }
  );
}

export default {
  onDownload,
  onDelete,
  editImageViewer
};
