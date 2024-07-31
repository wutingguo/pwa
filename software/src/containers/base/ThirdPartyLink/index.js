import React, { Component } from 'react';
import qs from 'qs';
import { template } from 'lodash';
import classNames from 'classnames';
import XPureComponent from '@resource/components/XPureComponent';
import XLoading from '@resource/components/XLoading';

import * as xhr from '@resource/lib/utils/xhr';
import {
  THIRD_PARTY_BIND,
  CHECK_EMAIL_EXIST
} from '@resource/lib/constants/apiUrl';
import {
  emailReg,
  emailNotSupportedReg
} from '@resource/lib/constants/reg';
import {
  defaultCurrencyInfo
} from '@resource/lib/utils/currency';

import './index.scss';

class ThirdPartyLink extends XPureComponent {
  constructor(props) {
    super(props);
    const { 
      location: {
        params = {}
      },
      history
    } = props;
    const {
      fullName = '',
      thirdPartyEmail = '',
      thirdPartyToken = '',
      thirdPartyUid = '',
      thirdPartyType = ''
    } = params;
    if (!thirdPartyUid) {
      history.goBack();
    }
    this.state = {
      email: '',
      fullName,
      thirdPartyEmail,
      thirdPartyToken,
      thirdPartyUid,
      thirdPartyType,
      currencyInfo: defaultCurrencyInfo,
      emailExist: false,
      readOnly: false,
      isLoading: false
    }
    this.onSubmit = this.onSubmit.bind(this);
    this.checkEmail = this.checkEmail.bind(this);
    this.onLoginSuccess = this.onLoginSuccess.bind(this);
    this.checkThirdPartyEmailExist = this.checkThirdPartyEmailExist.bind(this);
    this.onEmailChange = this.onInputChange.bind(this, 'email');
  }

  onInputChange(key, event) {
    const { value } = event.target;

    this.setState({
      [key]: value,
      [`${key}Tip`]: ''
    });
  }

  checkThirdPartyEmailExist() {
    const { urls } = this.props;
    const { thirdPartyEmail } = this.state;
    if (!thirdPartyEmail) return;
    xhr.get(
      template(CHECK_EMAIL_EXIST)({
        baseUrl: urls.get('baseUrl'),
        email: thirdPartyEmail,
        autoRandomNum: Date.now()
      })
    )
      .then(result => {
        const { ret_code, data } = result;
        if (ret_code === 200000) {
          if (data) {
            this.setState({emailExist: true });
          } else {
            this.setState({email: thirdPartyEmail, readOnly: true});
          }
        }
      })
  }

  checkEmail() {
    const { email } = this.state;
    if (!email) {
      const emailTip = t('EMAIL_REQUIRE_TIP');
      this.setState({ emailTip });
      return emailTip;
    }
    if (!emailReg.test(email)) {
      const emailTip = t('EMAIL_INVALID_TIP');
      this.setState({ emailTip: emailTip });
      return emailTip;
    }
    if (emailNotSupportedReg.test(email)) {
      const emailTip = t('SIGN_UP_ERROR_EMAIL_NOT_SUPPORTED');
      this.setState({ emailTip: emailTip });
      return emailTip;
    }
  }

  onSubmit(e) {
    e.preventDefault();
    const { urls } = this.props;
    const {
      email,
      emailTip,
      currencyInfo
    } = this.state;
    
    if (emailTip) return;
    const { countryCode } = currencyInfo;

    if (!email || !countryCode) {
      this.checkEmail();
    }
    
    const {
      fullName,
      thirdPartyUid,
      thirdPartyType,
      thirdPartyToken,
      thirdPartyEmail
    } = this.state;

    const requestData = {
      channel: Number(thirdPartyType),
      third_party_uid: thirdPartyUid,
      email,
      third_party_email: thirdPartyEmail,
      third_party_token: thirdPartyToken,
      full_name: fullName,
      country_code: countryCode
    };
    const requestPath = template(THIRD_PARTY_BIND)({
      baseUrl: urls.get('baseUrl')
    });
    this.setState({ isLoading: true });
    xhr.post(requestPath, requestData)
      .then(result => {
        const { ret_code, data } = result;
        this.setState({ isLoading: false });
        if (ret_code === 200000) {
          const { token } = data;
          window.localStorage.setItem('auth_token', token);
          this.onLoginSuccess();
        } else if(ret_code === 429103) {
          // 该邮箱已经绑定其他账号
          this.setState({
            emailTip: t("EMAIL_EXIST_IN_ZNO_TIP")
          });
        } else if(ret_code === 400101) {
          this.setState({
            emailTip: t("SIGN_UP_ERROR_EMAIL_NOT_SUPPORTED")
          });
        } else if(ret_code === 409102) {
          // 第三方用户已经绑定其他账号
          this.setState({
            emailTip: t("EMAIL_EXIST_TIP_THIRDPARTY")
          });
        }
      })
      .catch(() => {
        this.setState({ isLoading: false });
      });
  }

  onLoginSuccess() {
    const { history, boundGlobalActions } = this.props;
    boundGlobalActions.subScribleOrder().then(
      res => {
        boundGlobalActions.getUserInfo();
        boundGlobalActions.getMySubscription().then(
          res => {
            history.replace('/register-success');
          },
          err => {
            boundGlobalActions.addNotification({
              message: t('SUBSCRIBLE_FAILED'),
              level: 'error',
              autoDismiss: 2
            });
          }
        );
      },
      err => {
        boundGlobalActions.addNotification({
          message: t('SUBSCRIBLE_FAILED'),
          level: 'error',
          autoDismiss: 2
        });
      }
    );
  }

  componentWillMount() {
    this.checkThirdPartyEmailExist();
  }

  render() {
    const {
      email,
      emailTip,
      isLoading,
      currencyInfo,
      readOnly,
      thirdPartyEmail
    }= this.state;

    const emailInputClassName = classNames("text-field", {
      "warning-border": emailTip
    });

    const inputExtraProps = {};
    if (thirdPartyEmail && readOnly) {
      inputExtraProps.readOnly  = 'readOnly ';
    }

    return (
      <div className="third-party-email-binding-form-container">
        <form
          className="third-party-email-binding-form"
          onSubmit={this.onSubmit}
        >
          <div
            className="binding-email-title-wrap"
          >
            <div className="binding-email-title">{t('JUST_ONE_MORE_STEP')}</div>
            <div className="binding-email-tip">{t('THIRD_PARTY_LINK_TIP')}</div>         
          </div>

          <div className="text-field-container first">
            <input
              className={emailInputClassName}
              type="text"
              placeholder={t('EMAIL')}
              value={email}
              maxLength="63"
              onBlur={this.checkEmail}
              onChange={this.onEmailChange}
              {...inputExtraProps}
            />
            {emailTip && <div className="warning-text">{emailTip}</div>}
          </div>

          <button className="confirm-button" type="submit">
            {t('COMPLETE')}
          </button>
        </form>
        <XLoading
          isShown={isLoading}
          backgroundColor="rgba(255,255,255,0.8)"
        />
      </div>
    );
  }
}
 
export default ThirdPartyLink;