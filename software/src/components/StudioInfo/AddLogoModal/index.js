import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getOrientationAppliedStyle } from '@resource/lib/utils/exif';
import XModal from '../../XModal';
import { uploadFile } from '../../../utils/upload';
import { checkIsAlphaImg } from '../../../utils/img';
import * as xhr from '@resource/websiteCommon/utils/xhr';
import classNames from 'classnames';
import addIcon from './add.png';
import './index.scss';

export default class AddLogoModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isUploadFailed: false,
      isUploading: false,
      isDragEnter: false,
      material: null,
      errMsg: ''
    };

    this.getExtension = this.getExtension.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleAddOk = this.handleAddOk.bind(this);
    this.handleUploadClick = this.handleUploadClick.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDragEnter = this.handleDragEnter.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleDroped = this.handleDroped.bind(this);
  }

  getExtension(filename) {
    const parts = filename.split('.');
    return parts[parts.length - 1];
  }

  handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      this.handleFile(file);
      e.target.value = '';
    }
  }

  handleFileDrop(e) {
    this.handleFile(e.dataTransfer.files[0]);
    e.preventDefault();
    return false;
  }

  handleFile(file) {
    const { userInfo, urls } = this.props;
    const uploadBaseUrl = urls.get('uploadBaseUrl');
    const baseUrl = urls.get('baseUrl');
    this.setState({
      isUploadFailed: false,
      material: null,
      errMsg: ''
    });

    const img = new Image();
    img.onload = () => {
      // 上传图片
      this.setState({
        isUploading: true
      });

      const params = {};

      uploadFile({ file, params, baseUrl, userInfo: userInfo.toJS(), uploadBaseUrl })
        .then(
          material => {
            this.setState({
              isUploading: false,
              material
            });
          },
          failType => {
            if (failType === 'dpiCheckFailed') {
              this.setState({
                errMsg: '请您上传300分辨率的图片',
                isUploadFailed: true,
                isUploading: false
              });
            }
          }
        )
        .catch(err => {
          console.log(err);
          this.setState({
            isUploadFailed: true,
            isUploading: false
          });
        });
    };
    img.src = URL.createObjectURL(file);
  }

  handleAddOk() {
    this.props.addLogoOk(this.state.material);
  }

  handleUploadClick() {
    const { node } = this;
    if (node) {
      node.click();
    }
  }

  handleDragOver(e) {
    this.setState({
      isDragEnter: true
    });
    e.preventDefault();
    return false;
  }

  handleDragEnter() {
    this.setState({
      isDragEnter: true
    });
  }

  handleDragLeave() {
    this.setState({
      isDragEnter: false
    });
  }

  handleDroped(e) {
    const file = e.dataTransfer.files[0];
    this.setState({
      isDragEnter: false
    });
    if (file) {
      this.handleFile(file);
    }
    e.preventDefault();
    return false;
  }

  componentDidMount() {}

  render() {
    const { cancelLogo } = this.props;
    const { isUploadFailed, isUploading, isDragEnter, errMsg, material } = this.state;

    const xmodalProps = {
      data: {
        title: '上传LOGO',
        className: 'add-logo-modal',
        backdropColor: 'rgba(17, 17, 17, 0.4)',
        isHideIcon: false
      },
      actions: {
        handleClose: () => {
          cancelLogo();
        }
      }
    };

    const uploadClassName = classNames('upload-box', {
      hover: isDragEnter
    });
    console.log('material: ', material);

    return (
      <XModal {...xmodalProps}>
        <div className="content">
          <input
            type="file"
            multiple={false}
            onChange={this.handleFileChange}
            ref={node => (this.node = node)}
            accept="image/x-png,image/png,image/jpeg,image/jpg"
          />
          <div
            className={uploadClassName}
            onClick={this.handleUploadClick}
            onDragOver={this.handleDragOver}
            onDragEnter={this.handleDragEnter}
            onDragLeave={this.handleDragLeave}
            onDrop={this.handleDroped}
          >
            {!material && !isUploading ? (
              <div className="upload-tip">
                <img src={addIcon} />
                <div className="tip">点击或者拖拽上传照片</div>
              </div>
            ) : null}
            {!!material ? <div className="replace-tip">替换图片</div> : null}
            {isUploading ? <div className="uploading-tip">图片上传中…</div> : null}
            {!!material ? (
              <img
                src={material.src}
                style={getOrientationAppliedStyle(material.exifOrientation)}
              />
            ) : null}
            {isUploadFailed ? (
              <div className="error-tip">{errMsg ? errMsg : '图片上传失败'}</div>
            ) : null}
          </div>
        </div>
        <div className="btns">
          <button className="add-cart" onClick={this.handleAddOk}>
            确定
          </button>
        </div>
      </XModal>
    );
  }
}

AddLogoModal.propTypes = {
  actions: PropTypes.shape({
    handleClose: PropTypes.func.isRequired,
    handleOk: PropTypes.func.isRequired,
    handleCalcel: PropTypes.func
  }).isRequired,
  text: PropTypes.string
};

AddLogoModal.defaultProps = {
  text: '确认操作？',
  actions: {
    handleClose: () => {},
    handleOk: () => {},
    handleCancel: () => {}
  }
};
