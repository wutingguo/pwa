import React, { Component } from 'react';
import { isBoolean } from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ToolTip from 'react-portal-tooltip';
import { isFunction } from 'lodash';

import { XModal, XButton, XInput, XIcon } from '@common/components';
import { emailReg, phoneReg, SPACE_REG } from '@resource/lib/constants/reg';
import './index.scss';

class BindEmailModal extends Component {
  constructor(props) {
    super(props);

    const { data } = props;

    this.state = {
      inputValue: data.get('collectionName') || '',
      isShowTip: false,
      tipContent: '',
      isShowSuffix: false,
      isShowToolTip: false
    };

    this.showToolTip = this.showToolTip.bind(this);
    this.hideToolTip = this.hideToolTip.bind(this);
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

  onSignIn = () => {
    window.logEvent.addPageEvent({
      name: 'GalleryFavoritePopup_Click_Signin'
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
      tipContent
    });
    if (inputValue && isLegal && !isEmptyStr) {
      const params = {
        [emailReg.test(inputValue) ? 'guest_email' : 'guest_phone']: inputValue
      };
      console.log('=====params====: ', params);
      onOk(params, inputValue);
    }
  };

  showToolTip() {
    window.logEvent.addPageEvent({
      name: 'GalleryFavoritePopup_Click_Why'
    });

    this.setState({
      isShowToolTip: true
    });
  }

  hideToolTip() {
    this.setState({
      isShowToolTip: false
    });
  }

  render() {
    const { data } = this.props;
    const { inputValue, isShowTip, isShowSuffix, tipContent, isShowToolTip } = this.state;
    const title = data.get('title') || t('SIGN_IN');
    const message = data.get('message') || t('FAVORITES_BODY');
    const isShowReason = isBoolean(data.get('isShowReason')) ? data.get('isShowReason') : true;
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
      )
    };

    let tooTipStyle = {
      style: {
        fontSize: 12,
        width: 240,
        backgroundColor: '#3E3E3E',
        color: '#fff',
        lineHeight: '18px',
        padding: '24px 20px',
        zIndex: 99999999999
      },
      arrowStyle: {
        borderBottom: '11px solid #3E3E3E'
      }
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
          </div>
        </div>
        <div className="modal-footer clearfix">
          {isShowReason ? (
            <>
              <span id="text" onMouseEnter={this.showToolTip} onMouseLeave={this.hideToolTip}>
                {t('THE_REASON_OF_NEED_MY_EMAIL')}
              </span>
              <ToolTip
                parent="#text"
                position="bottom"
                tooltipTimeout={0}
                active={isShowToolTip}
                arrow="center"
                style={tooTipStyle}
              >
                {t('THE_REASON_OF_NEED_MY_EMAIL_TIPS')}
              </ToolTip>
            </>
          ) : null}

          <XButton className="pwa-btn" onClicked={this.onSignIn}>
            {t('SIGN_IN')}
          </XButton>
        </div>
      </XModal>
    );
  }
}

BindEmailModal.propTypes = {
  data: PropTypes.object.isRequired
};

BindEmailModal.defaultProps = {};

export default BindEmailModal;
