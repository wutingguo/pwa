import React from 'react';
import classNames from 'classnames';
import { XPureComponent } from '@common/components';
import addIcon from './add.png';
import './index.scss';

class Index extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      name: '',
      size: '8X8',
      maxTextLength: 50,
      sizes: ['4X4', '6X6', '8X8', '11X11'],
      isValidFileType: true,
      isValidFileSize: true,
      isValidFileAlpha: true,
      isValidName: true,
      hasMaterial: true,
      isUploadFailed: false,
      isAddToCartFailed: false,
      isUploading: false,
      isDragEnter: false,
      material: null,
      prices: {},
      errMsg: ''
    };
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleFile = this.handleFile.bind(this);
    this.handleUploadClick = this.handleUploadClick.bind(this);
    this.getExtension = this.getExtension.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDragEnter = this.handleDragEnter.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleDroped = this.handleDroped.bind(this);
  }

  componentDidMount() {
    const {  boundProjectActions }  = this.props;
  }

  handleFile(file) {
    const {  boundProjectActions, name }  = this.props;
    const { size } = this.state;

    this.setState({
      isValidFileType: true,
      isValidFileSize: true,
      isValidFileAlpha: true,
      hasMaterial: true,
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
      boundProjectActions.uploadFile(file, name)
        .then(material => {
          console.log('material===', material);
          this.setState({
            isUploading: false,
            material
          });
        }, (failType) => {
          if (failType === 'dpiCheckFailed') {
            this.setState({
              errMsg: '请您上传300分辨率的图片',
              isUploadFailed: true,
              isUploading: false
            });
          }
        })
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

  render() {
    const {
      size,
      name,
      maxTextLength,
      isValidFileType,
      isValidFileSize,
      isValidFileAlpha,
      isUploadFailed,
      isAddToCartFailed,
      isUploading,
      material,
      isValidName,
      hasMaterial,
      isDragEnter,
      errMsg
    } = this.state;
    const { className = '', label = '', imgUrl } = this.props;
    const uploadWrapperBoxClassName = classNames('upload-wraper', className);
    const uploadBoxClassName = classNames('upload-box', {
      hover: isDragEnter
    });
    return (
      <div className={uploadWrapperBoxClassName}>
        <input
          type="file"
          onChange={this.handleFileChange}
          ref={node => (this.node = node)}
          accept="image/jpeg,image/x-png,image/png"
        />
        <div
          className={uploadBoxClassName}
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
          {material ? <div className="replace-tip">替换图片</div> : null}
          {isUploading ? (
            <div className="uploading-tip">图片上传中…</div>
          ) : null}
          {imgUrl && !isUploading ? <img src={imgUrl} /> : null}
          {/*{!isValidFileType ? (*/}
          {/*  <div className="error-tip">请您上传png图片格式</div>*/}
          {/*) : null}*/}
          {/*{!isValidFileSize ? (*/}
          {/*  <div className="error-tip">请您上传300分辨率的图片</div>*/}
          {/*) : null}*/}
          {isUploadFailed ? (
            <div className="error-tip">{errMsg ? errMsg : '图片上传失败'}</div>
          ) : null}
        </div>
        <div className="upload-label">
          {label}
          <span className="red">*</span>
        </div>
      </div>
    );
  }

}

export default Index;