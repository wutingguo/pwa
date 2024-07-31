import React, { Component } from 'react';

import XSlider from '@resource/components/XSlider';

import { getImageUrl } from '@resource/lib/saas/image';

import { NAME_CN_REG, NAME_REG, SPACE_REG } from '@resource/lib/constants/reg';
import { thumbnailSizeTypes } from '@resource/lib/constants/strings';

import { XBaseModal, XButton, XCheckBox, XIcon, XInput } from '@common/components';

import WaterMarkPosition from './components/WaterMarkPosition';
import { textToPosition } from './components/WaterMarkPosition/config';
import { WaterMarkBox } from './components/WaterMarkPosition/layout';
import defaultImage from './img/default.jpg';

import './index.scss';

class CreatWatemarkModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      scale: 50,
      opacity: 90,
      position_value: 4,
      markSrc: '',
      ratio: 0,

      isShowTip: false,
      tipContent: '',
      isShowSuffix: false,
      isFullScreen: false,
    };

    this.defaultWidth = 293;
    this.defaultHeight = 185;
  }

  async componentDidMount() {
    let {
      enc_image_uid,
      width,
      height,
      watermark_name = t('DEFAULT_TITLE'),
      scale = 50,
      opacity = 90,
      markSrc = '',
      position_value,
      full_screen,
    } = this.props.fields;
    if (!markSrc) {
      markSrc = await this.getImageSrc({
        image_uid: enc_image_uid,
      });
    }
    this.setState({
      markSrc,
      ratio: height / width,
      name: watermark_name,
      scale,
      opacity,
      position_value: position_value || 4,
      isFullScreen: full_screen,
    });
  }

  getImageSrc = obj => {
    const { galleryBaseUrl } = this.props.urls;
    return getImageUrl({
      galleryBaseUrl,
      thumbnail_size: thumbnailSizeTypes.SIZE_200,
      isWaterMark: false,
      ...obj,
    });
  };

  onNameChange = e => {
    let inputValue = e.target.value;
    if (inputValue.length > 50) {
      inputValue = inputValue.substring(0, 50);
    }
    this.setState({
      name: inputValue,
      isShowTip: !!inputValue ? false : true,
      tipContent: !!inputValue ? '' : t('FULLNAME_REQUIRE_TIP'),
      isShowSuffix: !!inputValue ? true : false,
    });
  };

  onScaleChange = e => {
    this.setState({
      scale: e,
    });
  };

  onOpacityChange = e => {
    this.setState({
      opacity: e,
    });
  };

  onInputFocus = e => {
    const inputValue = e.target.value;
    this.setState({
      isShowSuffix: !!inputValue ? true : false,
    });
  };

  onInputClear = () => {
    const { data } = this.props;
    this.setState({
      name: '',
      isShowSuffix: false,
      isShowTip: true,
      tipContent: t('FULLNAME_REQUIRE_TIP'),
    });
  };

  onSave = () => {
    const { watermarkList } = this.props;
    const { enc_image_uid, watermark_uid, watermark_name } = this.props.fields;
    const { scale, opacity, name, position_value, isFullScreen } = this.state;

    const nameReg = __isCN__ ? NAME_CN_REG : NAME_REG;
    const isLegal = nameReg.test(name);
    const isEmptyStr = SPACE_REG.test(name);
    let tipContent = '';
    let isShowTip = false;
    if (!name || isEmptyStr) {
      isShowTip = true;
      tipContent = t('FULLNAME_REQUIRE_TIP');
    } else if (!isLegal) {
      isShowTip = true;
      tipContent = t('CREATE_COLLECTION_ILLEGAL_TIP');
    }

    // if (watermark_name === name) {
    //   this.props.close();
    //   return;
    // }

    const isFindRepeatedName = watermarkList.find(
      item => item.watermark_uid !== watermark_uid && name === item.watermark_name && item.can_edit
    );
    this.setState({
      isShowTip,
      tipContent,
    });

    if (name && isLegal && !isEmptyStr) {
      this.props.onSave({
        image_id: enc_image_uid,
        name: name.trim(),
        position_value,
        scale: scale / 100,
        opacity: opacity / 100,
        watermark_uid,
        isRepeatedName: !!isFindRepeatedName,
        full_screen: isFullScreen,
      });
    }
  };
  onWMPositionChange = positionKey => {
    this.setState({
      position_value: positionKey,
    });
  };
  onFullScreen = ({ checked }) => {
    let { scale = 50, position_value } = this.props?.fields || {};
    this.setState({
      isFullScreen: checked,
    });
    if (checked) {
      this.setState({
        scale: 100,
        position_value: 4,
      });
    }
    //  else {
    //   this.setState({
    //     scale: scale,
    //     position_value: position_value,
    //   });
    // }
  };
  render() {
    const {
      name,
      scale,
      opacity,
      position_value,
      markSrc,
      ratio,
      isShowSuffix,
      isShowTip,
      tipContent,
      isFullScreen,
    } = this.state;
    const modalProps = {
      title: t('EDIT_WATEMARK'),
      onClosed: this.props.close,
      className: 'creat-watemark-modal',
      footer: false,
    };

    const defaultSize = {
      width: this.defaultWidth,
      height: this.defaultHeight,
    };

    const defaultImageStyle = {
      ...defaultSize,
      zIndex: 1,
    };

    const markImageStyle = {
      width: this.defaultWidth * (scale / 100),
      opacity: opacity / 100,
      ...textToPosition[position_value - 1],
    };
    const inputProps = {
      className: 'edit',
      value: name,
      onFocus: this.onInputFocus,
      onChange: this.onNameChange,
      hasSuffix: true,
      isShowSuffix: isShowSuffix,
      isShowTip: isShowTip,
      tipContent: tipContent,
      suffixIcon: (
        <XIcon type="input-clear" iconWidth={12} iconHeight={12} onClick={this.onInputClear} />
      ),
    };
    const checkBoxProps = {
      className: 'watemark-edit black-theme',
      onClicked: value => this.onFullScreen(value),
      checked: isFullScreen,
      text: '设为全屏',
    };

    return (
      <XBaseModal {...modalProps}>
        <div className="preview">{t('PREVIEW')}</div>
        <div className="flex-content">
          <div className="canvas-box" style={defaultSize}>
            <img src={defaultImage} style={defaultImageStyle} />
            <WaterMarkBox src={markSrc} {...markImageStyle} />
          </div>
          <div className="option-box">
            <div className="option-item">
              <label>{t('NAME')}</label>
              <XInput {...inputProps} />
            </div>
            {__isCN__ && (
              <div className="option-item">
                <XCheckBox {...checkBoxProps} />
              </div>
            )}
            {!isFullScreen && (
              <div className="option-item">
                <label>
                  {t('SCALE')}
                  <span>{scale}%</span>
                </label>
                <XSlider min={1} value={scale} handleSliderChange={this.onScaleChange} />
              </div>
            )}
            <div className="option-item">
              <label>
                {t('OPACITY')} <span>{opacity}%</span>
              </label>
              <XSlider min={1} value={opacity} handleSliderChange={this.onOpacityChange} />
            </div>
            {!isFullScreen && (
              <div className="option-item">
                <label style={{ marginTop: '20px' }}>{t('LP_WATERMARK_POSITION')}</label>
                <WaterMarkPosition
                  activeKey={position_value}
                  handleWaterMarkPositionChange={this.onWMPositionChange}
                />
              </div>
            )}
          </div>
        </div>
        <div className="w-footer">
          <XButton className="save-btn" onClicked={this.onSave}>
            {t('SAVE')}
          </XButton>
        </div>
      </XBaseModal>
    );
  }
}

export default CreatWatemarkModal;
