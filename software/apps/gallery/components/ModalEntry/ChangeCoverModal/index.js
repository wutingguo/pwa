import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { singleUploadInputId } from '@resource/lib/constants/strings';

import { XExternalDrop, XFileUpload, XLoading, XModal, XPureComponent } from '@common/components';

import imageIcon from './image.png';
import main from './main';

import './index.scss';

class ChangeCoverModal extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isUploading: false,
      hasError: false,
      progress: 0,
      errorText: t('UNEXPECTED_ERROR'),
    };
  }
  onAddImages = files => main.onAddImages(this, files);
  ChooseImgChange = () => {
    const {
      boundGlobalActions,
      boundProjectActions,
      collectionDetailSets,
      urls,
      collectionDetail,
      data,
    } = this.props;
    window.logEvent.addPageEvent({
      name: 'GallerySetting_ChangeCoverPop_Click_SelectFromCollection',
    });
    const close = data.get('close');
    const collection_uid = collectionDetail.getIn(['enc_collection_uid']);
    boundGlobalActions.showModal('CHOOSE_IMG_MODAL', {
      sets: collectionDetailSets.toJS(),
      urls,
      boundProjectActions,
      boundGlobalActions,
      collection_uid,
      close: () => {
        boundGlobalActions.hideModal('CHOOSE_IMG_MODAL');
      },
    });
  };
  render() {
    const { isUploading, hasError, progress, errorText } = this.state;
    const { data } = this.props;

    const close = data.get('close');

    const fileUploadProps = {
      className: 'gallery-change-cover-upload',
      inputId: singleUploadInputId,
      multiple: '',
      text: t('Browse Computer'),
      addImages: this.onAddImages,
      useNewUpload: true,
      iconType: 'laptop',
    };

    return (
      <XModal
        className="change-cover-modal"
        opened
        onClosed={() => close()}
        escapeClose
        isHideIcon={false}
      >
        <div className="modal-title">{t('CHANGE_COVER')}</div>
        <div className="modal-body">
          {isUploading ? (
            <XLoading type="imageLoading" isShown text={`${progress}%`} />
          ) : (
            <>
              <div
                className="from-collection"
                title="Select from Collection"
                onClick={() => this.ChooseImgChange()}
              >
                <img src={imageIcon} /> Select from Collection
              </div>
              <XFileUpload {...fileUploadProps} />
              {hasError ? <div className="error">{errorText}</div> : null}
            </>
          )}
        </div>
      </XModal>
    );
  }
}

ChangeCoverModal.propTypes = {};

ChangeCoverModal.defaultProps = {};

export default ChangeCoverModal;
