import React, { Fragment } from 'react';

import XButton from '@resource/components/XButton';
import XPureComponent from '@resource/components/XPureComponent';
import XIcon from '@resource/components/icons/XIcon';

import XCoverRender from '@resource/components/pwa/XCoverRender';
import XInput from '@resource/components/pwa/XInput';

import * as cache from '@resource/lib/utils/cache';

import { NAME_CN_REG, emailReg, phoneReg } from '@resource/lib/constants/reg';

import {
  getEmailCacheKey,
  getGuestUidCacheKey,
  getPhoneCacheKey,
} from '@apps/gallery-client/utils/helper';

class EmailEnter extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      isShowSuffix: false,
      isShowTip: false,
      tipContent: '',
      EmailInputValue: '',
      NameInputValue: '',
      OtherInputValue: '',
      passwordValue: '',
      isShowPasswordSuffix: false,
      isShowPasswordTip: false,
      passwordtipContent: '',
      EmailTipContent: '',
      isShowEmailTip: false,
      NameTipContent: '',
      isShowNameTip: false,
      OtherTipContent: '',
      isShowOtherTip: false,
    };
  }

  componentDidMount() {
    this.autoInputValue();
    const { coverBannerInfo, collectionSetting } = this.props;
    const login_information_config =
      collectionSetting && collectionSetting.get('login_information_config');
    const setting_details = login_information_config.get('setting_details');
    const Email = setting_details.find(item => item.get('information_id') === 2).toJS();
    const Name = setting_details.find(item => item.get('information_id') === 3).toJS();
    const Other = setting_details.find(item => item.get('information_id') === 4).toJS();
    this.setState({
      Email,
      Name,
      Other,
    });
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
      tipContent: !inputValue ? t('手机号为必填项') : '',
      isShowSuffix: !!inputValue,
    });
  };

  onEmailInputChange = (e, Email) => {
    const EmailInputValue = e.target.value.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    this.setState({
      EmailInputValue,
      isShowEmailTip: !EmailInputValue && Email.is_required,
      EmailTipContent: !EmailInputValue ? t('YOU_EMAIL_REQUIRED_TIP') : '',
      isShowEmailSuffix: !!EmailInputValue && Email.is_required,
    });
  };
  onNameInputChange = (e, Name) => {
    let NameInputValue = e.target.value;
    if (/[!@#$%^&*()/\|,.<>?"();:+=\[\]{}]/.test(NameInputValue)) {
      NameInputValue = NameInputValue.replace(/[!@#$%^&*()/\|,.<>?"();:+=\[\]{}]/g, '');
    }
    if (NameInputValue.length > 30) {
      NameInputValue = NameInputValue.substr(0, 30);
    }
    this.setState({
      NameInputValue,
      isShowNameTip: !NameInputValue && Name.is_required,
      NameTipContent: !NameInputValue ? t('姓名为必填项') : '',
      isShowNameSuffix: !!NameInputValue && Name.is_required,
    });
  };
  onOtherInputChange = (e, Other) => {
    let OtherInputValue = e.target.value.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    if (OtherInputValue.length > 50) {
      OtherInputValue = OtherInputValue.substr(0, 50);
    }
    this.setState({
      OtherInputValue,
      isShowOtherTip: !OtherInputValue && Other.is_required,
      OtherTipContent: !OtherInputValue ? `${Other.information_name}为必填项` : '',
      isShowOtherSuffix: !!OtherInputValue && Other.is_required,
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

  onPasswordChange = e => {
    let passwordValue = e.target.value.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    if (passwordValue.length > 8) {
      passwordValue = passwordValue.substring(0, 8);
    }

    this.setState({
      passwordValue,
      isShowPasswordTip: !passwordValue,
      passwordtipContent: !passwordValue ? t('YOU_GALLERY_PASSWORD_PLACEHOLDER_TIP') : '',
      isShowPasswordSuffix: !!passwordValue,
    });
  };

  onPasswordClear = () => {
    this.setState({
      passwordValue: '',
      isShowPasswordSuffix: false,
      isShowPasswordTip: true,
      passwordtipContent: t('YOU_GALLERY_PASSWORD_PLACEHOLDER_TIP'),
    });
  };

  checkEmail = isNeedEmail => {
    const { inputValue, EmailInputValue, NameInputValue, OtherInputValue, Email, Name, Other } =
      this.state;

    if (!isNeedEmail) {
      return true;
    }
    if (!inputValue) {
      this.setState({
        isShowTip: true,
        tipContent: t('手机号为必填项'),
      });
    }
    if (!EmailInputValue && Email.is_required) {
      this.setState({
        isShowEmailTip: true,
        EmailTipContent: t('邮箱为必填项'),
      });
    }
    if (!NameInputValue && Name.is_required) {
      this.setState({
        isShowNameTip: true,
        NameTipContent: t('姓名为必填项'),
      });
    }
    if (!OtherInputValue && Other.is_required) {
      this.setState({
        isShowOtherTip: true,
        OtherTipContent: `${Other.information_name}为必填项`,
      });
    }
    if (
      !inputValue ||
      (!EmailInputValue && Email.is_required && Email.is_choose) ||
      (!NameInputValue && Name.is_required && Name.is_choose) ||
      (!OtherInputValue && Other.is_required && Other.is_choose)
    ) {
      return false;
    }

    const isLegalPhone = Email.is_choose
      ? phoneReg.test(inputValue)
      : phoneReg.test(inputValue) || emailReg.test(inputValue);
    const isLegalEmail = emailReg.test(EmailInputValue);
    const isLegalName = NAME_CN_REG.test(NameInputValue);
    if (!isLegalPhone && inputValue) {
      this.setState({
        isShowTip: true,
        tipContent: t('手机号格式错误'),
      });
    }
    if (!isLegalEmail && EmailInputValue) {
      this.setState({
        isShowEmailTip: true,
        EmailTipContent: t('邮箱格式错误'),
      });
    }

    if (!isLegalName && NameInputValue) {
      this.setState({
        isShowNameTip: true,
        NameTipContent: t('CREATE_COLLECTION_ILLEGAL_TIP'),
      });
    }
    if (
      (!isLegalPhone && inputValue) ||
      (!isLegalEmail && EmailInputValue) ||
      (!isLegalName && NameInputValue)
    ) {
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
        passwordtipContent: t('YOU_GALLERY_PASSWORD_PLACEHOLDER_TIP'),
      });
      return false;
    }

    const resCheckPassword = await boundProjectActions.checkPassword(passwordValue);
    const isLegalPassword = resCheckPassword.ret_code === 200000;
    if (!isLegalPassword) {
      this.setState({
        isShowPasswordTip: true,
        passwordtipContent: t('PASSWORD_ERROR_TIP'),
      });
      return false;
    }

    return true;
  };

  onEnter = async () => {
    window.logEvent.addPageEvent({
      name: 'Gallery_Click_Enter',
    });
    const { collectionSetting, boundProjectActions, qs } = this.props;
    const { inputValue, passwordValue, EmailInputValue, NameInputValue, OtherInputValue, Email } =
      this.state;
    const isNeedPassword = collectionSetting.get('gallery_password_switch');
    const login_information_config =
      collectionSetting && collectionSetting.get('login_information_config');
    const isNeedLoginInfo = login_information_config.get('collect_type') === 1;
    const isLegal = this.checkEmail(isNeedLoginInfo);
    const isLegalPassword = await this.checkPassword(isNeedPassword);
    if (!isLegal || !isLegalPassword) {
      return false;
    }

    if (isNeedLoginInfo) {
      const collection_uid = qs.get('collection_uid');
      const params = {
        guest_email: EmailInputValue,
        [Email.is_choose
          ? 'guest_phone'
          : emailReg.test(inputValue)
          ? 'guest_email'
          : 'guest_phone']: inputValue,
        guest_name: NameInputValue,
        guest_other_info: OtherInputValue,
      };

      const guestRes = await boundProjectActions.guestSignUp(params);
      const { guest_uid } = guestRes.data;

      const cacheEmailKey = getEmailCacheKey(collection_uid);
      const cachePhoneKey = getPhoneCacheKey(collection_uid);
      const cacheGuestUidKey = getGuestUidCacheKey(collection_uid);
      cache.set(cacheGuestUidKey, guest_uid);
      cache.set([emailReg.test(inputValue) ? cacheEmailKey : cachePhoneKey], inputValue);

      // 获取一下favorite.
      await boundProjectActions.getFavoriteImageList(guest_uid);
      // 尝试登录E-Store 不需要响应数据
      boundProjectActions.storeSignUp({
        email: inputValue,
        fromGallery: true,
      });
    }

    if (isNeedPassword && !!passwordValue) {
      boundProjectActions.updateGuestInfo({ password_written: true });
    }
  };

  render() {
    const { coverBannerInfo, collectionSetting, detail } = this.props;
    const {
      inputValue,
      isShowSuffix,
      isShowTip,
      tipContent,
      passwordValue,
      isShowPasswordSuffix,
      isShowPasswordTip,
      passwordtipContent,
      EmailInputValue,
      NameInputValue,
      OtherInputValue,
      EmailTipContent,
      isShowEmailTip,
      NameTipContent,
      isShowNameTip,
      OtherTipContent,
      isShowOtherTip,
    } = this.state;
    const isNeedPassword = collectionSetting.get('gallery_password_switch');
    const login_information_config =
      collectionSetting && collectionSetting.get('login_information_config');
    const setting_details = login_information_config.get('setting_details');
    const isNeedLoginInfo = login_information_config.get('collect_type') === 1;
    const Email = setting_details.find(item => item.get('information_id') === 2).toJS();
    const Name = setting_details.find(item => item.get('information_id') === 3).toJS();
    const Other = setting_details.find(item => item.get('information_id') === 4).toJS();
    const cover = coverBannerInfo;
    const collection_name = detail.get('collection_name');

    // 封面显示.
    const coverRenderProps = {
      cover,
      isFullScreen: true,
      isHideTitle: true,
    };

    const inputProps = {
      className: 'enter-email',
      value: inputValue,
      placeholder: t('您的手机号（必填）'),
      hasSuffix: true,
      onChange: this.onInputChange,
      isShowSuffix,
      isShowTip,
      tipContent,
      suffixIcon: (
        <XIcon type="input-clear" iconWidth={12} iconHeight={12} onClick={this.onInputClear} />
      ),
    };
    const EmailInputProps = {
      className: 'enter-email',
      value: EmailInputValue,
      placeholder: `您的邮箱${Email.is_required ? '（必填）' : '（选填）'}`,
      onChange: e => this.onEmailInputChange(e, Email),
      isShowSuffix: isShowSuffix,
      isShowTip: isShowEmailTip,
      tipContent: EmailTipContent,
      suffixIcon: (
        <XIcon type="input-clear" iconWidth={12} iconHeight={12} onClick={this.onInputClear} />
      ),
    };
    const NameInputProps = {
      className: 'enter-email',
      value: NameInputValue,
      placeholder: `您的姓名${Name.is_required ? '（必填）' : '（选填）'}`,
      onChange: e => this.onNameInputChange(e, Name),
      isShowSuffix: isShowSuffix,
      isShowTip: isShowNameTip,
      tipContent: NameTipContent,
      maxLength: 30,
      suffixIcon: (
        <XIcon type="input-clear" iconWidth={12} iconHeight={12} onClick={this.onInputClear} />
      ),
    };
    const OtherInputProps = {
      className: 'enter-email',
      value: OtherInputValue,
      placeholder: `您的${Other.information_name}${Other.is_required ? '（必填）' : '（选填）'}`,
      onChange: e => this.onOtherInputChange(e, Other),
      isShowSuffix: isShowSuffix,
      isShowTip: isShowOtherTip,
      tipContent: OtherTipContent,
      maxLength: 50,
      suffixIcon: (
        <XIcon type="input-clear" iconWidth={12} iconHeight={12} onClick={this.onInputClear} />
      ),
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
      ),
    });

    return (
      <Fragment>
        <XCoverRender {...coverRenderProps} />

        <div className="login-info-box">
          <div className="email-wrap">
            <div className="collection-title" title={collection_name}>
              {' '}
              {collection_name}{' '}
            </div>
            <div className="guest-access-tip">请输入以下信息查看照片集</div>
            {isNeedLoginInfo && (
              <div className="input-with-clear">
                <XInput {...inputProps} />
              </div>
            )}
            {!!Email.is_choose && isNeedLoginInfo && (
              <div className="input-with-clear">
                <XInput {...EmailInputProps} />
              </div>
            )}
            {!!Name.is_choose && isNeedLoginInfo && (
              <div className="input-with-clear">
                <XInput {...NameInputProps} />
              </div>
            )}
            {!!Other.is_choose && isNeedLoginInfo && (
              <div className="input-with-clear">
                <XInput {...OtherInputProps} />
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
