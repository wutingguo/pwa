import React from 'react';
import { fromJS } from 'immutable';
import { XPureComponent } from '@common/components';
import EditorGlobalActionbar from '@apps/aiphoto/components/EditorGlobalActionbar';
import EditorSelectionActionbar from '@apps/aiphoto/components/EditorSelectionActionbar';
import EditorImageList from '@apps/aiphoto/components/EditorImageList';
import { saasProducts } from '@resource/lib/constants/strings';
import XExternalDropDirectory from '@resource/components/XExternalDropDirectory';
import mainHandler from './handle/main';

import './index.scss';
import { getUploadModalParams } from '@apps/aiphoto/components/ModalEntry/getParams';
import ImageViewerModal from '@apps/gallery/components/ModalEntry/ImageViewerModal';

class CollectionDetailPhoto extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedImages: fromJS([])
    };
    this.preCheckUploadCondition = this.preCheckUploadCondition.bind(this);
  }

  preCheckUploadCondition() {
    return true;
  }

  render() {
    const {
      urls,
      history,
      baseUrl,
      match: { params },
      boundGlobalActions,
      boundProjectActions,
      collectionDetail,
      isDetailRequestDone,
      collectionPreviewUrl,
      isShowContentLoading
    } = this.props;
    const uploadParams = getUploadModalParams;
    const { selectedImages } = this.state;
    const isShownImageViewer = collectionDetail.getIn(['photos', 'isShownImageViewer']);
    const selectedImgList = collectionDetail.getIn(['photos', 'selectedImgList']);
    const selectedImgCount = collectionDetail.getIn(['photos', 'selectedImgCount']);
    const collectionStatus = collectionDetail.get('collection_status');
    const imageList = collectionDetail.get('images');

    let isShowEmptyContent = false;
    if (isDetailRequestDone) {
      if (imageList && imageList.size === 0) {
        isShowEmptyContent = true;
      }
    }

    // 全局的action bar
    const globalActionbarProps = {
      history,
      params,
      uploadParams,
      collectionPreviewUrl,
      preCheckUploadCondition: this.preCheckUploadCondition,
      boundGlobalActions,
      boundProjectActions,
      collectionDetail
    };

    // 图片选择后的action bar
    const selectionActionbarProps = {
      urls,
      selectedImgCount,
      collectionDetail,
      boundGlobalActions,
      toAiClick: (...opt) => mainHandler.toAiClick(this, ...opt),
      boundProjectActions,
      collectionStatus,
      imageList
    };

    // 外部文件上传
    const externalDropProps = {
      boundGlobalActions: {
        showModal: boundGlobalActions.showModal,
        addImages: boundProjectActions.addImages
      },
      uploadParams,
      isDisableDragExternalFiles: collectionStatus === 2, //修图完成后禁止上传
      acceptFileType: 'image/jpeg,image/jpg'
    };

    // 图片列表.
    const imageListProps = {
      urls,
      collectionDetail,
      isShowEmptyContent,
      toAiClick: (...opt) => mainHandler.toAiClick(this, ...opt),
      selectedImages,
      uploadParams,
      isShowContentLoading,
      preCheckUploadCondition: this.preCheckUploadCondition,
      imageList,
      ...globalActionbarProps
    };

    // 图片放大查看.
    const imageViewProps = {
      enableQuickView: selectedImgCount > 1,
      close: boundProjectActions.hideImageViewer,
      images: mainHandler.formatImages(urls, selectedImgList),
      boundGlobalActions,
      boundProjectActions,
      collectionDetail,
      urls,
      downViewImage: (selectedImg, tab) => mainHandler.downViewImage(selectedImg, tab, urls),
      toAiClick: (...opt) => mainHandler.toAiClick(this, ...opt),
      from: saasProducts.aiphoto
    };

    return (
      <div className="gllery-collection-detail-photo">
        {/* 主渲染区域. */}
        <div className="content">
          {/* 全局的action bar */}
          <EditorGlobalActionbar {...globalActionbarProps} />

          {/* 图片选择后的action bar */}
          <EditorSelectionActionbar {...selectionActionbarProps} />

          {/* 图片列表区域 */}
          <EditorImageList {...imageListProps} />
        </div>

        {/*  外部文件上传 */}
        <XExternalDropDirectory {...externalDropProps} />

        {/* 照片放大查看. */}
        {!!isShownImageViewer && <ImageViewerModal {...imageViewProps} />}
      </div>
    );
  }
}

export default CollectionDetailPhoto;
