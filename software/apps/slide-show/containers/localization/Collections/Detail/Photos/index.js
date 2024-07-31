import React from 'react';
import { fromJS } from 'immutable';
import {
  XPureComponent,
  XPagePagination,
  XButton,
  XDropdown,
  XIcon,
  XExternalDrop,
  XFileUpload,
  ImageSortActionBar
} from '@common/components';
import EditorGlobalActionbar from '@apps/slide-show/components/EditorGlobalActionbar';
import EditorSelectionActionbar from '@apps/slide-show/components/EditorSelectionActionbar';
import EditorImageList from '@apps/slide-show/components/EditorImageList';
import Waveform from '@apps/slide-show/components/Waveform';

import mainHandler from './handle/main';

import './index.scss';

class CollectionDetailPhoto extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedImages: fromJS([])
    };
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
      collectionDetail = fromJS({}),
      collectionDetailSets = fromJS([]),
      isDetailRequestDone,
      collectionPreviewUrl,
      uploadParams,
      mySubscription,
      isShowContentLoading,

      musicCategories,
      musicFavorite,
      musicList,

      currentSegment,
      transitionModes,
      postCardList,
      userInfo
    } = this.props;
    const { selectedImages } = this.state;
    const isShownImageViewer = collectionDetail.getIn(['photos', 'isShownImageViewer']);
    const selectedImgList = collectionDetail.getIn(['photos', 'selectedImgList']);
    const selectedImgCount = collectionDetail.getIn(['photos', 'selectedImgCount']);
    const setCount = collectionDetailSets.size;
    const frameList = collectionDetail.get('frameList');
    const visiting_card = collectionDetail.get('visiting_card') || '';
    const projectId = collectionDetail.get('id');

    let isShowEmptyContent = false;
    if (isDetailRequestDone) {
      if (frameList && frameList.size === 0) {
        isShowEmptyContent = true;
      }
    }

    // 全局的action bar
    const globalActionbarProps = {
      urls,
      history,
      params,
      projectId,
      uploadParams,
      currentSegment,
      collectionPreviewUrl,
      preCheckUploadCondition: this.preCheckUploadCondition,
      isShowImgName: collectionDetail.getIn(['photos', 'isShowImgName']),

      // collectionSetName: set.get('set_name'),
      musicCategories,
      musicFavorite,
      musicList,

      boundGlobalActions,
      boundProjectActions,
      transitionModes,
      postCardList,
      visiting_card,
      isShowEmptyContent,
      userInfo,
      frameList
    };

    // 图片选择后的action bar
    const selectionActionbarProps = {
      urls,
      setCount,
      selectedImgCount,
      collectionDetail,
      collectionDetailSets,
      boundGlobalActions,
      boundProjectActions
    };

    //frame需要根据image进行排序
    const imageList = frameList && frameList.map(frame => frame.get('image'));
    const imageSortActionBarProps = {
      list: imageList && imageList.toJS(),
      onSortedComplete: sortedImageList => {
        //这里需要重新通过image转换成对应的frame
        const sortedFrameList = [];
        sortedImageList.forEach(image => {
          const frame = frameList.find(
            frame => frame.getIn(['image', 'enc_image_uid']) == image.enc_image_uid
          );
          if (frame) {
            const newFrame = frame.set('selected', false);
            sortedFrameList.push(newFrame);
          }
        });

        boundProjectActions.updateFrames({ frames: fromJS(sortedFrameList) });
        boundProjectActions.saveSlideshow();
      },
      trackEvent: config => {
        const { field, orderBy } = config;
        let eventName = '';
        switch (field) {
          case 'shot_time': {
            if (orderBy === 'asc') eventName = 'SlideShowPhotos_Click_SortByDateTakenOTN';
            else eventName = 'SlideShowPhotos_Click_SortByDateTakenNTO';
            break;
          }
          case 'create_time': {
            if (orderBy === 'asc') eventName = 'SlideShowPhotos_Click_SortByUploadTimeOTN';
            else eventName = 'SlideShowPhotos_Click_SortByUploadTimeNTO';
            break;
          }
          case 'image_name': {
            if (orderBy === 'asc') eventName = 'SlideShowPhotos_Click_SortByTitleATZ';
            else eventName = 'SlideShowPhotos_Click_SortByTitleZTA';
            break;
          }
        }
        if (eventName) {
          window.logEvent.addPageEvent({
            name: eventName
          });
        }
      }
    };

    // 外部文件上传
    const externalDropProps = {
      boundGlobalActions: {
        showModal: boundGlobalActions.showModal,
        addImages: boundProjectActions.addImages
      },
      uploadParams,
      isDisableDragExternalFiles: false
    };
    // 图片列表.
    const imageListProps = {
      urls,
      id: 'imageList',
      maskId: 'selectiorMaskId',
      cardClassName: 'select-image-card-item',
      collectionDetail,

      isShowEmptyContent,
      selectedImages,
      uploadParams,
      isShowContentLoading,
      preCheckUploadCondition: this.preCheckUploadCondition,
      ...globalActionbarProps
    };

    return (
      <div className="slide-show-editor-content-wrapper slide-show-collection-detail-photo">
        {/* 主渲染区域. */}
        <div className="content">
          {/* 全局的action bar */}
          <EditorGlobalActionbar {...globalActionbarProps} />

          {/* 图片选择后的action bar */}
          <div className="action-bar-container">
            <EditorSelectionActionbar {...selectionActionbarProps} />
            <ImageSortActionBar {...imageSortActionBarProps} />
          </div>

          {/* 图片列表区域 */}
          <EditorImageList {...imageListProps} />

          <Waveform
            boundGlobalActions={boundGlobalActions}
            boundProjectActions={boundProjectActions}
            currentSegment={currentSegment}
          />
        </div>

        {/*  外部文件上传 */}
        <XExternalDrop {...externalDropProps} />
      </div>
    );
  }
}

export default CollectionDetailPhoto;
