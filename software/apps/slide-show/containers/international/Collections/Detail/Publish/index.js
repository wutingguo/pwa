import React from 'react';
import { fromJS } from 'immutable';
import { XPureComponent } from '@common/components';
import equals from '@resource/lib/utils/compare';
import CollectionDetailHeader from '@apps/slide-show/components/CollectionDetailHeader';
import EditorPublishcontent from '@apps/slide-show/components/EditorPublishcontent';

import './index.scss';
import main from './handle/main';

class CollectionPublish extends XPureComponent {
  state = {
    isPublishing: false,

    disableShare: true,
    disableDownload: true,
    disablePublish: true,
    showRevert: true,
    publishText: t('PUBLISH')
  };

  handlePublish = () => main.handlePublish(this);
  handleRevert = () => main.handleRevert(this);
  handleShare = () => main.handleShare(this);
  handleDownload = () => main.handleDownload(this);
  getBtnsStatus = collectionDetail => main.getBtnsStatus(this, collectionDetail);

  componentDidMount() {
    const { collectionDetail } = this.props;
    this.getBtnsStatus(collectionDetail);
  }

  componentWillReceiveProps(nextProps) {
    const { collectionDetail } = this.props;
    const { collectionDetail: nextCollectionDetail } = nextProps;

    const isEqual = equals(collectionDetail, nextCollectionDetail);
    if (!isEqual) {
      this.getBtnsStatus(nextCollectionDetail);
    }
  }

  render() {
    const {
      urls,
      history,
      baseUrl,
      userStorage,
      match: { params },
      boundGlobalActions,
      boundProjectActions,
      usedPostCardDetail,
      collectionDetail = fromJS({}),
      isDetailRequestDone,
      collectionPreviewUrl,
      mySubscription,
      selectedImages,
      isShowEmptyContent,
      isShowContentLoading
    } = this.props;

    const { disableShare, disableDownload, disablePublish, showRevert, publishText } = this.state;

    const headerProps = {
      className: 'slideshow-editor-publish-action-bar',
      history,
      params,
      // title: t('SLIDESHOW_CONFIG_PUBLISH'),
      title: __isCN__ ? t('SLIDESHOW_CONFIG_PUBLISH') : t('DESIGN_PUBLISH'),
      showDownload: true,
      showPublish: true,
      showView: false,
      showContinue: false,
      // showRevert: false,

      disableShare,
      disableDownload,
      disablePublish,
      showRevert,
      publishText,

      handlePublish: this.handlePublish,
      handleRevert: this.handleRevert,
      handleShare: this.handleShare,
      handleDownload: this.handleDownload
    };
    // 图片列表.
    const publishProps = {
      urls,
      mySubscription,
      usedPostCardDetail,
      collectionDetail,
      isShowEmptyContent,
      selectedImages,
      isShowContentLoading,
      boundProjectActions,
      boundGlobalActions,
      history
    };

    return (
      <div className="slide-show-editor-content-wrapper slide-show-collection-detail-publish">
        {/* 主渲染区域. */}
        <div className="content">
          {/* 全局的action bar */}
          <CollectionDetailHeader {...headerProps} />

          {/* 图片列表区域 */}
          <EditorPublishcontent {...publishProps} />
        </div>
      </div>
    );
  }
}

export default CollectionPublish;
