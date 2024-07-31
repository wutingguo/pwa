import React, { Fragment } from 'react';

import XButton from '@resource/components/XButton';
import XPureComponent from '@resource/components/XPureComponent';
import XIcon from '@resource/components/icons/XIcon';

import XCoverRender from '@resource/components/pwa/XCoverRender';
import XInput from '@resource/components/pwa/XInput';

import * as cache from '@resource/lib/utils/cache';

import { phoneReg } from '@resource/lib/constants/reg';

class EditUserPhone extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      isShowSuffix: false,
      isShowTip: false,
      tipContent: '',
    };
  }
  componentDidMount() {}
  onInputChange = e => {
    const inputValue = e.target.value.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    this.setState({
      inputValue,
      isShowTip: !inputValue,
      tipContent: !inputValue ? t('手机号为必填项') : '',
      isShowSuffix: !!inputValue,
    });
  };

  onInputClear = () => {
    this.setState({
      inputValue: '',
      isShowSuffix: false,
      isShowTip: true,
      tipContent: t('手机号为必填项'),
    });
  };

  checkEmail = () => {
    const { inputValue } = this.state;
    if (!inputValue) {
      this.setState({
        isShowTip: true,
        tipContent: t('手机号为必填项'),
      });
      return;
    }
    const isLegalPhone = phoneReg.test(inputValue);
    if (!isLegalPhone && inputValue) {
      this.setState({
        isShowTip: true,
        tipContent: t('手机号格式错误'),
      });
      return;
    }
    return true;
  };
  onEnter = async () => {
    const { freshReader, boundProjectActions, qs } = this.props;
    const { inputValue } = this.state;
    const tag = this.checkEmail();
    if (tag) {
      // 提交信息
      const collection_uid = qs.get('collection_uid');
      boundProjectActions.saveAiGuest(inputValue).then(res => {
        cache.set('aiFaceUserEditPhone', collection_uid);
        freshReader();
      });
    }
  };

  render() {
    const { coverBannerInfo } = this.props;
    const { inputValue, isShowSuffix, isShowTip, tipContent } = this.state;
    const cover = coverBannerInfo;
    // 封面显示.
    const coverRenderProps = {
      cover,
      isFullScreen: true,
      isHideTitle: true,
    };
    const inputProps = {
      className: 'enter-phone',
      value: inputValue,
      placeholder: t('请输入手机号'),
      hasSuffix: true,
      onChange: this.onInputChange,
      isShowSuffix,
      isShowTip,
      tipContent,
      suffixIcon: (
        <XIcon type="input-clear" iconWidth={12} iconHeight={12} onClick={this.onInputClear} />
      ),
    };

    return (
      <Fragment>
        <XCoverRender {...coverRenderProps} />
        <div className="ai-info-box">
          <div className="ai-info">
            <div className="title">结果确认</div>
            <div className="msg">请输入手机号登录，您可对分片结果进行调整</div>
            <div className="input-with-clear">
              <XInput {...inputProps} />
            </div>
            <XButton width={140} className="btn" onClicked={this.onEnter}>
              确认
            </XButton>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default EditUserPhone;
