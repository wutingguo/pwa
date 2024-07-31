import Tooltip from 'rc-tooltip';
import React, { Fragment } from 'react';

import XUploadDirectoryButton from '@resource/components/XUploadDirectoryButton';

import { XFileUpload, XIcon, XPureComponent } from '@common/components';

import BeforeUploadDom from '../BeforeUploadDom';
import CollectionDetailHeader from '../CollectionDetailHeader';

import main from './handle/main';

import './index.scss';

class EditorGlobalActionbar extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
    };
  }
  uploadFileClicked = () => {
    window.logEvent.addPageEvent({
      name: 'GalleryPhotos_Click_AddPhotos',
    });
  };
  onAddImages = files => main.onAddImages(this, files);
  handleShowName(param) {
    const { boundProjectActions } = this.props;
    boundProjectActions.handleShowImgName(param);
  }
  onHideImgName = () => this.handleShowName(false);
  onShowImgName = () => this.handleShowName(true);
  renderTitle(collectionSetName) {
    const { isShowImgName } = this.props;
    const imgOnlyIconStatus = !isShowImgName ? 'active' : '';
    const showFilenameIconStatus = isShowImgName ? 'active' : '';
    return (
      <>
        <span className="photo-detail-global-action-bar-title ellipsis" title={collectionSetName}>
          {collectionSetName}
        </span>
        <Tooltip placement="top" overlay={t('IMAGE_ONLY')}>
          <span className="editor-global-action-bar-img-only">
            <XIcon type="image-only" status={imgOnlyIconStatus} onClick={this.onHideImgName} />
          </span>
        </Tooltip>
        <Tooltip placement="top" overlay={t('SHOW_FILE_NAME')}>
          <span className="editor-global-action-bar-show-filename">
            <XIcon
              type="show-filename"
              status={showFilenameIconStatus}
              onClick={this.onShowImgName}
            />
          </span>
        </Tooltip>
      </>
    );
  }
  render() {
    const {
      urls,
      history,
      params,
      set,
      uploadParams,
      isGallerySharedExpired,
      collectionPreviewUrl,
      boundGlobalActions,
      boundProjectActions,
      preCheckUploadCondition,
      collectionDetail,
      pinSetting,
      getCollectionDetail,
      collectionsSettings,
      grayInfo,
      setImageList,
      uploadedStartWatermark,
      setProgress,
      doSetInterval,
      commonAction,
      beforeUploadCheckSize,
      getUploadedVideo,
    } = this.props;
    const collectionSetName = set ? set.get('set_name') : '';
    const { id } = params;
    const fileUploadProps = {
      className: 'editor-global-action-bar-upload',
      multiple: 'multiple',
      inputId: 'multiple',
      text: t('SELECT_UPLOAD_PHOTOS'),
      uploadParams: {
        ...uploadParams,
        grayInfo,
        existedImageList: setImageList,
        beforeDom: (callBack, mySubscription) => (
          <BeforeUploadDom
            {...this.props}
            files={this.state.files}
            callBack={callBack}
            mySubscription={mySubscription}
          />
        ),
        startWatermark: uploadedStartWatermark,
      },
      preCheck: preCheckUploadCondition,
      uploadFileClicked: this.uploadFileClicked,
      addImages: this.onAddImages,
      showModal: boundGlobalActions.showModal,
      grayInfo,
    };

    const fileUploadDirectoryProps = {
      uploadParams: {
        ...uploadParams,
        grayInfo,
        existedImageList: setImageList,
        beforeDom: (callBack, mySubscription) => (
          <BeforeUploadDom
            {...this.props}
            files={this.state.files}
            callBack={callBack}
            mySubscription={mySubscription}
          />
        ),
        startWatermark: uploadedStartWatermark,
      },
      label: t('SELECT_UPLOAD_FOLDER'),
      acceptFileType: 'image/jpeg,image/jpg,image/x-png,image/png',
      onAddImages: this.onAddImages,
      showModal: boundGlobalActions.showModal,
    };
    const videoFileUploadProps = {
      inputId: 'video',
      isIconShow: false,
      uploadFilesByS3: true,
      getUploadedImgs: (...args) => getUploadedVideo('video', ...args),
      showModal: boundGlobalActions.showModal,
      beforeUploadCheckSize: beforeUploadCheckSize,
      accept: 'video/mp4,video/m4v,video/quicktime',
      media_type: 3,
      title: t('Upload Video'),
      grayInfo,
      acceptFileTip: t('SUPPORTED_FILE_TYPE_ERROR_TIP'),
      text: t('Upload File (30 min max)'),
      cusTypeCheck: {
        type: ['video/mp4', 'video/m4v', 'video/quicktime'],
        errorText: t('SUPPORTED_FILE_TYPE_ERROR_TIP'),
      },
      uploadParams: {
        ...uploadParams,
        grayInfo,
      },
    };

    const headerProps = {
      className: 'editor-global-action-bar',
      urls,
      history,
      collectionPreviewUrl,
      collectionId: id,
      setImageList,
      isGallerySharedExpired,
      title: this.renderTitle(collectionSetName),
      boundGlobalActions,
      tabName: collectionSetName,
      boundProjectActions,
      collectionDetail,
      pinSetting,
      getCollectionDetail,
      collectionsSettings,
      uploadBtn: <XFileUpload {...fileUploadProps} />,
      uploadDirectory: <XUploadDirectoryButton {...fileUploadDirectoryProps} />,
      grayInfo,
      preCheckUploadCondition,
      setProgress,
      doSetInterval,
      commonAction,
      uploadVideoBtn: <XFileUpload {...videoFileUploadProps} />,
    };
    return <CollectionDetailHeader {...headerProps} />;
  }
}

export default EditorGlobalActionbar;
