import React, { Component } from 'react';
import { template } from 'lodash';
import classNames from 'classnames';
import XPureComponent from '@resource/components/XPureComponent';

import {
  emailReg,
  emailNotSupportedReg
} from '@resource/lib/constants/reg';
import {
  RESET_PASSWORD
} from '@resource/lib/constants/apiUrl';
import * as xhr from '@resource/lib/utils/xhr';
import { getQs } from '@resource/logevent/util/qs';

import "./index.scss";

export default class ForgottenPassword extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      emailTip: '',
      sentSuccessed: false
    }
    
      this.onSubmit = this.onSubmit.bind(this);
      this.checkEmail = this.checkEmail.bind(this);
      this.onEmailChange = this.onInputChange.bind(this, 'email');
      this.onResetSuccessContinue = this.onResetSuccessContinue.bind(this);
  }

  onInputChange(key, event) {
    const { value } = event.target;

    this.setState({
      [key]: value,
      [`${key}Tip`]: ''
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
    if (emailNotSupportedReg.test(email)) {
      const emailTip = t('SIGN_UP_ERROR_EMAIL_NOT_SUPPORTED');
      this.setState({ emailTip: emailTip });
      return emailTip;
    }
  }

  onSubmit(e) {
    window.logEvent.addPageEvent({
      name: 'GalleryForgotPassword_Click_Submit'
    });

    e.preventDefault();
    const {
      urls
    } = this.props;
    const {
      email,
      emailTip,
    } = this.state;
    
    if (emailTip) return;

    if (!email) {
      this.checkEmail();
    }

    const thirdParty = getQs('thirdParty');

    const requestData = { email, thirdParty };
    const requestPath = template(RESET_PASSWORD)({
      baseUrl: urls.get('baseUrl')
    });
    xhr.post(requestPath, requestData)
      .then(result => {
        const { ret_code } = result;
        if (ret_code === 200000) {
          this.setState({
            sentSuccessed: true
          });
        } else if (ret_code === 404000) {
          this.setState({
            emailTip: t("RESET_PASSWORD_NOT_FOUND")
          });
        }else if (ret_code === 500000) {
          this.setState({
            emailTip: t("CODE_ERROR_MESSAGE_500000")
          });
        }
      })
  }

  onResetSuccessContinue(e) {
    e.preventDefault();
    
    location.href = '/software/projects';
    return false;
  }

  render() { 
    const {
      email,
      emailTip,
      sentSuccessed
    }= this.state;

    const emailInputClassName = classNames("text-field", {
      "warning-border": emailTip
    });

    return (
      <div className="reset-password-form-container">
        <form
          className="reset-password-form"
          onSubmit={this.onSubmit}
        >
          {!sentSuccessed ? (
            <div>
              <div
                className="reset-password-title-wrap"
              >
                <p className="reset-password-title">{t('RESET_PASSWORD_TITLE')}</p>
                <p className="reset-password-tip">{t('RESET_PASSWORD_TIP')}</p>         
              </div>

              <div className="text-field-container first">
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

              <button className="confirm-button" type="submit">
                {t('SUBMIT')}
              </button>
            </div>
          ) : (
            <div>
              <div
                className="reset-password-succeed-wrap"
              >
                <p className="reset-password-succeed-tip">{t('RESET_PASSWORD_SUCCEED_TIP')}</p>         
              </div>

              <button className="confirm-button mt400" onClick={this.onResetSuccessContinue}>
                {t('CONTINUE')}
              </button>
            </div>
          )}
        </form>
      </div>
    );
  }
}