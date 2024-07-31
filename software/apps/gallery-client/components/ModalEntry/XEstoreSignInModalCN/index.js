import classNames from 'classnames';
import { isFunction } from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { NAME_CN_REG, SPACE_REG, emailReg, phoneReg } from '@resource/lib/constants/reg';

import { XButton, XIcon, XInput, XModal } from '@common/components';

import './index.scss';

class XEstoreSignInModalCN extends Component {
  constructor(props) {
    super(props);

    const { data } = props;

    this.state = {
      inputValue: data.get('collectionName') || '',
      isShowTip: false,
      tipContent: '',
      isShowSuffix: false,
      isShowToolTip: false,
      EmailInputValue: '',
      NameInputValue: '',
      OtherInputValue: '',
      EmailTipContent: '',
      isShowEmailTip: false,
      NameTipContent: '',
      isShowNameTip: false,
      OtherTipContent: '',
      isShowOtherTip: false,
      signLoading: false,
    };
  }
  componentDidMount() {
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

  onClickBtn = cb => {
    const { data } = this.props;
    const close = data.get('close');

    if (isFunction(close)) {
      close();
    }

    if (isFunction(cb)) {
      cb();
    }
  };

  onInputChange = e => {
    const inputValue = e.target.value;
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
      EmailTipContent: !EmailInputValue ? t('邮箱为必填项') : '',
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
  checkEmail = () => {
    const { inputValue, EmailInputValue, NameInputValue, OtherInputValue, Email, Name, Other } =
      this.state;

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
  onSignIn = async () => {
    window.logEvent.addPageEvent({
      name: 'GalleryFavoritePopup_Click_Signin',
    });

    const { data } = this.props;
    const onOk = data.get('onOk');
    const { inputValue, EmailInputValue, NameInputValue, OtherInputValue, Email } = this.state;

    const isLegal = this.checkEmail();

    const isEmptyStr = SPACE_REG.test(inputValue);

    if (isLegal && !isEmptyStr) {
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
      try {
        this.setState({
          signLoading: true,
        });
        await onOk(inputValue, params);
      } catch (e) {
        console.error(e);
      }
      this.setState({
        signLoading: false,
      });
    }
  };

  render() {
    const { data, collectionSetting } = this.props;
    const {
      inputValue,
      isShowSuffix,
      isShowTip,
      tipContent,
      EmailInputValue,
      NameInputValue,
      OtherInputValue,
      EmailTipContent,
      isShowEmailTip,
      NameTipContent,
      isShowNameTip,
      OtherTipContent,
      isShowOtherTip,
      signLoading,
    } = this.state;
    const title = data.get('title') || t('ESTORE_SIGN_IN_TITLE');
    const message =
      data.get('message') ||
      t(`使用在线商店前，请先完成登录，以下信息将用于摄影师记录您的订单和排版作品`);
    const close = data.get('close');
    const wrapClass = classNames('bind-estore-email-modal-cn', data.get('className'));
    const login_information_config =
      collectionSetting && collectionSetting.get('login_information_config');
    const setting_details =
      login_information_config && login_information_config.get('setting_details');
    const Email = setting_details.find(item => item.get('information_id') === 2).toJS();
    const Name = setting_details.find(item => item.get('information_id') === 3).toJS();
    const Other = setting_details.find(item => item.get('information_id') === 4).toJS();
    const inputProps = {
      className: 'create',
      value: inputValue,
      placeholder: t('您的手机号（必填）'),
      onChange: this.onInputChange,
      hasSuffix: true,
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
      suffixIcon: (
        <XIcon type="input-clear" iconWidth={12} iconHeight={12} onClick={this.onInputClear} />
      ),
    };

    return (
      <XModal className={wrapClass} opened onClosed={close} escapeClose={false} isHideIcon={false}>
        <div className="modal-title">{title}</div>
        <div className="modal-body">
          <div className="email-wrap">
            <div className="msg">{message}</div>
            <div className="input-with-clear">
              <XInput {...inputProps} />
            </div>
            {!!Email.is_choose && (
              <div className="input-with-clear">
                <XInput {...EmailInputProps} />
              </div>
            )}
            {!!Name.is_choose && (
              <div className="input-with-clear">
                <XInput {...NameInputProps} />
              </div>
            )}
            {!!Other.is_choose && (
              <div className="input-with-clear">
                <XInput {...OtherInputProps} />
              </div>
            )}
          </div>
        </div>
        <div className="modal-footer clearfix">
          <XButton
            className="pwa-btn"
            onClicked={this.onSignIn}
            isWithLoading={true}
            isShowLoading={signLoading}
          >
            {t('SIGN_IN')}
          </XButton>
        </div>
      </XModal>
    );
  }
}

XEstoreSignInModalCN.propTypes = {
  data: PropTypes.object.isRequired,
};

XEstoreSignInModalCN.defaultProps = {};

export default XEstoreSignInModalCN;
