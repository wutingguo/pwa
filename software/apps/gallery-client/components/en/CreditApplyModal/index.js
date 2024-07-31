import React, { Component } from 'react';
import XModal from '@common/components/XModal';
import XRadio from '@common/components/XRadio';
import XButton from 'appsCommon/components/dom/XButton';

import {
  getCreditInfo,
  applyCredit
} from '@apps/gallery-client/services/cart';
import { getCurrencyPrecision, getFormatCurrency, getCountryCode } from '@resource/lib/utils/currency';
import { checkTokenError } from 'appsCommon/utils/userToken';

import './index.scss';

class CreditApplyModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currency: {},
      total: "",
      eligible: "",
      totalErrorMessage: '',
      ava_credit_point_list: []
    }
    this.applyCredit = this.applyCredit.bind(this);
    this.checkWarnMessage = this.checkWarnMessage.bind(this);
  }

  onToogleCreditItem(type) {
    const { ava_credit_point_list } = this.state;
    ava_credit_point_list.some(item => {
      if (item.type === type) {
        item.selected = !item.selected;
        return true;
      }
    });
    this.setState(
      {ava_credit_point_list},
      this.checkWarnMessage
    );
  }

  onInputChange(type, ev) {
    let value = ev.target.value;
    if (!(/^[0-9\.]*$/.test(value))) return;
    const {
      currency,
      ava_credit_point_list
    } = this.state;
    const precision = currency.code ? getCurrencyPrecision(currency.code) : 2;
    const valueFloatLength = String(value).split('.')[1] && String(value).split('.')[1].length;
    if (valueFloatLength > precision) {
      value = Number(value).toFixed(precision);
    }
    ava_credit_point_list.some(item => {
      if (item.type === type) {
        item.applied_amt = value;
        item.errorMessage = '';
        return true;
      }
    });
    this.setState({ava_credit_point_list});
  }

  onInputBlur(type) {
    const {
      ava_credit_point_list
    } = this.state;
    ava_credit_point_list.forEach(item => {
      if (item.type === type) {
        const itemExceed = Number(item.applied_amt) > Number(item.available_amt);
        item.applied_amt = itemExceed ? item.available_amt : (item.applied_amt || 0);
      }
    });
    this.setState(
      {ava_credit_point_list},
      this.checkWarnMessage
    );
  }

  checkWarnMessage() {
    const {
      currency,
      eligible,
      ava_credit_point_list
    } = this.state;
    const { symbol, code } = currency;

    let itemExceed = false;
    let totalExceed = false;
    let total = 0;
    const precision = code ? getCurrencyPrecision(code) : 2;
    ava_credit_point_list.forEach(item => {
      let itemWarnMessage = "";
      if (item.selected) {
        total += Number(item.applied_amt);
        if (Number(item.applied_amt) > Number(item.available_amt)) {
          itemExceed = true;
          itemWarnMessage = t("DONT_HAVE_ENOUGH_CREDIT");
        }
      }
      item.errorMessage = itemWarnMessage;
    });
    let totalErrorMessage = '';
    if (Number(total) > Number(eligible)) {
      totalExceed = true;
      totalErrorMessage = t("TOTAL_CREDIT_EXCEED", {n: eligible, symbol })
    }
    this.setState({
      total: total.toFixed(precision),
      totalErrorMessage,
      ava_credit_point_list
    });
    return !(itemExceed || totalExceed);
  }

  applyCredit() {
    const { closeModal, refreshPageData } = this.props;
    const checkResult = this.checkWarnMessage();
    if (!checkResult) return;
    const { ava_credit_point_list } = this.state;
    const applyCreditList = [];
    ava_credit_point_list.forEach(item => {
      if (item.selected) {
        applyCreditList.push({
          type: item.type,
          amount: item.applied_amt
        })
      }
    });
    applyCredit(applyCreditList)
      .then(result => {
        closeModal();
        refreshPageData(result);
      })
      .catch(errorCode => {
        checkTokenError(errorCode);
      });
  }

  componentDidMount() {
    getCreditInfo()
      .then(data => {
        const {
          currency,
          total,
          eligible,
          ava_credit_point_list
        } = data;
        const newCreditList = ava_credit_point_list.map(item => {
          return {
            ...item,
            selected: Number(item.applied_amt) > 0,
            errorMessage: ''
          }
        });
        this.setState({
          currency,
          total,
          eligible,
          ava_credit_point_list: newCreditList
        });
      })
  }

  render() {
    const {
      closeModal
    } = this.props;
    const {
      currency,
      total,
      eligible,
      totalErrorMessage,
      ava_credit_point_list
    } = this.state;

    const { symbol = '' } = currency;

    const xmodalProps = {
      data: {
        title: t("CREDIT_APPLY_MODAL_TITLE"),
        className: 'credit-apply-modal'
      },
      actions: {
        handleClose: closeModal
      }
    };

    const countryCode = getCountryCode();

    return (
      <XModal {...xmodalProps}>
        <div className="credit-apply-modal-content">
          <div className="credit-summary">
            <div className="credit-summary-item">
              <div className="credit-label">{t("ELIGIBLE_TO_APPLY")}:</div>
              <div className="credit-value">{getFormatCurrency(eligible, `${symbol}${eligible}`)}</div>
            </div>
            <div className="credit-summary-item">
              <div className="credit-label">
                <span>{t("TOTAL_APPLY")}:</span>
              </div>
              <div className="credit-value">{getFormatCurrency(total, `${symbol}${total}`)}</div>
            </div>
          </div>
          <div className="total-error-message">{totalErrorMessage}</div>
          <div className="credit-list">
            <div className="credit-list-header">
              <div className="credit-type">{t("TYPE")}</div>
              <div className="credit-avaliable">{t("AVAILABLE")}</div>
              <div className="credit-applied">{t("APPLIED")}</div>
            </div>
            <div className="credit-item-container">
              {
                ava_credit_point_list.map(creditItem => {
                  return (
                    <div className="credit-item">
                      <div className="credit-item-content">
                        <div className="credit-type">
                          <XRadio
                            checked={creditItem.selected}
                            skin="blue"
                            name={creditItem.type}
                            text={creditItem.display_name}
                            onClicked={this.onToogleCreditItem.bind(this, creditItem.type)}
                          />
                        </div>
                        <div className="credit-avaliable">{getFormatCurrency(creditItem.available_amt, `${symbol}${creditItem.available_amt}`)}</div>
                        <div className="credit-applied">
                          {countryCode === 'DE' ? '' : <span>{symbol}</span>}
                          <input
                            disabled={!creditItem.selected}
                            value={creditItem.applied_amt}
                            onChange={this.onInputChange.bind(this, creditItem.type)}
                            onBlur={this.onInputBlur.bind(this, creditItem.type)}
                          />
                          {countryCode === 'DE' ? <span>{symbol}</span> :  ''}
                        </div>
                      </div>
                      <div className="credit-item-warning">{creditItem.errorMessage}</div>
                    </div>
                  );
                })
              }
            </div>
            <div className="usage-tip">
              <div>{t("CREDIT_EXPIRE_TIP")}</div>
              <div>{t("CREDIT_SCOPE_TIP")}</div>
            </div>
            <div className="buttons-container">
              <XButton
                className='white'
                width="160"
                height="30"
                onClicked={closeModal}
              >{t("CANCEL")}</XButton>
              <XButton
                className='black'
                width="160"
                height="30"
                onClicked={this.applyCredit}
              >{t("OK")}</XButton>
            </div>
          </div>
        </div>
      </XModal>
    );
  }
}
 
export default CreditApplyModal;