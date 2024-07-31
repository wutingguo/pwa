import { fromJS } from 'immutable';
import React from 'react';

// import { mockImageList } from './handle/mock';
import XExternalDropDirectory from '@resource/components/XExternalDropDirectory';

import { saasProducts } from '@resource/lib/constants/strings';

import { ImageSortActionBar, XImageViewer, XPureComponent } from '@common/components';

import EditorGlobalActionbar from '@apps/gallery/components/EditorGlobalActionbar';
import EditorImageList from '@apps/gallery/components/EditorImageList';
import EditorSelectionActionbar from '@apps/gallery/components/EditorSelectionActionbar';
import EditorVideoActionbar from '@apps/gallery/components/EditorVideoActionbar';
import EditorVideoView from '@apps/gallery/components/EditorVideoView';

// import equals from '@resource/lib/utils/compare';
// import uploadHandler from './handle/upload';
import mainHandler from './handle/main';

import './index.scss';

class CollectionDetailPhoto extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedImages: fromJS([]),
      oneWaterMarkLoadings: fromJS({}),
    };
    this.preCheckUploadCondition = this.preCheckUploadCondition.bind(this);
  }

  preCheckUploadCondition() {
    const { mySubscription, baseUrl, boundGlobalActions } = this.props;
    const gallerySubscription = mySubscription
      .get('items')
      .find(item => item.get('product_id') === 'SAAS_GALLERY');
    if (!gallerySubscription) {
      return false;
    }
    const maxSize = gallerySubscription.getIn(['storage_info', 'max_size']);
    const usageSize = gallerySubscription.getIn(['storage_info', 'usage_size']);
    const storageFulled = maxSize - usageSize < 1048576;
    const gallerySubscriptionExpired = mySubscription.get('isGalleryExpired');
    if (storageFulled) {
      boundGlobalActions.showConfirm({
        title: t('ARE_YOU_SURE'),
        message: t('PRE_CHECK_MESSAGE_GALLERY_INSUFFICIENT_STORAGE'),
        close: boundGlobalActions.hideConfirm,
        buttons: [
          {
            onClick: () => {
              boundGlobalActions.hideConfirm;
              location.href = `/saascheckout.html?from=saas&product_id=${saasProducts.gallery}`;
            },
            text: t('UPGRADE'),
          },
        ],
      });
      return false;
    }
    if (gallerySubscriptionExpired) {
      boundGlobalActions.showConfirm({
        title: t('WARNING'),
        message: t('PRE_CHECK_MESSAGE_GALLERY_SUBSCRIPTION_EXPIRES'),
        buttons: [
          {
            onClick: () => {
              boundGlobalActions.hideConfirm();
              window.location.href = `${baseUrl}gallery.html`;
            },
            text: t('PRE_CHECK_CONFIRM_TEXT_GALLERY_SUBSCRIPTION_EXPIRES'),
          },
        ],
        close: boundGlobalActions.hideConfirm,
      });
      return false;
    }
    return true;
  }
  uploadedStartWatermark = async (params, isAllCompleted, set_uid) => {
    // 上传完图片打水印
    if (!params.watermarkValue) return;

    const { collectionDetail, boundGlobalActions, boundProjectActions } = this.props;
    const { setWatermark, onlyOneImgWaterMarkLoading } = boundProjectActions;
    console.log('params: ', params);

    const collection_uid = collectionDetail.get('enc_collection_uid');
    const bodyParams = {
      collection_uid,
      set_uid,
      image_uids: [params.encImgId],
      watermark_uid: params.watermarkValue,
      apply_all: 0,
    };
    this.setState({
      oneWaterMarkLoadings: this.state.oneWaterMarkLoadings.merge({ [params.encImgId]: true }),
    });
    isAllCompleted && boundProjectActions.getSetPhotoList(collection_uid, set_uid);
    setWatermark({
      bodyParams,
    }).then(async res => {
      // onlyOneImgWaterMarkLoading(params.encImgId, false)
      // 当全部上传完毕时关闭弹窗再请求列表
      isAllCompleted && (await boundProjectActions.getSetPhotoList(collection_uid, set_uid));
      this.setState({
        oneWaterMarkLoadings: this.state.oneWaterMarkLoadings.removeIn([params.encImgId]),
      });
    });
  };
  beforeUploadCheckSize = files => {
    const { boundGlobalActions } = this.props;
    return new Promise((resolve, reject) => {
      const file = files[0];
      if (file.type.indexOf('video') === -1 || file.type === 'video/avi') {
        boundGlobalActions.addNotification({
          message: t('SUPPORTED_FILE_TYPE_ERROR_TIP'),
          level: 'error',
          autoDismiss: 3,
        });
        return reject(false);
      }
      let video = document.createElement('video');
      video.preload = 'metadata';
      video.src = URL.createObjectURL(file);
      video.onloadedmetadata = function () {
        window.URL.revokeObjectURL(video.src);
        // duration 为上传视频的时长
        let duration = video.duration;
        const durationSize = duration / 60;
        if (durationSize > 30) {
          boundGlobalActions.addNotification({
            message: t('SUPPORTED_LIMIT_ERROR_TIP'),
            level: 'error',
            autoDismiss: 2,
          });
          return reject(false);
        }
        return resolve(true);
      };
    });
  };
  render() {
    const {
      urls,
      history,
      baseUrl,
      match: { params },
      boundGlobalActions,
      boundProjectActions,
      collectionDetail,
      collectionDetailSets,
      isDetailRequestDone,
      collectionPreviewUrl,
      uploadParams,
      mySubscription,
      isShowContentLoading,
      collectionsSettings,
      getCollectionDetail,
      grayInfo,
    } = this.props;
    const { selectedImages, oneWaterMarkLoadings } = this.state;
    const isShownImageViewer = collectionDetail.getIn(['photos', 'isShownImageViewer']);
    const selectedImgList = collectionDetail.getIn(['photos', 'selectedImgList']);
    const collectionId = collectionDetail.get('enc_collection_uid');
    const selectedImgCount = collectionDetail.getIn(['photos', 'selectedImgCount']);
    const selectedVideo = collectionDetail.getIn(['gallery_video_info', 'isSelectVideo']);
    const curSetVideo = collectionDetail.getIn(['gallery_video_info', 'video_id']);

    const setCount = collectionDetailSets.size;
    const imageList = collectionDetail.get('images');
    const watermarkloading = collectionDetail.get('watermarkloading');
    const currentSetUid = collectionDetail.get('currentSetUid');
    const sets = collectionDetail.get('sets');
    const set =
      sets && sets.size && sets.filter(set => +currentSetUid === +set.get('set_uid')).get(0);

    let isShowEmptyContent = false;
    if (isDetailRequestDone) {
      if (imageList && imageList.size === 0) {
        isShowEmptyContent = true;
      }
    }

    // 全局的action bar
    const globalActionbarProps = {
      urls,
      history,
      params,
      uploadParams,
      set,
      collectionPreviewUrl,
      preCheckUploadCondition: this.preCheckUploadCondition,
      isShowImgName: collectionDetail.getIn(['photos', 'isShowImgName']),
      isGallerySharedExpired: collectionDetail.get('expire_flag'),
      setImageList: imageList,
      // collectionSetName: set.get('set_name'),
      boundGlobalActions,
      boundProjectActions,
      collectionDetail,
      getCollectionDetail,
      curSetVideo,
      collectionsSettings,
      grayInfo,
      uploadedStartWatermark: this.uploadedStartWatermark,
      oneWaterMarkLoadings,
      beforeUploadCheckSize: this.beforeUploadCheckSize,
    };

    // 图片选择后的action bar
    const selectionActionbarProps = {
      urls,
      setCount,
      watermarkloading,
      selectedImgCount,
      collectionDetail,
      collectionDetailSets,
      boundGlobalActions,
      boundProjectActions,
      mySubscription,
      getCollectionDetail,
    };

    // 外部文件上传
    const externalDropProps = {
      ...this.props,
      boundGlobalActions: {
        showModal: boundGlobalActions.showModal,
        addImages: boundProjectActions.addImages,
      },
      uploadParams: {
        ...uploadParams,
        grayInfo,
        startWatermark: this.uploadedStartWatermark,
      },
      isGallery: true,
      asyncCallback: async () =>
        await boundProjectActions.getSetPhotoList(collectionId, uploadParams.set_uid),
      isDisableDragExternalFiles: false,
      acceptFileType: 'image/jpeg,image/jpg,image/x-png,image/png',
      existImagesNames: imageList && imageList.toJS().map(i => `${i.image_name}${i.suffix}`),
    };

    // 图片列表.
    const imageListProps = {
      urls,
      watermarkloading,
      collectionDetail,
      isShowEmptyContent,
      selectedImages,
      uploadParams,
      isShowContentLoading,
      preCheckUploadCondition: this.preCheckUploadCondition,
      setImageList: imageList,
      curSetVideo,
      ...globalActionbarProps,
    };
    const videoViewProps = {
      selectedImages,
      ...globalActionbarProps,
    };

    const imageSortActionBarProps = {
      list: imageList && imageList.toJS(),
      onSortedComplete: sortedImageList => {
        const sortedUidList = sortedImageList.map(image => image.enc_image_uid);
        boundProjectActions.resortImages(fromJS(sortedImageList));
        boundProjectActions.postResortImages(sortedUidList);
        boundProjectActions.handleClearSelectImg();
      },
      trackEvent: config => {
        const { field, orderBy } = config;
        let eventName = '';
        switch (field) {
          case 'shot_time': {
            if (orderBy === 'asc') eventName = 'GalleryPhotos_Click_SortByDateTakenOTN';
            else eventName = 'GalleryPhotos_Click_SortByDateTakenNTO';
            break;
          }
          case 'create_time': {
            if (orderBy === 'asc') eventName = 'GalleryPhotos_Click_SortByUploadTimeOTN';
            else eventName = 'GalleryPhotos_Click_SortByUploadTimeNTO';
            break;
          }
          case 'image_name': {
            if (orderBy === 'asc') eventName = 'GalleryPhotos_Click_SortByTitleATZ';
            else eventName = 'GalleryPhotos_Click_SortByTitleZTA';
            break;
          }
        }
        if (eventName) {
          window.logEvent.addPageEvent({
            name: eventName,
          });
        }
      },
    };

    // 图片放大查看.
    const imageViewProps = {
      isShowHeader: true,
      enableQuickView: selectedImgCount > 1,
      hideViewer: boundProjectActions.hideImageViewer,
      images: mainHandler.formatImages(urls, selectedImgList),
    };

    return (
      <div className="gllery-collection-detail-photo">
        {/* 主渲染区域. */}
        <div className="content">
          {/* 全局的action bar */}
          <EditorGlobalActionbar {...globalActionbarProps} />

          {/* 图片选择后的action bar */}
          <div className="action-bar-container">
            {selectedVideo ? (
              <EditorVideoActionbar {...selectionActionbarProps} />
            ) : (
              <EditorSelectionActionbar {...selectionActionbarProps} />
            )}
            <ImageSortActionBar {...imageSortActionBarProps} />
          </div>
          <div className="editor-container">
            {/* 视频列表区域.*/}
            {!__isCN__ && curSetVideo && <EditorVideoView {...videoViewProps} />}
            {/* 图片列表区域 */}
            <EditorImageList {...imageListProps} />
          </div>
        </div>

        {/*  外部文件上传 */}
        <XExternalDropDirectory {...externalDropProps} />
        {/* 照片放大查看. */}
        {!!isShownImageViewer ? <XImageViewer {...imageViewProps} /> : null}
      </div>
    );
  }
}

export default CollectionDetailPhoto;
