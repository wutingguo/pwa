import React, { Fragment } from 'react';
import XPureComponent from '@resource/components/XPureComponent';
import XCoverRender from '@resource/components/pwa/XCoverRender';
import XInput from '@resource/components/pwa/XInput';
import XButton from '@resource/components/XButton';
import XIcon from '@resource/components/icons/XIcon';
import {
  getEmailCacheKey,
  getPhoneCacheKey,
  getGuestUidCacheKey
} from '@apps/gallery-client/utils/helper';
import * as cache from '@resource/lib/utils/cache';

import { emailReg, phoneReg } from '@resource/lib/constants/reg';

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
      passwordtipContent: ''
    };
  }

  componentDidMount() {
    // this.autoInputValue()
  }

  //如果有email缓存，自动填充
  autoInputValue = () => {
    const { collectionSetting, qs } = this.props;
    const loginEmail = collectionSetting.get('is_login_email');
    if (loginEmail) {
      const collection_uid = qs.get('collection_uid');

      const cacheEmailKey = getEmailCacheKey(collection_uid);
      const phoneKey = getPhoneCacheKey(collection_uid);
      const email = cache.get(cacheEmailKey) || '';
      const phone = cache.get(phoneKey) || '';

      const inputValue = __isCN__ ? phone || email : email;
      if (inputValue) {
        this.setState({ inputValue });
      }
    }
  };

  onInputChange = e => {
    const inputValue = e.target.value.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    this.setState({
      inputValue,
      isShowTip: !inputValue,
      tipContent: !inputValue ? t('YOU_EMAIL_REQUIRED_TIP') : '',
      isShowSuffix: !!inputValue
    });
  };

  onInputClear = () => {
    this.setState({
      inputValue: '',
      isShowSuffix: false,
      isShowTip: true,
      tipContent: t('YOU_EMAIL_REQUIRED_TIP')
    });
  };

  onPasswordChange = e => {
    let passwordValue = e.target.value.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    if (passwordValue.length > 8) {
      passwordValue = passwordValue.substring(0, 8);
    }

    this.setState({
      passwordValue,
      isShowPasswordTip: !passwordValue,
      passwordtipContent: !passwordValue ? t('YOU_GALLERY_PASSWORD_PLACEHOLDER_TIP') : '',
      isShowPasswordSuffix: !!passwordValue
    });
  };

  onPasswordClear = () => {
    this.setState({
      passwordValue: '',
      isShowPasswordSuffix: false,
      isShowPasswordTip: true,
      passwordtipContent: t('YOU_GALLERY_PASSWORD_PLACEHOLDER_TIP')
    });
  };

  checkEmail = isNeedEmail => {
    const { inputValue } = this.state;

    if (!isNeedEmail) {
      return true;
    }

    if (!inputValue) {
      this.setState({
        isShowTip: true,
        tipContent: t('YOU_EMAIL_REQUIRED_TIP')
      });
      return false;
    }

    const isLegal = __isCN__
      ? emailReg.test(inputValue) || phoneReg.test(inputValue)
      : emailReg.test(inputValue);
    if (!isLegal) {
      this.setState({
        isShowTip: true,
        tipContent: t('EMAIL_WRONG')
      });
      return false;
    }

    return true;
  };

  checkPassword = async isNeedPassword => {
    const { boundProjectActions } = this.props;
    const { passwordValue } = this.state;

    if (!isNeedPassword) {
      return true;
    }

    if (!passwordValue) {
      this.setState({
        isShowPasswordTip: true,
        passwordtipContent: t('YOU_GALLERY_PASSWORD_PLACEHOLDER_TIP')
      });
      return false;
    }

    const resCheckPassword = await boundProjectActions.checkPassword(passwordValue);
    const isLegalPassword = resCheckPassword.data;
    if (!isLegalPassword) {
      this.setState({
        isShowPasswordTip: true,
        passwordtipContent: t('PASSWORD_ERROR_TIP')
      });
      return false;
    }

    return true;
  };

  onEnter = async () => {
    window.logEvent.addPageEvent({
      name: 'Gallery_Click_Enter'
    });
    const { collectionSetting, boundProjectActions, qs } = this.props;
    const { inputValue, passwordValue } = this.state;
    // const isNeedEmail = collectionSetting.get('is_login_email');
    const isNeedPassword = true;

    // const isLegal = this.checkEmail(isNeedEmail);
    const isLegalPassword = await this.checkPassword(isNeedPassword);
    if (!isLegalPassword) {
      return false;
    }

    // if (isNeedEmail) {
    //   const collection_uid = qs.get('collection_uid');
    //   const params = {
    //     [emailReg.test(inputValue) ? 'guest_email' : 'guest_phone']: inputValue
    //   };

    //   const guestRes = await boundProjectActions.guestSignUp(params);
    //   const { guest_uid } = guestRes.data;

    //   const cacheEmailKey = getEmailCacheKey(collection_uid);
    //   const cachePhoneKey = getPhoneCacheKey(collection_uid);
    //   const cacheGuestUidKey = getGuestUidCacheKey(collection_uid);
    //   cache.set(cacheGuestUidKey, guest_uid);
    //   cache.set([emailReg.test(inputValue) ? cacheEmailKey : cachePhoneKey], inputValue);

    //   // 获取一下favorite.
    //   await boundProjectActions.getFavoriteImageList(guest_uid);
    // }

    if (!!passwordValue) {
      boundProjectActions.updateGuestInfo({ password_written: true });
    }
  };

  getGuestTip = (isNeedEmail, isNeedPassword) => {
    if (isNeedEmail && isNeedPassword) {
      return t('GUEST_ACCESS_ENTER_MAIL_PASSWORD_TIP');
    }

    if (isNeedPassword) {
      return t('GUEST_ACCESS_ENTER_PASSWORD_TIP');
    }

    return t('GUEST_ACCESS_ENTER_MAIL_TIP');
  };

  render() {
    const { coverBannerInfo, collectionSetting, detail } = this.props;
    const name = detail.get('name');
    const {
      inputValue,
      isShowSuffix,
      isShowTip,
      tipContent,
      passwordValue,
      isShowPasswordSuffix,
      isShowPasswordTip,
      passwordtipContent
    } = this.state;
    const isNeedPassword = true;
    const isNeedEmail = collectionSetting && collectionSetting.get('is_login_email');
    const cover = coverBannerInfo;
    const cover_img = cover.get('cover_img') || cover.get('defaultCoverLarge');

    // 封面显示.
    const coverRenderProps = {
      cover,
      isFullScreen: true
    };

    const inputProps = {
      className: 'enter-email',
      value: inputValue,
      placeholder: t('YOU_EMAIL_PLACEHOLDER'),
      hasSuffix: true,
      onChange: this.onInputChange,
      isShowSuffix,
      isShowTip,
      tipContent,
      suffixIcon: (
        <XIcon type="input-clear" iconWidth={12} iconHeight={12} onClick={this.onInputClear} />
      )
    };

    const passwordProps = Object.assign({}, inputProps, {
      value: passwordValue,
      placeholder: t('YOU_GALLERY_PASSWORD_PLACEHOLDER'),
      onChange: this.onPasswordChange,
      isShowSuffix: isShowPasswordSuffix,
      isShowTip: isShowPasswordTip,
      tipContent: passwordtipContent,
      suffixIcon: (
        <XIcon type="input-clear" iconWidth={12} iconHeight={12} onClick={this.onPasswordClear} />
      )
    });

    return (
      <Fragment>
        {/* <XCoverRender {...coverRenderProps} /> */}
        <img src={cover_img} className="coverImg" />

        <div className="email-input-box">
          <div className="email-wrap">
            <div className="email-name">{name}</div>
            <div className="guest-access-tip">{this.getGuestTip(isNeedEmail, isNeedPassword)}</div>
            {!!isNeedEmail && (
              <div className="input-with-clear">
                <XInput {...inputProps} />
              </div>
            )}
            {!!isNeedPassword && (
              <div className="input-with-clear">
                <XInput {...passwordProps} />
              </div>
            )}
            <XButton className="pwa-btn" onClicked={this.onEnter}>
              {t('ENTER')}
            </XButton>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default EmailEnter;
