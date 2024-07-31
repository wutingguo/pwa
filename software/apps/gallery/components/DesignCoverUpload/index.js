import React, { Component } from 'react';
import classNames from 'classnames';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import {
  XIcon
} from '@common/components';
import XInput from '@resource/components/XInput';
import { singleUploadInputId } from "@resource/lib/constants/strings";
import { UPLOAD_MODAL } from '@resource/lib/constants/modalTypes';

import './index.scss';

class XFileUpload extends Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    const { resetOpenState } = this.props;
    if (nextProps.isAutoOpen) {
      this.onClickInput();
      resetOpenState();
    }
  }

  /**
   * 点击input控件, 弹出文件选择框.
   */
  onClickInput = () => {
    const { uploadFileClicked } = this.props;
    const input = findDOMNode(this.refs.fileInput);

    uploadFileClicked && uploadFileClicked();
    input.click();
  };

  handleSelectFile = event => {
    const { onSelectFile, multiple, uploadParams = {} } = this.props;
    if (event.target.value) {
      const { addImages, showModal, useNewUpload = false } = this.props;
      const params = multiple ? uploadParams : { maxUploadNum: 1, ...uploadParams };
      if (!useNewUpload) {
        showModal(UPLOAD_MODAL, params);
      }

      const files = [...event.target.files];
      onSelectFile && onSelectFile(files);

      addImages && addImages(files);
    }

    const input = findDOMNode(this.refs.fileInput);
    input.value = '';
  };

  render() {
    const {
      className,
      children,
      accept = 'image/jpeg,image/x-png,image/png',
      inputId = singleUploadInputId,
    } = this.props;
    const uploadFile = classNames('upload-wrap', className);
    return (
      <div
        className={uploadFile}
        onClick={this.onClickInput}
      >
        <div className="upload-btn">
          <XIcon type="image-only" iconWidth={38} iconHeight={30} />
          <span className="upload-text">{t('UPLOAD_COVER_MODAL_TIP')}</span>
        </div>
        <XInput
          type="file"
          ref="fileInput"
          id={inputId}
          accept={accept}
          onChange={this.handleSelectFile}
        />
        <span>{children}</span>
      </div>
    );
  }
}
XFileUpload.propTypes = {
  className: PropTypes.string,
  children: PropTypes.array,
  multiple: PropTypes.string,
  accept: PropTypes.string,
  text: PropTypes.string,
  onSelectFile: PropTypes.func.isRequired,  
  showModal: PropTypes.func.isRequired,
  uploadFileClicked: PropTypes.func,
  addImages: PropTypes.func,
};

export default XFileUpload;
