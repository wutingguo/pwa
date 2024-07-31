const optionsMoveCopy = [
  {
    iconType: 'move-photo',
    tooltip: t('MOVE_PHOTO'),
    unfold: true,
    multiDisable: false,
    actionType: 'onMovePhoto',
  },
  {
    iconType: 'copy-photo',
    tooltip: t('COPY_PHOTO'),
    unfold: true,
    multiDisable: false,
    actionType: 'onCopyPhoto',
  },
];

const optionsConfigOther = [
  {
    iconType: 'zoom-out',
    tooltip: t('ZOOM_OUT'),
    unfold: true,
    multiDisable: false,
    actionType: 'showImageViewer',
  },
  {
    iconType: 'water-mark',
    tooltip: t('WATER_MARK'),
    unfold: true,
    multiDisable: false,
    actionType: 'showWaterMarkModal',
  },
  {
    iconType: 'download',
    tooltip: t('DOWNLOAD_PHOTO'),
    unfold: true,
    multiDisable: false,
    actionType: 'onDownload',
  },
  {
    iconType: 'delete',
    tooltip: t('DELETE'),
    unfold: true,
    multiDisable: false,
    actionType: 'onDelete',
  },
  {
    iconType: 'make-cover',
    tooltip: t('MAKE_COVER'),
    unfold: false,
    multiDisable: true,
    actionType: 'onMakeCover',
  },
  {
    iconType: 'rename-1',
    tooltip: t('RENAME'),
    unfold: false,
    multiDisable: true,
    actionType: 'onRenameImage',
  },
];

const optionsLike = [
  {
    iconType: 'to-recommend',
    tooltip: t('RECOMMEND'),
    unfold: true,
    multiDisable: false,
    recommend: true,
    actionType: 'onRecommendPhoto',
  },
  {
    iconType: 'cancel-recommend',
    tooltip: t('CANCEL_RECOMMEND'),
    unfold: true,
    multiDisable: false,
    recommend: false,
    actionType: 'onCancelRecommendPhoto',
  },
];

export const optionsConfig = __isCN__
  ? optionsLike.concat(optionsMoveCopy, optionsConfigOther)
  : optionsMoveCopy.concat(optionsConfigOther);
