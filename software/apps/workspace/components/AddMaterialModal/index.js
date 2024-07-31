import React, { Component } from 'react';
import PropTypes from 'prop-types';
import XModal from '../XModal/index';
import XRadio from '../XRadio';
import { STAMPING_PREFIX, ADD_MATERIAL, ADD_TO_CART2, GET_PRICE } from '../../constants/apiUrl';
import { template } from '../../utils/template';
import { foilImgSizes, foilCopperOptionMap } from '../../constants/strings';
import { uploadFile } from '../../utils/upload';
import { checkIsAlphaImg } from '../../utils/img';
import * as xhr from '@resource/websiteCommon/utils/xhr';
import classNames from 'classnames';
import addIcon from './add.png';
import './index.scss';

export default class AddMaterialModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list: [],
      name: '',
      size: '8X8',
      maxTextLength: 50,
      sizes: Object.keys(foilImgSizes),
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

    this.getExtension = this.getExtension.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.onSizeChanged = this.onSizeChanged.bind(this);
    this.onNameChanged = this.onNameChanged.bind(this);
    this.getRenderSizes = this.getRenderSizes.bind(this);
    this.doAddToCart = this.doAddToCart.bind(this);
    this.handleAddToCart = this.handleAddToCart.bind(this);
    this.handleAddMaterial = this.handleAddMaterial.bind(this);
    this.handleUploadClick = this.handleUploadClick.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDragEnter = this.handleDragEnter.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleDroped = this.handleDroped.bind(this);
    this.getPrice = this.getPrice.bind(this);
  }

  getExtension(filename) {
    const parts = filename.split('.');
    return parts[parts.length - 1];
  }

  onNameChanged(e) {
    this.setState({
      isValidName: true
    });
    const { value } = e.target;
    const { maxTextLength } = this.state;
    const reg = /[^\u4e00-\u9fa5a-zA-Z0-9`~!\\s@#$%^&*()+-_=|{}':;',\\[\\].<>?！@#￥……&*（）—|{}【】‘；：”“'。，、？]/gim;
    const newName = `${value}`
      .trim()
      .replace(reg, '')
      .substring(0, maxTextLength);
    this.setState({
      name: newName
    });
  }

  onSizeChanged(size) {
    this.setState({
      size,
      material: null
    });
  }

  getRenderSizes() {
    const { sizes, size, prices } = this.state;
    const html = [];
    const { userInfo } = this.props;
    sizes.forEach((item, index) => {
      const isChecked = item === size;
      const priceObj = prices[item];
      const isPannlerPlan = userInfo.get('isPlannerPlan');
      const isChildAccount = userInfo.get('customerLevel') === 3;
      const price = priceObj ? (isPannlerPlan ? priceObj.applyUnitPrice : priceObj.oriPrice) : '';
      const text = isChildAccount ? `${item}厘米` : `${item}厘米￥${price}/个`;
      html.push(
        <XRadio
          key={`size-${index}`}
          name="size"
          value={item}
          skin="blue"
          text={text}
          checked={isChecked}
          onClicked={this.onSizeChanged}
        />
      );
    });

    return html;
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
    const { size } = this.state;
    const { userInfo, envUrls } = this.props;
    const uploadBaseUrl = envUrls.get('uploadBaseUrl');
    const baseUrl = envUrls.get('baseUrl');
    this.setState({
      isValidFileType: true,
      isValidFileSize: true,
      isValidFileAlpha: true,
      hasMaterial: true,
      isUploadFailed: false,
      material: null,
      errMsg: ''
    });

    // 检测后缀名
    const ext = this.getExtension(file.name);
    if (ext.toUpperCase() !== 'PNG') {
      this.setState({
        isValidFileType: false
      });
      return;
    }

    const img = new Image();
    img.onload = () => {
      const foilImgSize = foilImgSizes[size];

      // 检测图片是否包含透明像素
      const isValidFileAlpha = checkIsAlphaImg(img);
      if (!isValidFileAlpha) {
        this.setState({
          isValidFileAlpha
        });
        return;
      }

      // 上传图片
      this.setState({
        isUploading: true
      });

      const params = {
        size,
        isNeedResize: true,
        isCheckDpi: true
      };

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

  handleAddMaterial(material) {
    const baseUrl = this.props.envUrls.get('baseUrl');

    return new Promise((resolve, reject) => {
      const { name, size } = this.state;
      const { encImgId } = material;
      const product = 'OT_FOIL_COPPER';
      xhr
        .post(`${baseUrl}${ADD_MATERIAL}`, {
          product,
          name,
          size,
          encImgId
        })
        .then(res => {
          if (res && res.data && res.data.materialId) {
            resolve(res.data);
          } else {
            reject();
          }
        })
        .catch(reject);
    });
  }

  doAddToCart(data) {
    const { size } = this.state;
    const { materialId, skuCode } = data;
    const baseUrl = this.props.envUrls.get('baseUrl');
    const url = template(ADD_TO_CART2, {
      productSkuCode: skuCode,
      materialId,
      baseUrl,
      foil_copper_option: foilCopperOptionMap[size]
    });
    logEvent.addPageEvent({
      name: 'YX_PC_MaterialManager_Click_AddToCart',
      size
    });
    location.href = url;
  }

  handleAddToCart() {
    this.setState({
      isAddToCartFailed: false
    });

    const { isValidFileType, isValidFileSize, isValidFileAlpha, name, material } = this.state;

    if (!name.trim()) {
      this.setState({
        isValidName: false
      });
      return;
    }

    if (!material) {
      this.setState({
        hasMaterial: false
      });
      return;
    }

    if (!isValidFileType || !isValidFileSize || !isValidFileAlpha) {
      return;
    }

    this.handleAddMaterial(material)
      .then(this.doAddToCart)
      .catch(err => {
        this.setState({
          isAddToCartFailed: true
        });
      });
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

  getPrice(size) {
    const baseUrl = this.props.envUrls.get('baseUrl');
    return new Promise((resolve, reject) => {
      const url = template(GET_PRICE, {
        product: 'foitCopper',
        options: size,
        baseUrl
      });
      xhr.get(url).then(res => {
        if (res && res.data && res.data.main) {
          resolve(res.data.main);
        } else {
          reject();
        }
      });
    });
  }

  componentDidMount() {
    const { sizes } = this.state;
    const stacks = [];
    sizes.forEach(size => {
      stacks.push(this.getPrice(size));
    });

    Promise.all(stacks).then(res => {
      const prices = {};
      res.forEach((price, index) => {
        prices[sizes[index]] = price;
      });
      this.setState({
        prices
      });
    });
  }

  render() {
    const { text, handleClose } = this.props;
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

    const foilImgSize = foilImgSizes[size];

    const xmodalProps = {
      data: {
        title: '新建烫印LOGO',
        className: 'add-material-modal',
        backdropColor: 'rgba(17, 17, 17, 0.4)',
        isHideIcon: false
      },
      actions: {
        handleClose: () => {
          handleClose(true);
        }
      }
    };

    const uploadClassName = classNames('upload-box', {
      hover: isDragEnter
    });

    const baseUrl = this.props.envUrls.get('baseUrl');
    return (
      <XModal {...xmodalProps}>
        <div className="content">
          <div className="m-left">
            <div className="field">
              <div className="label">名称</div>
              <div className="value">
                <input
                  type="text"
                  placeholder="请输入名称"
                  onChange={this.onNameChanged}
                  value={name}
                />
                <span className="text-tip">{`${name.length}/${maxTextLength}`}</span>
              </div>
            </div>
            <div className="field">
              <div className="label">选择尺寸</div>
              <div className="value">{this.getRenderSizes()}</div>
            </div>
            <div className="field">
              <div className="label">示意图</div>
              <div className="value image-value">
                <img src={`${baseUrl}${STAMPING_PREFIX}${size}_2.png`} />
              </div>
            </div>
          </div>
          <div className="m-right">
            <input
              type="file"
              multiple={false}
              onChange={this.handleFileChange}
              ref={node => (this.node = node)}
              accept="image/x-png,image/png"
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
              {material ? <div className="replace-tip">替换图片</div> : null}
              {isUploading ? <div className="uploading-tip">图片上传中…</div> : null}
              {material ? <img src={material.src} /> : null}
              {!isValidFileType ? <div className="error-tip">请您上传png图片格式</div> : null}
              {!isValidFileSize ? <div className="error-tip">请您上传300分辨率的图片</div> : null}
              {!isValidFileAlpha ? <div className="error-tip">请您上传透明背景图片</div> : null}
              {isUploadFailed ? (
                <div className="error-tip">{errMsg ? errMsg : '图片上传失败'}</div>
              ) : null}
            </div>
            <div className="tips">
              <p className="tit">上传图片要求</p>
              <p>1.png格式（透明底）的黑色logo图片</p>
              <p>{`2.建议图片尺寸：${foilImgSize.width}x${foilImgSize.height}px，分辨率300dpi`}</p>
              <p>
                3.如上传图片内包含文本信息，
                <span className="bold-font">建议字体不小于34pt否则无法生产</span>
              </p>
              <p>*温馨提示：受烫金工艺影响，无法处理过于复杂的图案，如需确认请联系客服</p>
            </div>
          </div>
        </div>
        <div className="btns">
          {!isValidName ? <div className="error-tip">请您输入名称</div> : null}
          {!hasMaterial ? <div className="error-tip">您尚未成功上传素材</div> : null}
          {isAddToCartFailed ? <div className="error-tip">添加购物车失败</div> : null}
          <button className="add-cart" onClick={this.handleAddToCart}>
            添加到购物车
          </button>
        </div>
      </XModal>
    );
  }
}

AddMaterialModal.propTypes = {
  actions: PropTypes.shape({
    handleClose: PropTypes.func.isRequired,
    handleOk: PropTypes.func.isRequired,
    handleCalcel: PropTypes.func
  }).isRequired,
  text: PropTypes.string
};

AddMaterialModal.defaultProps = {
  text: '确认操作？',
  actions: {
    handleClose: () => {},
    handleOk: () => {},
    handleCancel: () => {}
  }
};
