import React, { Fragment } from 'react';

import XButton from '@resource/components/XButton';
import XPureComponent from '@resource/components/XPureComponent';
import XIcon from '@resource/components/icons/XIcon';

import XInput from '@resource/components/pwa/XInput';

import * as cache from '@resource/lib/utils/cache';

import { emailReg, phoneReg } from '@resource/lib/constants/reg';

import {
  getEmailCacheKey,
  getGuestUidCacheKey,
  getPhoneCacheKey,
} from '@apps/commodity-client/utils/helper';

class EmailEnter extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      isShowSuffix: false,
      isShowTip: false,
      tipContent: '',

      passwordValue: '',
      isShowPasswordSuffix: false,
      isShowPasswordTip: false,
      passwordtipContent: '',
    };
    this.handleEnterKey = this.handleEnterKey.bind(this);
  }

  componentDidMount() {
    this.autoInputValue();
    window.addEventListener('keyup', this.handleEnterKey);
  }
  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleEnterKey);
  }
  handleEnterKey(e) {
    if (e.keyCode === 13) {
      this.startButton && this.startButton.onButtonClick();
    }
  }
  //如果有email缓存，自动填充
  autoInputValue = () => {
    // const { collectionSetting, qs } = this.props;
    // const loginEmail = collectionSetting.get('is_login_email');
    // if (loginEmail) {
    //   const collection_uid = qs.get('collection_uid');
    //   const phoneKey = getPhoneCacheKey(collection_uid);
    //   const phone = cache.get(phoneKey) || '';
    //   const inputValue = phone;
    //   if (inputValue) {
    //     this.setState({ inputValue });
    //   }
    // }
  };

  onInputChange = e => {
    const inputValue = e.target.value.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    this.setState({
      inputValue,
      isShowTip: !inputValue,
      tipContent: !inputValue ? t('手机号为必填项。') : '',
      isShowSuffix: !!inputValue,
    });
  };

  checkEmail = isNeedPhone => {
    const { inputValue } = this.state;

    if (!isNeedPhone) {
      return true;
    }

    if (!inputValue) {
      this.setState({
        isShowTip: true,
        tipContent: t('YOU_EMAIL_REQUIRED_TIP'),
      });
      return false;
    }

    const isLegal = phoneReg.test(inputValue);
    if (!isLegal) {
      this.setState({
        isShowTip: true,
        tipContent: t('手机号输入错误'),
      });
      return false;
    }

    return true;
  };

  onEnter = async () => {
    const { boundProjectActions, qs } = this.props;
    const { inputValue } = this.state;
    const isLegal = this.checkEmail(true);
    if (!isLegal) {
      return false;
    }
    const enc_sw_id = qs.get('enc_sw_id');
    const params = {
      client_identity: inputValue,
      enc_sw_id,
    };

    const guestRes = await boundProjectActions.storeSign(params);
    const { id } = guestRes.data;

    const cachePhoneKey = getPhoneCacheKey(enc_sw_id);
    const cacheGuestUidKey = getGuestUidCacheKey(enc_sw_id);
    cache.set(cacheGuestUidKey, id);
    cache.set(cachePhoneKey, inputValue);
  };

  render() {
    const { collectionSetting } = this.props;
    const { inputValue, isShowSuffix, isShowTip, tipContent } = this.state;
    const isNeedPhone = true;

    const inputProps = {
      className: 'enter-email',
      value: inputValue,
      placeholder: '请输入常用手机号',
      hasSuffix: true,
      onChange: this.onInputChange,
      isShowSuffix,
      isShowTip,
      tipContent,
    };

    return (
      <Fragment>
        <div className="email-input-box">
          <div className="email-wrap">
            {!!isNeedPhone && (
              <div className="input-with-clear">
                <XInput {...inputProps} />
              </div>
            )}
            <XButton
              className="pwa-btn"
              onClicked={this.onEnter}
              ref={node => (this.startButton = node)}
            >
              确认
            </XButton>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default EmailEnter;
