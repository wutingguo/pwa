import React from 'react';
import EditorPublishViewContent from '@common/components/slide-show/EditorPublishViewContent';

const getCollectionDetail = (that, product_id) => {
  const { boundProjectActions, history } = that.props;

  if (!product_id) {
    boundGlobalActions.addNotification({
      message: t('ID_REQUIRED_TIP'),
      level: 'error',
      autoDismiss: 3
    });

    return history.back();
  }

  return boundProjectActions.getCollectionDetail(product_id)
    .then(ret => {
      that.setState({ isRequesting: false });
    }, () => that.setState({ isRequesting: false }));
};

/**
 * 
 * @param {*} that 
 */
const renderPreview = that => {
  const {
    collectionDetail,
    urls,
    usedPostCardDetail,
    boundGlobalActions,
    boundProjectActions
  } = that.props;

  if (!collectionDetail.size) {
    return null;
  }

  const { shareUrl } = that.state;

  const contentProps = {
    urls,
    usedPostCardDetail,
    showCloseIcon: false,
    collectionDetail,
    boundGlobalActions,
    boundProjectActions,
    shareUrl
  };
  return <EditorPublishViewContent {...contentProps} />
};

export default {
  getCollectionDetail,
  renderPreview
};