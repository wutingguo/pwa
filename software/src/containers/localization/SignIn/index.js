import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { template } from 'lodash';
import qs from 'qs';
import XPureComponent from '@resource/components/XPureComponent';
import XAuthorizedRoute from '@resource/components/pwa/XAuthorizedRoute';

import classNames from 'classnames';
import * as xhr from '@resource/lib/utils/xhr';
import XLoading from '@resource/components/XLoading';
import ThirdPartyLoginButton from '@resource/components/ThirdPartyLoginButton';
import { toDecode, toEncode } from '@resource/lib/utils/encode';
import { saasProducts } from '@resource/lib/constants/strings';

import {
  emailReg
} from '@resource/lib/constants/reg';

import {
  EMAIL_LOGIN
} from '@resource/lib/constants/apiUrl';
import { relativeUrl } from '@resource/lib/utils/language';
import { passwordSignIn, checkPhoneExist, sendSecurityCode, codeSignIn } from '@resource/pwa/services/user';
import arrIcon from './images/arr.png';
import weixin from './images/weixin.png';

import './index.scss';

export default class SignIn extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      phoneNumber: '',
      code: '',
      password: '',
      username: '',
      isShowPhoneWarn: false,
      isShowCodeWarn: false,
      isShowPasswordWarn: false,
      isShowUsernameWarn: false,
      enabledCodeButton: false,
      enabledSignInButton: false,
      codeText: '获取验证码',
      warnText: '',
      warnText2: '',
      confirmModalProps: null,
      isLoading: false
    };

    this.getNavRender = this.getNavRender.bind(this);
    this.sendCodeRequest = this.sendCodeRequest.bind(this);
    this.handleRedirect = this.handleRedirect.bind(this);
    this.onLoginSuccess = this.onLoginSuccess.bind(this);
    this.showConfirmModal = this.showConfirmModal.bind(this);
  }


  componentDidMount() {
    window.logEvent.addPageEvent({
      name: 'GallerySubscription'
    });
  }

  getNextUrl() {
    const { url } = qs.parse(window.location.search.substr(1));
    return url ? toDecode(url) : '';
  }

  handleRedirect() {
    const nextUrl = this.getNextUrl();
    if (nextUrl) {
      window.location.href = this.getNextUrl();
      return;
    }
    const isControlPagePrev = isControlPage();
    if (isControlPagePrev) {
      window.location.href = '/index.html';
      return;
    }
    if (window.history && window.history.length > 1) {
      window.history.back();
      return ;
    }
    window.location.href = '/my-projects.html';
  }

  getNavRender() {
    const html = [];
    const navList = [{ index: 0, label: t('FAST_LOGIN') }, { index: 1, label: t('PASSWORD_LOGIN') }];
    navList.forEach((item, index) => {
      const className = classNames({ selected: this.state.index === index });
      html.push(
        <span className={className} onClick={this.changeIndex.bind(this, index)}>
					{item.label}
				</span>
      );
    });
    return html;
  }

  changeIndex(index) {
    this.setState({
      index: index
    });
  }

  handlePhoneChange(e) {
    const num = e.target.value.replace(/[^0-9]/g, '');
    if (/^1\d{10}$/.test(num)) {
      this.setState({ phoneNumber: num, enabledCodeButton: true });
    } else {
      this.setState({ phoneNumber: num, enabledCodeButton: false });
    }
  }

  handleCodeChange(e) {
    this.setState({ code: e.target.value });
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  handleUsernameChange(e) {
    this.setState({ username: e.target.value });
  }

  onLoginSuccess() {

    window.logEvent.addPageEvent({
      name: 'GalleryRegSuccess'
    });

    const { history, location, boundGlobalActions } = this.props;
    boundGlobalActions.getMySubscription();
    boundGlobalActions.getProductPlanList(saasProducts.gallery);
    boundGlobalActions.getProductPlanList(saasProducts.slideshow);
    boundGlobalActions.getProductPlanList(saasProducts.designer);

    const obj = qs.parse(location.search.substr(1));

        // 跳回到sign up之前的页面.
    if (obj.url) {
      history.replace(obj.url);
    } else {
      // 跳回到默认的页面.
      history.replace('/software/gallery/collection');
    }

    // if(!__DEVELOPMENT__){
      window.location.reload();
    // }
  }

  sendCodeRequest() {
    const { urls } = this.props;
    if (this.state.enabledCodeButton && this.state.codeText === '获取验证码') {
      sendSecurityCode(this.state.phoneNumber, 6, urls.get('baseUrl'))
        .then((result) => {
          this.setState({ codeText: '已发送(120)s', enabledCodeButton: false });
          this.setState({ isShowPasswordWarn: false, warnText: '' });
          const that = this;
          let num = 119;
          const aa = setInterval(function () {
            if (num === -1) {
              window.clearInterval(aa);
              if (that.state.phoneNumber.length === 11) {
                that.setState({ codeText: '获取验证码', enabledCodeButton: true });
              } else {
                that.setState({ codeText: '获取验证码' });
              }
            } else {
              that.setState({ codeText: '已发送(' + num-- + ')s' });
            }
          }, 1000);
        })
        .catch((result) => {
          this.setState({ isShowPasswordWarn: true, warnText: result.respMsg });
        });
    }
  }

  showConfirmModal() {
    const { boundGlobalActions, urls } = this.props;
    const baseUrl = urls.get('baseUrl');
    const modalData = {
      title: t('WARN_TIP_NOT_MAKER_PLAN'),
      close: boundGlobalActions.hideConfirm,
      buttons: [
        {
          className: 'white pwa-btn',
          text: t('CANCEL'),
          onClick: () => {
            boundGlobalActions.hideConfirm()
          }
        },
        {
          text: t('GO_CERTIFICATE'),
          onClick: () => {
            window.location.href = `${baseUrl}maker-plan.html`;
          }
        }
      ]
    };
    return boundGlobalActions.showConfirm(modalData);
  }

  sendSignPhoneRequest() {
    window.logEvent.addPageEvent({
      name: 'GallerySubscription_Click_LogIn'
    });
    const { urls } = this.props;
    this.setState({ isLoading: true });
    if (this.state.phoneNumber.length === 11 && this.state.code !== '') {
      checkPhoneExist(this.state.phoneNumber, urls.get('baseUrl'))
        .then((result) => {
          this.setState({ isLoading: false });
          if (result.respCode === '0') {
            if (result.certificationStatus === 4 || result.certificationStatus === 5) {
              this.showConfirmModal();
            } else {
              codeSignIn(this.state.phoneNumber, this.state.code, urls.get('baseUrl'))
                .then((result) => {
                  this.onLoginSuccess();
                })
                .catch((result) => {
                  this.setState({ isShowCodeWarn: true, warnText: result.respMsg });
                });
            }
          } else if (result.respCode === '2') {
            this.showConfirmModal();
          }
        })
        .catch((result) => {
          this.setState({ isShowCodeWarn: true, warnText: result.respMsg, isLoading: false });
        });
    }
  }
  sendSignUsernameRequest() {
    window.logEvent.addPageEvent({
      name: 'GallerySubscription_Click_LogIn'
    });
    const { urls } = this.props;
    this.setState({ isLoading: true });
    if (this.state.username !== '' && this.state.password.length > 3) {
      passwordSignIn(this.state.username, this.state.password, urls.get('baseUrl'))
        .then((result) => {
          this.setState({ isLoading: false });
          this.onLoginSuccess();
        })
        .catch((result) => {
          this.setState({ isShowPasswordWarn: true, warnText2: result.respMsg, isLoading: false });
        });
    }
  }
  enterSendSignPhoneRequest(e) {
    window.logEvent.addPageEvent({
      name: 'GallerySubscription_Click_LogIn'
    });
    const { urls } = this.props;
    if (e.keyCode === 13 && this.state.phoneNumber.length === 11 && this.state.code !== '') {
      this.setState({
        isLoading: true
      });
      checkPhoneExist(this.state.phoneNumber, urls.get('baseUrl'))
        .then((result) => {
          this.setState({
            isLoading: false
          });
          if (result.respCode === '0') {
            if (result.certificationStatus === 4 || result.certificationStatus === 5) {
              this.showConfirmModal();
            } else {
              codeSignIn(this.state.phoneNumber, this.state.code, urls.get('baseUrl'))
                .then((result) => {
                  this.onLoginSuccess();
                })
                .catch((result) => {
                  this.setState({ isShowCodeWarn: true, warnText: result.respMsg });
                });
            }
          } else if (result.respCode === '2') {
            this.showConfirmModal();
          }
        })
        .catch((result) => {
          this.setState({ isShowCodeWarn: true, warnText: result.respMsg, isLoading: false });
        });
    }
  }
  enterSendSignUsernameRequest(e) {
    const { urls } = this.props;
    if (e.keyCode === 13 && this.state.username !== '' && this.state.password.length > 3) {
      window.logEvent.addPageEvent({
        name: 'GallerySubscription_Click_LogIn'
      });
      this.setState({
        isLoading: true
      });
      passwordSignIn(this.state.username, this.state.password, urls.get('baseUrl'))
        .then((result) => {
          this.setState({
            isLoading: true
          });
          this.onLoginSuccess();
        })
        .catch((result) => {
          this.setState({ isShowPasswordWarn: true, warnText2: result.respMsg, isLoading: false });
        });
    }
  }

  render() {
    const { urls } = this.props;
    const {
      codeText,
      index,
      phoneNumber,
      code,
      username,
      password,
      isShowCodeWarn,
      isShowPasswordWarn,
      isShowPhoneWarn,
      isShowUsernameWarn,
      enabledCodeButton,
      enabledSignInButton,
      confirmModalProps,
      isLoading
    } = this.state;

    const codeButtonClassName = classNames('get-code-button', {
      enabled: enabledCodeButton && codeText === '获取验证码'
    });
    const signUpButtonClassName = classNames('sign-in-button', {
      enabled: phoneNumber.length === 11 && code !== ''
    });
    const signUpButtonClassName2 = classNames('sign-in-button2', {
      enabled: username !== '' && password.length > 3
    });
    const signUpPath = `${urls.get('baseUrl')}maker-plan.html`;
    return (
      <div className="sign-in-form-container-cn">
        <div className="container">
          <div className="nav">{this.getNavRender()}</div>
          {index === 0 ? (
            <div>
              <div className="phone-container">
                <input
                  key="phone-input"
                  className="phone-input"
                  type="text"
                  maxLength="11"
                  placeholder={t('PLACEHOLDER_PLEASE_INPUT_PHONE')}
                  value={phoneNumber}
                  onChange={(e) => this.handlePhoneChange(e)}
                  autoFocus
                />
                {isShowPhoneWarn ? <div className="warn-text">{t('WARN_TIP_PHONE_VERIFY_FAILED')}</div> : null}
              </div>

              <div className="code-container">
                <input
                  key="code-input"
                  className="code-input"
                  type="text"
                  placeholder={t('PLACEHOLDER_PLEASE_INPUT_CODE')}
                  value={code}
                  onChange={(e) => this.handleCodeChange(e)}
                  onKeyUp={(e) => this.enterSendSignPhoneRequest(e)}
                />
                <span className={codeButtonClassName} onClick={this.sendCodeRequest.bind(this)}>
										{codeText}
									</span>
                {isShowCodeWarn ? <div className="warn-text">{this.state.warnText}</div> : null}
              </div>
              <div className={signUpButtonClassName} onClick={() => this.sendSignPhoneRequest()}>
                登录
              </div>
            </div>
          ) : (
            <div>
              <div className="user-container">
                <input
                  key="user-input"
                  className="user-input"
                  type="text"
                  placeholder={t('PLACEHOLDER_PLEASE_INPUT_PHONE_AND_EMAIL')}
                  value={username}
                  onChange={(e) => this.handleUsernameChange(e)}
                  autoFocus
                />
                {isShowUsernameWarn ? <div className="warn-text">{t('WARN_TIP_PHONE_AND_EMAIL_VERIFY_FAILED_')}</div> : null}
              </div>

              <div className="password-container">
                <input
                  key="password-input"
                  className="password-input"
                  autoComplete="new-password"
                  type="password"
                  placeholder={t('PLACEHOLDER_PLEASE_INPUT_PASSWORD')}
                  value={password}
                  onChange={(e) => this.handlePasswordChange(e)}
                  onKeyUp={(e) => this.enterSendSignUsernameRequest(e)}
                />
                {isShowPasswordWarn ? (
                  <div className="warn-text">{this.state.warnText2}</div>
                ) : null}
              </div>
              <div className={signUpButtonClassName2} onClick={() => this.sendSignUsernameRequest()}>
                登录
              </div>
              {/*<div className="weixin-text">使用其他方法登录</div>*/}
              {/*<div*/}
              {/*  className="forget-password-button"*/}
              {/*  onClick={() => { self.location.href = changePasswordPath }}*/}
              {/*>*/}
              {/*  忘记密码？*/}
              {/*</div>*/}
            </div>
          )}

          <div className="sign-up-container">
							<span
                className="sign-up-button"
                onClick={() => {
                  self.location.href = signUpPath;
                }}
              >
                {t('REGISTER_MAKER_PLAN')}
							</span>
            <img src={arrIcon} onClick={() => {
              self.location.href = signUpPath;
            }} />
          </div>
        </div>
        <XLoading
          isShown={isLoading}
          backgroundColor="rgba(255,255,255,0.6)"
        />
      </div>
    );
  }

}

