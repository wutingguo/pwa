const optionsMoveCopy = [
  {
    iconType: 'move-photo',
    tooltip: t('MOVE_PHOTO'),
    unfold: true,
    multiDisable: false,
    actionType: 'onMovePhoto'
  },
  {
    iconType: 'copy-photo',
    tooltip: t('COPY_PHOTO'),
    unfold: true,
    multiDisable: false,
    actionType: 'onCopyPhoto'
  }
];

const optionsConfigOther = [
  {
    tooltip: t('ZOOM_OUT'),
    unfold: true,
    multiDisable: false,
    actionType: 'editImageViewer'
  },
  {
    tooltip: t('DOWNLOAD_PHOTO'),
    unfold: true,
    multiDisable: true,
    actionType: 'onDownload',
    logEventName: 'AiPhotosCollection_Click_DownloadPhotos'
  },
  {
    tooltip: t('DELETE'),
    unfold: true,
    multiDisable: false,
    actionType: 'onDelete',
    logEventName: 'AiPhotosCollection_Click_DeletePhotos'
  }
];

export const optionsConfig = optionsConfigOther;
