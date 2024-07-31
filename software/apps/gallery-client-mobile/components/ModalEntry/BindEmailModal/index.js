import classNames from 'classnames';
import { isFunction } from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import XPureComponent from '@resource/components/XPureComponent';

import { SPACE_REG, emailReg, phoneReg } from '@resource/lib/constants/reg';

import { XButton, XIcon, XInput, XModal } from '@common/components';

import './index.scss';

class BindEmailModal extends XPureComponent {
  constructor(props) {
    super(props);

    const { data } = props;

    this.state = {
      inputValue: data.get('collectionName') || '',
      isShowTip: false,
      tipContent: '',
      isShowSuffix: false,
    };
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
      tipContent: !inputValue ? t('YOU_EMAIL_REQUIRED_TIP') : '',
      isShowSuffix: !!inputValue,
    });
  };

  onInputClear = () => {
    this.setState({
      inputValue: '',
      isShowSuffix: false,
      isShowTip: true,
      tipContent: t('YOU_EMAIL_REQUIRED_TIP'),
    });
  };

  onSignIn = () => {
    window.logEvent.addPageEvent({
      name: 'GalleryFavoritePopup_Click_Signin',
    });

    const { data } = this.props;
    const onOk = data.get('onOk');
    const { inputValue } = this.state;

    // cn 判断手机号和邮箱、en判断邮箱
    const isLegal = __isCN__
      ? emailReg.test(inputValue) || phoneReg.test(inputValue)
      : emailReg.test(inputValue);
    const isEmptyStr = SPACE_REG.test(inputValue);
    let tipContent = '';
    let isShowTip = false;
    if (!inputValue || isEmptyStr) {
      isShowTip = true;
      tipContent = t('YOU_EMAIL_REQUIRED_TIP');
    } else if (!isLegal) {
      isShowTip = true;
      tipContent = t('EMAIL_WRONG');
    }
    this.setState({
      isShowTip,
      tipContent,
    });
    if (inputValue && isLegal && !isEmptyStr) {
      const params = {
        [emailReg.test(inputValue) ? 'guest_email' : 'guest_phone']: inputValue,
      };
      onOk(params, inputValue);
    }
  };

  render() {
    const { data } = this.props;
    const { inputValue, isShowTip, isShowSuffix, tipContent } = this.state;

    const title = data.get('title') || t('SIGN_IN');
    const message = data.get('message') || t('FAVORITES_BODY');

    const close = data.get('close');
    const wrapClass = classNames('bind-email-modal-wrap', data.get('className'));

    const inputProps = {
      className: 'create',
      value: inputValue,
      placeholder: t('YOU_EMAIL_PLACEHOLDER'),
      onChange: this.onInputChange,
      hasSuffix: true,
      isShowSuffix,
      isShowTip,
      tipContent,
      suffixIcon: (
        <XIcon type="input-clear" iconWidth={12} iconHeight={12} onClick={this.onInputClear} />
      ),
    };

    return (
      <XModal className={wrapClass} opened onClosed={close} escapeClose={false} isHideIcon={false}>
        <div className="modal-title">{title}</div>
        <div className="modal-body">
          <div className="email-wrap">
            <div className="msg" dangerouslySetInnerHTML={{ __html: message }} />
            <div className="input-with-clear">
              <XInput {...inputProps} />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <XButton className="pwa-btn" onClicked={this.onSignIn}>
            {t('SIGN_IN')}
          </XButton>
        </div>
      </XModal>
    );
  }
}

BindEmailModal.propTypes = {
  data: PropTypes.object.isRequired,
};

BindEmailModal.defaultProps = {};

export default BindEmailModal;
