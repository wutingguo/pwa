import React from 'react';
import { Link } from 'react-router-dom';
import qs from 'qs';
import classNames from 'classnames';
import { template } from 'lodash';
import XPureComponent from '@resource/components/XPureComponent';
import ThirdPartyLoginButton from '@resource/components/ThirdPartyLoginButton';
import XLoading from '@resource/components/XLoading';

import * as xhr from '@resource/lib/utils/xhr';
import {
  GET_CAPTCHA_CODE,
  EMAIL_REGISTER,
  CHECK_CAPTCHA_CODE,
  GET_CAPTCHA_CODE_CONDITION
} from '@resource/lib/constants/apiUrl';
import {
  emailReg,
  invalidPasswordReg,
  emailNotSupportedReg
} from '@resource/lib/constants/reg';
import {
  defaultCurrencyInfo,
  getCurrencyInfoFromCookie,
  saveCurrencyInfoToCookie
} from '@resource/lib/utils/currency';

import refreshIcon from './refresh.svg';
import './index.scss';

export default class  SignUp extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fullName: '',
      email: '',
      password: '',
      fullNameTip: '',
      emailTip: '',
      currencyInfo: defaultCurrencyInfo,
      passwordTip: '',
      verificationCode: '',
      verificationCodeTip: '',
      needVerificationCode: false,
      verificationCodeChecked: false,
      captchaImageRandom: Date.now(),
      isLoading: false
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.checkEmail = this.checkEmail.bind(this);
    this.onLoginSuccess = this.onLoginSuccess.bind(this);
    this.openTermsWindow = this.openTermsWindow.bind(this);
    this.goToBindingEmail = this.goToBindingEmail.bind(this);
    this.onFullNameChange = this.onInputChange.bind(this, 'fullName');
    this.onEmailChange = this.onInputChange.bind(this, 'email');
    this.onPasswordChange = this.onInputChange.bind(this, 'password');
    this.onVerificationCodeChange = this.onInputChange.bind(this, 'verificationCode');
    this.refreshCaptchaImage = this.refreshCaptchaImage.bind(this);
    this.checkFullName = this.checkFullName.bind(this);
    this.checkPassword = this.checkPassword.bind(this);
    this.getVerifyCodeCondition = this.getVerifyCodeCondition.bind(this);
    this.checkVerificationCode = this.checkVerificationCode.bind(this);
    this.checkVerificationCodeOnline = this.checkVerificationCodeOnline.bind(this);
  }

  onInputChange(key, event) {
    const { value } = event.target;
    this.setState({
      [key]: value,
      [`${key}Tip`]: ''
    });
  }
  
  refreshCaptchaImage() {
    this.setState({
      captchaImageRandom: Date.now()
    })
  }

  checkFullName() {
    const { fullName } = this.state;
    if (!fullName) {
      const emptyFullNameTip = t('FULLNAME_REQUIRE_TIP');
      this.setState({
        fullNameTip: emptyFullNameTip
      });
      return emptyFullNameTip;
    }
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
  checkPassword() {
    const { password } = this.state;
    if (!password) {
      const passwordTip = t('PASSWORD_REQUIRE_TIP');
      this.setState({ passwordTip });
      return passwordTip;
    }
    if (password.length < 4) {
      const passwordTip = t('PASSWORD_LENGTH_TIP');
      this.setState({ passwordTip });
      return passwordTip;
    }
    if (invalidPasswordReg.test(password)) {
      const passwordTip = t('PASSWORD_INVALID_TIP');
      this.setState({ passwordTip });
      return passwordTip;
    }
  }

  checkVerificationCode() {
    const { verificationCode } = this.state;
    if (!verificationCode) {
      const verificationCodeTip = t('VERIFICATION_CODE_REQUIRE_TIP');
      this.setState({ verificationCodeTip });
      return Promise.resolve(false);
    }
    if (verificationCode.length < 4) {
      const verificationCodeTip = t('VERIFICATION_CODE_LENGTH_TIP');
      this.setState({ verificationCodeTip });
      return Promise.resolve(false);
    }
    return this.checkVerificationCodeOnline();
  }

  checkVerificationCodeOnline() {
    const { urls } = this.props;
    const { verificationCode } = this.state;
    // 接口校验验证码
    return new Promise((resolve, reject) => {
      xhr.get(template(CHECK_CAPTCHA_CODE)({
        'captcha_code': verificationCode,
        baseUrl: urls.get('baseUrl')
      }))
        .then(result => {
          const { data, ret_code } = result;
          if (ret_code === 200000) {
            this.setState({
              verificationCodeChecked: true,
              verificationCodeTip: data ? "" : t('PLEASE_TRY_AGAIN')
            });
            resolve(true);
          } else {
            this.setState({
              verificationCodeChecked: false,
              verificationCodeTip: t('PLEASE_TRY_AGAIN')
            });
            resolve(false);
          }
        });
    });
  }

  async onSubmit(e) {
    e.preventDefault();
    const { urls } = this.props;
    const {
      fullName,
      email,
      password,
      currencyInfo,
      verificationCode,
      verificationCodeChecked,
      fullNameTip,
      emailTip,
      passwordTip,
      verificationCodeTip,
      needVerificationCode
    } = this.state;

    if (
      fullNameTip ||
      emailTip ||
      passwordTip ||
      verificationCodeTip
    ) return;
    
    const { countryCode } = currencyInfo;

    if (
      !fullName ||
      !email ||
      !password ||
      !countryCode
    ) {
      this.checkFullName();
      this.checkEmail();
      this.checkPassword();
      return;
    }

    if (needVerificationCode) {
      const checkResult = await this.checkVerificationCode();
      if (!checkResult) return;
    }
    
    const requestData = {
      full_name: fullName,
      email,
      password,
      country_code: countryCode
    };
    if (needVerificationCode) {
      requestData.captcha_code = verificationCode;
    }
    this.setState({ isLoading: true });
    const registerPath = template(EMAIL_REGISTER)({
      baseUrl: urls.get('baseUrl')
    });
    xhr.post(registerPath, requestData)
      .then(result => {
        const { ret_code, data } = result;
        this.setState({ isLoading: false });
        if (ret_code === 200000) {
          const { token } = data;
          window.localStorage.setItem('auth_token', token);
          this.onLoginSuccess();
        } else if(ret_code === 409101) {
          this.setState({
            emailTip: t("EMAIL_EXIST_TIP")
          });
        } else if(ret_code === 400101) {
          this.setState({
            emailTip: t("SIGN_UP_ERROR_EMAIL_NOT_SUPPORTED")
          });
        } else if(ret_code === 400103) {
          this.setState({
            fullNameTip: t("FULLNAME_INVALID_TIP")
          });
        }
      })
      .catch(() => {
        this.setState({ isLoading: false });
      })
    }
    
  onLoginSuccess() {
    const { history, boundGlobalActions } = this.props;

    boundGlobalActions.getUserInfo().then(() => {
      history.replace('/success?registered=true');
    }, err => {
      console.log('err', err);
      
      boundGlobalActions.addNotification({
        message: t('CODE_ERROR_MESSAGE_500000'),
        level: 'error',
        autoDismiss: 3
      });
    });
  }

  goToBindingEmail(userInfo) {
    const { history } = this.props;
    const {
      thirdPartyType,
      id,
      email = "",
      fullName,
      accessToken
    } = userInfo;
    const bindEmailParams = {
      firstName: fullName.split(' ')[0],
      lastName: fullName.split(' ')[1],
      fullName,
      email: '',
      thirdPartyEmail: email,
      thirdPartyToken: accessToken,
      thirdPartyUid: id,
      thirdPartyType,
      emailExist: false,
    };
    const path = {
      pathname: '/third-party-link',
      params: bindEmailParams
    }
    history.push(path);
  }

  openTermsWindow() {
    const { urls } = this.props;
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const openWindowWidth = screenWidth >= 1200 ? 1100 : screenWidth - 100;
    const openWindowHeight = screenHeight >= 665 ? 565 : screenHeight - 100;
    const openWindowLeft = Math.floor((screenWidth - openWindowWidth) / 2);
    const openWindowTop = Math.floor((screenHeight - 50 - openWindowHeight) / 2);
    const styleString = `width=${openWindowWidth},height=${openWindowHeight},toolbar=no,left=${openWindowLeft},top=${openWindowTop},menubar=no`;
    window.open(
      `${urls.get('baseUrl')}terms.html`,
      '__parent',
      styleString
    );
  }

  getVerifyCodeCondition() {
    // 判断是够需要验证码
    const { urls } = this.props;
    const { showVC } = qs.parse(location.search.substr(1));
    xhr.get(template(GET_CAPTCHA_CODE_CONDITION)({
      autoRandomNum: Date.now(),
      baseUrl: urls.get('baseUrl')
    }))
      .then(result => {
        const { data, ret_code } = result;
        if (ret_code === 200000) {
          this.setState({
            needVerificationCode: data || !!showVC
          });
        }
      });
  }

  componentDidMount() {
    this.getVerifyCodeCondition();
  }

  render() {
    const { urls } = this.props;
    const {
      fullName,
      email,
      password,
      fullNameTip,
      emailTip,
      passwordTip,
      verificationCode,
      verificationCodeTip,
      needVerificationCode,
      captchaImageRandom,
      isLoading
    } = this.state;
    const fullNameInputClassName = classNames("text-field", {
      "warning-border": fullNameTip
    });
    const emailInputClassName = classNames("text-field", {
      "warning-border": emailTip
    });
    const passwordInputClassName = classNames("text-field", {
      "warning-border": passwordTip
    });
    const baseUrl = urls.get('baseUrl');
    const verificationCodeSrc = template(GET_CAPTCHA_CODE)({
      baseUrl,
      autoRandomNum: captchaImageRandom
    })

    return (
      <div className="sign-up-form-container">
        <form
          className="sign-up-form"
          onSubmit={this.onSubmit}
          autoComplete="off"
        >
          {/* <ThirdPartyLoginButton
            text={t('SIGN_UP_WITH_FACEBOOK')}
            thirdParyName="facebook"
            thirdPartyType={101}
            baseUrl={baseUrl}
            onLoginStart={() => this.setState({isLoading: true})}
            onLoginEnd={() => this.setState({isLoading: false})}
            onLoginSuccess={this.onLoginSuccess }
            goToBindingEmail= {this.goToBindingEmail}
          /> */}

          <ThirdPartyLoginButton
            text={t('SIGN_UP_WITH_INSTAGRAM')}
            thirdParyName="instagram"
            thirdPartyType={102}
            baseUrl={baseUrl}
            onLoginStart={() => this.setState({isLoading: true})}
            onLoginEnd={() => this.setState({isLoading: false})}
            onLoginSuccess={this.onLoginSuccess }
            goToBindingEmail= {this.goToBindingEmail}
          />

          <p className="thirdpart-signup-tip">{t('THIRD_PARTY_SIGNUP_TIP')}</p>

          <div className="split-line">{t('OR')}</div>

          <div className="text-field-container first">
            <input
              className={fullNameInputClassName}
              type="text"
              placeholder={t('FULL_NAME')}
              value={fullName}
              maxLength="99"
              onBlur={this.checkFullName}
              onChange={this.onFullNameChange}
            />
            {fullNameTip && <div className="warning-text">{fullNameTip}</div>}
          </div>
          <div className="text-field-container">
            <input
              className={emailInputClassName}
              type="text"
              id="j_username"
              name="j_username"
              placeholder={t('EMAIL')}
              value={email}
              maxLength="63"
              onBlur={this.checkEmail}
              onChange={this.onEmailChange}
            />
            {emailTip && <div className="warning-text">{emailTip}</div>}
          </div>
          <div className="text-field-container">
            <input
              className={passwordInputClassName}
              type="password"
              id="j_password"
              name="j_password"
              placeholder={t('PASSWORD')}
              autoComplete="off"
              value={password}
              onBlur={this.checkPassword}
              onChange={this.onPasswordChange}
            />
            {passwordTip && <div className="warning-text">{passwordTip}</div>}
          </div>
          {needVerificationCode && (
            <div className="text-field-container">
              <input
                className="text-field verify-code-input"
                type="text"
                placeholder={t('VERIFICATION_CODE')}
                autoComplete="off"
                maxLength="4"
                value={verificationCode}
                onBlur={this.checkVerificationCode}
                onChange={this.onVerificationCodeChange}
              />
              <img
                className="captcha-image"
                src={verificationCodeSrc}
                onClick={this.refreshCaptchaImage}
              />
              <img
                className="refresh-image"
                src={refreshIcon}
                onClick={this.refreshCaptchaImage}
              />
              {verificationCodeTip && <div className="warning-text">{verificationCodeTip}</div>}
            </div>
          )}
          
          <p className="signup-tip">
            <span>{t('SIGN_UP_AGREE_TIP')}</span>
            <span
              className="terms-link"
              onClick={this.openTermsWindow}
            > {t('TERMS_OF_USE')}</span>
          </p>

          <button className="sign-up-button" type="submit">
            {t('FORM_SIGN_UP')}
          </button>

          <div className="switch-to-signin">
            <span>{t('ALREADY_A_USER')} </span>
            <span><Link to="/sign-in">{t('FORM_SIGN_IN_ARROW')}</Link></span>
          </div>
        </form>
        <XLoading
          isShown={isLoading}
          backgroundColor="rgba(255,255,255,0.6)"
        />
      </div>
    );
  }
}