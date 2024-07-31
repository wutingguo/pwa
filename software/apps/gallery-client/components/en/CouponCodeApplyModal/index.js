import React, { Component } from 'react';
import classnames from 'classnames';
import { getLanguageCode } from '@resource/lib/utils/language';
import XModal from '@common/components/XModal';
import XButton from 'appsCommon/components/dom/XButton';

import {
  applyCouponCode,
  getStudioSample
} from '@apps/gallery-client/services/cart';
import { checkTokenError } from 'appsCommon/utils/userToken';

import './index.scss';

const isStudioSampleCode = code => {
  return code.toUpperCase() === "STUDIOSAMPLE";
}

class CouponCodeApplyModal extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      inputValue: '',
      warnContent: '',
      force_use: false,
      isLoading: false
    };
    this.onInputChange = this.onInputChange.bind(this);
    this.onApplyCode = this.onApplyCode.bind(this);
    this.focus = this.focus.bind(this);
  }

  componentDidMount() {
    this.focus();
  }

  focus() {
    this.textInput.focus();
  }

  onInputChange = (e) => {
    const inputValue = e.target.value;
    this.setState({
      inputValue: inputValue.trim(),
      warnContent: "",
      force_use: false
    });
  }

  onApplyCode = () => {
    const {
      closeModal,
      refreshPageData,
      toogleStudioSampleModal
    } = this.props;
    const {
      force_use,
      inputValue = '',
      warnContent
    } = this.state;
    if (warnContent && !force_use ) return;
    if (!inputValue.trim()) {
      this.setState({
        warnContent: t("COUPON_CODE_REQUIRE_TIP")
      });
      return;
    }
    const isStudioSample = isStudioSampleCode(inputValue);

    this.setState({
      isLoading: true
    });

    if (isStudioSample) {
      if (force_use) {
        closeModal();
        toogleStudioSampleModal();
        return;
      }
      getStudioSample(force_use)
        .then(() => {
          this.setState({
            isLoading: false
          });
          closeModal();
          toogleStudioSampleModal();
        })
        .catch(errorCode => {
          let force_use = false;
          let warnContent = t("COUPON_CODE_FAILED_TIP");
          checkTokenError(errorCode);
          switch(errorCode) {
            case 420450: {
              force_use = true;
              warnContent = t("COUPON_CODE_CONFLICT_TIP");
              break;
            }
            case 404465: {
              warnContent = t("COUPON_CODE_STUDIOSAMPLE_PROONLY_TIP");
              break;
            }
            case 420466: {
              warnContent = t("COUPON_CODE_CANNOT_CONBINED_PERORDER_TIP");
              break;
            }
            case 400450:
            default: {
              break;
            }
          }
          this.setState({
            force_use,
            warnContent,
            isLoading: false
          });
        });
    } else {
      applyCouponCode({code: inputValue, force_use})
        .then(data => {
          this.setState({
            isLoading: false
          });
          closeModal();
          refreshPageData(data);
        })
        .catch(errorCode => {
          let force_use = false;
          let warnContent = t("COUPON_CODE_FAILED_TIP");
          checkTokenError(errorCode);
          switch(errorCode) {
            case 420450: {
              force_use = true;
              warnContent = t("COUPON_CODE_CONFLICT_TIP");
              break;
            }
            case 420466: {
              warnContent = t("COUPON_CODE_CANNOT_CONBINED_PERORDER_TIP");
              break;
            }
            case 400450:
            default: {
              break;
            }
          }
          this.setState({
            force_use,
            warnContent,
            isLoading: false
          });
        })
    }

  }

  render() {
    const {
      closeModal
    } = this.props;
    const {
      force_use,
      isLoading,
      inputValue,
      warnContent
    } = this.state;

    const cancelText = t('CANCEL');
    const confirmText = force_use ? t('APPLY_NEW_CODE') : t('APPLY');

    const xmodalProps = {
      data: {
        title: t("COUPON_CODE"),
        className: 'coupon-code-apply-modal'
      },
      actions: {
        handleClose: closeModal
      }
    };
    const confirmBtnCls = classnames('balck', {
      'confirm-btn-de': force_use && getLanguageCode() === 'de'
    });
    return (
      <XModal {...xmodalProps}>
        <div className="coupon-code-apply-modal-content">
          <div className="modal-body">
            <input
              ref={input => this.textInput = input}
              placeholder={t("COUPON_CODE")}
              value={inputValue}
              onChange={this.onInputChange}
            />
            {!!warnContent && (
              <div className="warn-message-container">
                <img
                  className="warn-icon"
                  src="/clientassets/portal/template-resources/images/shoppingCartV2/warn.svg"
                />
                <span className="warn-message">{warnContent}</span>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <XButton
              className="white"
              width="196"
              height="30"
              onClicked={closeModal}
            >{cancelText}</XButton>
            <XButton
              className={confirmBtnCls}
              width="196"
              height="30"
              isWithLoading={true}
              isShowLoading={isLoading}
              onClicked={this.onApplyCode}
            >{confirmText}</XButton>
          </div>
        </div>
      </XModal>
    );
  }
}

export default CouponCodeApplyModal;
