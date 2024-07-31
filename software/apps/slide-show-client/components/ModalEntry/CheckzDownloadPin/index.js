import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ToolTip from 'react-portal-tooltip';
import { isFunction } from 'lodash';

import { XModal, XButton, XInput, XIcon } from '@common/components';
import { emailReg, SPACE_REG } from '@resource/lib/constants/reg';
import * as localModalTypes from '@apps/slide-show-client/constants/modalTypes';
import './index.scss';
const emptyTip = 'Download PIN is required.';
const errorTip = 'Download PIN is incorrect.';

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
      tipContent: !inputValue ? emptyTip : '',
      isShowSuffix: !!inputValue
    });
  };

  onInputClear = () => {
    this.setState({
      inputValue: '',
      isShowSuffix: false,
      isShowTip: true,
      tipContent: emptyTip
    });
  };

  handleCheckPin = () => {
    const { inputValue } = this.state;
    const { data } = this.props;
    const { boundProjectActions, boundGlobalActions, download_url } = data.toJS();
    const { getClientDownloadCheckPin } = boundProjectActions;
    getClientDownloadCheckPin({ pin: inputValue }).then(res => {
      if (res.ret_code === 200000 && res.data) {
        const { check_pin_result } = res.data;
        if (check_pin_result) {
          boundGlobalActions.hideModal(localModalTypes.CHECK_DOWNLOAD_PIN);
          window.location.href = download_url;
        } else {
          // 错误文案提示
          this.setState({
            isShowTip: true,
            tipContent: 'Download PIN is incorrect.'
          });
        }
      }
    });
  };

  onSignIn = () => {
    // window.logEvent.addPageEvent({
    //   name: 'GalleryFavoritePopup_Click_Signin'
    // });
    const count = /^\d{4}$/;
    const { data } = this.props;
    const onOk = data.get('onOk');
    const { inputValue } = this.state;
    const isEmptyStr = SPACE_REG.test(inputValue);
    const isLegalDig = count.test(inputValue);
    let tipContent = '';
    let isShowTip = false;
    if (!inputValue || isEmptyStr) {
      isShowTip = true;
      tipContent = emptyTip;
    } else if (!isLegalDig) {
      isShowTip = true;
      tipContent = errorTip;
    }
    this.setState({
      isShowTip,
      tipContent
    });
    if (inputValue && isLegalDig && !isEmptyStr) {
      // onOk(inputValue);
      this.handleCheckPin();
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

    const close = data.get('close');
    const title = data.get('title');
    const desc = data.get('desc');
    const wrapClass = classNames('check-pin-modal-wrap', data.get('className'));

    const inputProps = {
      className: 'create',
      value: inputValue,
      placeholder: 'Enter download PIN',
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
    // console.log("this.props....",this.props.data.toJS())

    return (
      <XModal className={wrapClass} opened onClosed={close} escapeClose={false} isHideIcon={false}>
        <div className="modal-title-pin">{title}</div>
        <div className="modal-body-pin">
          <div className="email-wrap">
            <div className="msg">{desc}</div>
            <div className="input-with-clear">
              <XInput {...inputProps} />
            </div>
          </div>
        </div>
        <div className="modal-footer-btn">
          {/* <span id="text" onMouseEnter={this.showToolTip} onMouseLeave={this.hideToolTip}>
            {t('THE_REASON_OF_NEED_MY_EMAIL')}
          </span> */}
          {/* <ToolTip
            parent="#text"
            position="bottom"
            tooltipTimeout={0}
            active={isShowToolTip}
            arrow="center"
            style={tooTipStyle}
          >
            {t('THE_REASON_OF_NEED_MY_EMAIL_TIPS')}
          </ToolTip> */}
          <div className="pwa-btn pwa-btn-cancel" onClick={close}>
            Cancel
          </div>
          <div className="pwa-btn pwa-btn-ok" onClick={this.onSignIn}>
            Next
          </div>
          {/* <XButton className="pwa-btn pwa-btn-cancel" onClicked={close}>
            Cancel
          </XButton>
          <XButton className="pwa-btn pwa-btn-ok" onClicked={this.onSignIn}>
            Next
          </XButton> */}
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
