import React, { Fragment } from 'react';
import Tooltip from 'rc-tooltip';
import { XPureComponent, XIcon, XFileUpload } from '@common/components';
import XUploadDirectoryButton from '@resource/components/XUploadDirectoryButton';
import CollectionDetailHeader from '../CollectionDetailHeader';
import main from './handle/main';
import './index.scss';

class EditorGlobalActionbar extends XPureComponent {
  uploadFileClicked = () => {};
  onAddImages = files => main.onAddImages(this, files);
  render() {
    const {
      history,
      params,
      uploadParams,
      isGallerySharedExpired,
      collectionPreviewUrl,
      boundGlobalActions,
      boundProjectActions,
      preCheckUploadCondition,
      collectionDetail
    } = this.props;

    const { id } = params;
    const fileUploadProps = {
      className: 'editor-aiphoto-action-bar-upload',
      multiple: 'multiple',
      inputId: 'multiple',
      text: t('选择照片上传'),
      preCheck: preCheckUploadCondition,
      uploadFileClicked: this.uploadFileClicked,
      addImages: this.onAddImages,
      showModal: boundGlobalActions.showModal,
      accept: 'image/jpeg'
    };

    const fileUploadDirectoryProps = {
      label: t('选择文件夹上传'),
      acceptFileTypes: ['image/jpeg'],
      onAddImages: this.onAddImages,
      showModal: boundGlobalActions.showModal
    };

    const headerProps = {
      className: 'editor-global-action-bar',
      history,
      collectionPreviewUrl,
      collectionId: id,
      isGallerySharedExpired,
      // title: this.renderTitle(images.size),
      boundGlobalActions,
      boundProjectActions,
      collectionDetail,
      uploadBtn: <XFileUpload {...fileUploadProps} />,
      uploadDirectory: <XUploadDirectoryButton {...fileUploadDirectoryProps} />
    };
    return <CollectionDetailHeader {...headerProps} />;
  }
}

export default EditorGlobalActionbar;
