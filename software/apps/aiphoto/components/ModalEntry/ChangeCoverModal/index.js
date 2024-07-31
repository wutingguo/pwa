import classNames from 'classnames';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { XPureComponent, XFileUpload, XLoading, XModal } from '@common/components';
import { singleUploadInputId } from '@resource/lib/constants/strings';
import main from './main';
import imageIcon from './image.png';

import './index.scss';

class ChangeCoverModal extends XPureComponent {
  state = {
    isUploading: false,
    hasError: false,
    progress: 0,
    errorText: t('UNEXPECTED_ERROR')
  };

  onAddImages = files => main.onAddImages(this, files);

  render() {
    const { isUploading, hasError, progress, errorText } = this.state;
    const { data } = this.props;

    const close = data.get('close');

    const fileUploadProps = {
      className: 'editor-global-action-bar-upload',
      inputId: singleUploadInputId,
      multiple: '',
      text: t('ADD_PHOTOS'),
      addImages: this.onAddImages,
      useNewUpload: true,
      accept: 'image/jpeg'
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
            <label className="select-file">
              <XFileUpload {...fileUploadProps} />

              <div className="description">
                <img src={imageIcon} />
                <div className="text">{t('CLICK_HERE_CHANGE_COVER')}</div>

                {hasError ? <div className="error">{errorText}</div> : null}
              </div>
            </label>
          )}
        </div>
      </XModal>
    );
  }
}

ChangeCoverModal.propTypes = {};

ChangeCoverModal.defaultProps = {};

export default ChangeCoverModal;
