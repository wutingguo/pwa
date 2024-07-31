import { fromJS } from 'immutable';
import React from 'react';

import XExternalDropDirectory from '@resource/components/XExternalDropDirectory';

import * as modalTypes from '@resource/lib/constants/modalTypes';
import { saasProducts } from '@resource/lib/constants/strings';

import { ImageSortActionBar, XPureComponent } from '@common/components';

import EditorGlobalActionbar from '@apps/gallery/components/EditorGlobalActionbar';
import EditorImageList from '@apps/gallery/components/EditorImageList';
import EditorSelectionActionbar from '@apps/gallery/components/EditorSelectionActionbar';
import ImageViewerModal from '@apps/gallery/components/ModalEntry/ImageViewerModal';
import Progress from '@apps/gallery/components/Progress';

import mainHandler from './handle/main';

import './index.scss';

function generateRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
let timer = null;
class CollectionDetailPhoto extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedImages: fromJS([]),
      oneWaterMarkLoadings: fromJS({}),
      completed: 1,
    };
    this.preCheckUploadCondition = this.preCheckUploadCondition.bind(this);
    this.commonAction = {};
    this.firstMark = true;
  }
  componentDidMount() {
    const {
      match: {
        params: { id: encCollectionId },
      },
      collectionDetail,
      boundProjectActions,
    } = this.props;
    if (collectionDetail && collectionDetail.size > 0) {
      boundProjectActions.getSmartShardingStatus(encCollectionId).then(res => {
        const { ret_code, data } = res;
        if (data && data.group_status === 1) {
          this.doSetInterval();
          setTimeout(() => {
            this.setState({
              completed: 75,
              showProgress: true,
            });
          }, 2000);
        }
        boundProjectActions.getCountFreshImages(encCollectionId);
      });
    }
  }

  preCheckUploadCondition() {
    const { mySubscription, baseUrl, boundGlobalActions, urls } = this.props;
    const saasBaseUrl = urls.get('saasBaseUrl');
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
              boundGlobalActions.hideConfirm();
              const list = mySubscription.get('items');
              const findGallery = list.find(
                item => item.get('product_id') === saasProducts.gallery
              );
              boundGlobalActions.showModal(modalTypes.SAAS_CHECKOUT_MODAL, {
                product_id: saasProducts.gallery,
                escapeClose: true,
                level: findGallery.get('plan_level') + 10,
                onClosed: () => {
                  boundGlobalActions.hideModal(modalTypes.SAAS_CHECKOUT_MODAL);
                  boundGlobalActions.getMySubscription(saasBaseUrl);
                },
              });
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
  componentWillUnmount() {
    clearInterval(timer);
    timer = null;
  }
  setProgress = showProgress => {
    this.setState({
      showProgress,
    });
  };

  doSetInterval = () => {
    clearInterval(timer);

    timer = setInterval(() => {
      const { collectionDetail, boundProjectActions } = this.props;
      const { completed } = this.state;
      if (collectionDetail && collectionDetail.size > 0) {
        const enc_collection_uid = collectionDetail.get('enc_collection_uid');
        boundProjectActions.getSmartShardingStatus(enc_collection_uid).then(res => {
          const { ret_code, data = {} } = res;
          if (data.group_status === 2) {
            this.setState({
              completed: 100,
            });
            boundProjectActions.getCountFreshImages(enc_collection_uid);
            clearInterval(timer);
            timer = null;
          } else if (completed <= 50) {
            this.setState({
              completed: completed + generateRandomInteger(5, 10),
            });
          } else if (completed > 50 && completed <= 69) {
            this.setState({
              completed: completed + generateRandomInteger(1, 5),
            });
          } else if (completed >= 70 && completed < 75) {
            this.setState({
              completed: completed + 1,
            });
          } else if (completed >= 75) {
            this.setState({
              completed: 75,
            });
          }
        });
      }
    }, 5000);
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
      getCollectionDetail,
      collectionsSettings,
      pinSetting,
      grayInfo,
    } = this.props;
    const { selectedImages, oneWaterMarkLoadings, completed, showProgress } = this.state;
    const isShownImageViewer = collectionDetail.getIn(['photos', 'isShownImageViewer']);
    const selectedImgCount = collectionDetail.getIn(['photos', 'selectedImgCount']);
    const collectionId = collectionDetail.get('enc_collection_uid');
    const setCount = collectionDetailSets.size;
    const imageList = collectionDetail.get('images');
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
      pinSetting,
      preCheckUploadCondition: this.preCheckUploadCondition,
      isShowImgName: collectionDetail.getIn(['photos', 'isShowImgName']),
      setImageList: imageList,
      // collectionSetName: set.get('set_name'),
      boundGlobalActions,
      boundProjectActions,
      collectionDetail,
      getCollectionDetail,
      collectionsSettings,
      grayInfo,
      uploadedStartWatermark: this.uploadedStartWatermark,
      oneWaterMarkLoadings,
      mySubscription,
      setProgress: setProgress => this.setProgress(setProgress),
      doSetInterval: this.doSetInterval,
      commonAction: this.commonAction,
    };

    // 图片选择后的action bar
    const selectionActionbarProps = {
      urls,
      setCount,
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
        ...boundGlobalActions,
        addImages: (...e) => {
          window.logEvent.addPageEvent({
            name: 'Gallery_DropPhotos',
          });
          boundProjectActions.addImages(...e);
        },
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
      collectionDetail,
      isShowEmptyContent,
      selectedImages,
      uploadParams,
      pinSetting,
      isShowContentLoading,
      preCheckUploadCondition: this.preCheckUploadCondition,
      setImageList: imageList,
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
      close: boundProjectActions.hideImageViewer,
      images: mainHandler.formatImages(urls, imageList),
      boundGlobalActions,
      boundProjectActions,
      collectionDetail,
      urls,
      downViewImage: (selectedImg, tab) => mainHandler.downViewImage(selectedImg, tab, urls),
      toAiClick: (...opt) => mainHandler.toAiClick(this, imageList, ...opt),
      from: saasProducts.gallery,
      defaultId: collectionDetail.getIn(['photos', 'imageViewerDefaultId']),
    };

    // 分片进度条
    const progressProps = {
      boundGlobalActions,
      boundProjectActions,
      completed,
      collectionDetail,
      setProgress: setProgress => this.setProgress(setProgress),
      doSetInterval: this.doSetInterval,
      commonAction: this.commonAction,
    };
    return (
      <div className="gllery-collection-detail-photo">
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
        </div>
        {showProgress && <Progress {...progressProps}></Progress>}

        {/*  外部文件上传 */}
        <XExternalDropDirectory {...externalDropProps} />

        {/* 照片放大查看. */}
        {!!isShownImageViewer && <ImageViewerModal {...imageViewProps} />}
      </div>
    );
  }
}

export default CollectionDetailPhoto;
