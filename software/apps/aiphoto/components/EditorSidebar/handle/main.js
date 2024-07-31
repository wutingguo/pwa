import { NEW_COLLECTION_MODAL } from '@apps/aiphoto/constants/modalTypes';

export const handleRenameCover = (that, tName, tCode, categoryCode) => {
  const {
    boundGlobalActions,
    boundProjectActions: {
      getPfcTopicEffects,
      updateAiPhotoBatch,
      postAiPhotoBatch,
      getCollectionOpration
    },
    effectsList,
    categoryList,
    collectionDetail
  } = that.props;
  const { hideModal, showModal } = boundGlobalActions;
  const collectionStatus = collectionDetail.get('collection_status');
  if (collectionStatus === 1) {
    return false;
  }

  const data = {
    title: t('EDIT_COLLECTION'),
    requiredTip: t('COLLECTION_NAME_REQUIRED'),
    illegalTip: t('CREATE_COLLECTION_ILLEGAL_TIP'),
    isHideSelect: true,
    editOpt: {
      name: tName,
      code: tCode,
      categoryCode
    },
    okBtnText: 'OK',
    handleSave: inputValue => {
      const id = collectionDetail.get('collection_id');
      window.logEvent.addPageEvent({
        name: 'ModifyPresetPop_Click_Confirm'
      });
      // getCollectionOpration(id).then(({ is_topic }) => {
      //   if (is_topic) {
      postAiPhotoBatch(id, inputValue).then(res => {
        if (res.ret_code === 200000) {
          updateAiPhotoBatch(inputValue);
          hideModal(NEW_COLLECTION_MODAL);
        }
      });
      // }
      // });
    },
    handleCancel: () => {
      window.logEvent.addPageEvent({
        name: 'ModifyPresetPop_Click_Concel'
      });
      hideModal(NEW_COLLECTION_MODAL);
    },
    close: () => {
      window.logEvent.addPageEvent({
        name: 'ModifyPresetPop_Click_Concel'
      });
      hideModal(NEW_COLLECTION_MODAL);
    }
  };

  showModal(NEW_COLLECTION_MODAL, data);
};
