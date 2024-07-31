import classNames from 'classnames';
import { template } from 'lodash';
import qs from 'qs';
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

import ThirdPartyLoginButton from '@resource/components/ThirdPartyLoginButton';
import XButton from '@resource/components/XButton';
import XLoading from '@resource/components/XLoading';
import XPureComponent from '@resource/components/XPureComponent';
import XModal from '@resource/components/modals/XModal';

import XAuthorizedRoute from '@resource/components/pwa/XAuthorizedRoute';

import { toDecode, toEncode } from '@resource/lib/utils/encode';
import { relativeUrl } from '@resource/lib/utils/language';
import * as xhr from '@resource/lib/utils/xhr';

import { EMAIL_LOGIN } from '@resource/lib/constants/apiUrl';
import { emailReg } from '@resource/lib/constants/reg';
import { saasProducts, thirdParyNameTypes } from '@resource/lib/constants/strings';

import './index.scss';

export default class SignIn extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      emailTip: '',
      passwordTip: '',
      commonTip: '',
      isLoading: false,
      showInsOfflineModal: false,
      isShowContent: false,
      thirdParyName: '',
    };

    this.onLoginSuccess = this.onLoginSuccess.bind(this);
    this.goToBindingEmail = this.goToBindingEmail.bind(this);
    this.onEmailChange = this.onInputChange.bind(this, 'email');
    this.onPasswordChange = this.onInputChange.bind(this, 'password');
    this.checkEmail = this.checkEmail.bind(this);
    this.checkPassword = this.checkPassword.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onClickSignUp = this.onClickSignUp.bind(this);
  }

  componentDidMount() {
    window.logEvent.addPageEvent({
      name: 'GallerySubscription',
    });

    // 处理闪动问题.
    setTimeout(() => {
      this.setState({ isShowContent: true });
    }, 1000);
  }

  onInputChange(key, event) {
    const { value } = event.target;
    this.setState({
      [key]: value,
      [`${key}Tip`]: '',
      commonTip: '',
    });
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
  }

  onSubmit(e) {
    window.logEvent.addPageEvent({
      name: 'GallerySubscription_Click_LogIn',
    });

    e.preventDefault();
    const { urls } = this.props;
    const { email, password, emailTip, passwordTip } = this.state;

    if (emailTip || passwordTip) return;

    if (!email || !password) {
      this.checkEmail();
      this.checkPassword();
    }

    const requestData = {
      email,
      password,
    };
    this.setState({ isLoading: true });
    const loginPath = template(EMAIL_LOGIN)({
      baseUrl: urls.get('baseUrl'),
    });
    xhr
      .post(loginPath, requestData)
      .then(result => {
        const { ret_code, data } = result;
        this.setState({ isLoading: false });
        if (ret_code === 200000) {
          const { token } = data;
          // window.localStorage.setItem('auth_token', token);
          this.onLoginSuccess(data);
        } else if (ret_code === 421100) {
          // account suspended
          this.setState({
            commonTip: t('ACCOUNT_SUSPENDED_TIP'),
          });
        } else if (ret_code === 400102 || ret_code === 404000) {
          // 404000 no account
          // 400102 password error
          this.setState({
            commonTip: t('WRONG_EMAIL_OR_ADDRESS'),
          });
        }
      })
      .catch(() => {
        this.setState({ isLoading: false });
      });
  }

  onLoginSuccess() {
    window.logEvent.addPageEvent({
      name: 'GalleryRegSuccess',
    });
    const { history } = this.props;
    const obj = qs.parse(location.search.substr(1));

    let hasProtocol = false;
    // 跳回到sign up之前的页面.
    if (obj.url) {
      if (/^http(s)?:\/\//.test(obj.url)) {
        hasProtocol = true;
        window.location.replace(obj.url);
      } else {
        history.replace(obj.url);
      }
    } else {
      // 跳回到默认的页面.
      history.replace('/software/projects');
    }

    // 涉及到要重新加载的数据很多.
    if (!__DEVELOPMENT__ && !hasProtocol) {
      location.reload();
    }
  }

  toogleInsOfflineModal = thirdParyName => {
    this.setState({
      thirdParyName,
      showInsOfflineModal: !this.state.showInsOfflineModal,
    });
  };

  handleForgotPassword = () => {
    const { history } = this.props;
    const { thirdParyName } = this.state;
    const path = relativeUrl(`/software/forgotten-password?thirdParty=${thirdParyName}`);
    history.push(path);
  };

  onClickSignUp() {
    window.logEvent.addPageEvent({
      name: 'GallerySubscription_Click_SignUp',
    });
  }

  goToBindingEmail(userInfo) {
    const { history } = this.props;
    const { thirdPartyType, id, email = '', fullName, accessToken } = userInfo;

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
      params: bindEmailParams,
    };
    history.push(path);
  }

  render() {
    const { urls } = this.props;
    const {
      email,
      password,
      emailTip,
      passwordTip,
      commonTip,
      isLoading,
      isShowContent,
      showInsOfflineModal,
      thirdParyName,
    } = this.state;
    const emailInputClassName = classNames('text-field', {
      'warning-border': emailTip,
    });
    const passwordInputClassName = classNames('text-field', {
      'warning-border': passwordTip,
    });
    const baseUrl = urls.get('baseUrl');

    // 处理第一次闪动的问题.
    const style = {
      display: isShowContent ? 'block' : 'none',
    };

    return (
      <div className="sign-in-form-container" style={style}>
        <form className="sign-in-form" onSubmit={this.onSubmit} autoComplete="off">
          <ThirdPartyLoginButton
            text={t('LOGIN_WITH_FACEBOOK')}
            thirdParyName="facebook"
            thirdPartyType={101}
            baseUrl={baseUrl}
            deprecated={true}
            deprecatedCallback={this.toogleInsOfflineModal}
            onLoginStart={() => this.setState({ isLoading: true })}
            onLoginEnd={() => this.setState({ isLoading: false })}
            onLoginSuccess={this.onLoginSuccess}
            goToBindingEmail={this.goToBindingEmail}
          />
          <ThirdPartyLoginButton
            text={t('LOGIN_WITH_INSTAGRAM')}
            thirdParyName="instagram"
            thirdPartyType={102}
            baseUrl={baseUrl}
            deprecated={true}
            deprecatedCallback={this.toogleInsOfflineModal}
            onLoginStart={() => this.setState({ isLoading: true })}
            onLoginEnd={() => this.setState({ isLoading: false })}
            onLoginSuccess={this.onLoginSuccess}
            goToBindingEmail={this.goToBindingEmail}
          />

          <div className="split-line">{t('OR')}</div>

          <div className="text-field-container first">
            <input
              className={emailInputClassName}
              type="text"
              id="j_username"
              name="j_username"
              placeholder="Email"
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
              placeholder="Password"
              value={password}
              onBlur={this.checkPassword}
              onChange={this.onPasswordChange}
            />
            {passwordTip && <div className="warning-text">{passwordTip}</div>}
          </div>

          <p className="forget-password">
            <span>
              <Link to="/software/forgotten-password"> {t('FORGOT_PASSWORD')}</Link>
            </span>
          </p>

          <button className="sign-in-button" type="submit">
            {t('FORM_SIGN_IN')}
          </button>
          {commonTip && <p className="common-tip">{commonTip}</p>}

          <div className="switch-to-signup" onClick={this.onClickSignUp}>
            <span>{t('NEW_TO_ZNO')} </span>
            <span>
              <Link to="/software/sign-up">{t('FORM_SIGN_UP_ARROW')}</Link>
            </span>
          </div>
        </form>
        <XLoading isShown={isLoading} backgroundColor="rgba(255,255,255,0.6)" />
        {showInsOfflineModal && (
          <XModal
            opened={true}
            className="ins-login-offline-modal"
            onClosed={this.toogleInsOfflineModal}
          >
            <div className="ins-login-offline-modal-content">
              <div className="modal-content">
                <span className="ins-offline-tips">
                  {t('INSTAGRAM_OFFLINE_MODAL_TIPS1', {
                    thirdParyName: thirdParyNameTypes[thirdParyName],
                  })}
                </span>
                <span className="ins-offline-tips">
                  {t('INSTAGRAM_OFFLINE_MODAL_TIPS2', {
                    thirdParyName: thirdParyNameTypes[thirdParyName],
                  })}
                </span>
              </div>
              <div className="modal-footer">
                <XButton
                  className="black"
                  width={200}
                  height={40}
                  onClicked={this.handleForgotPassword}
                >
                  {t('RESET_PASSWORD_TITLE')}
                </XButton>
              </div>
            </div>
          </XModal>
        )}
      </div>
    );
  }
}
