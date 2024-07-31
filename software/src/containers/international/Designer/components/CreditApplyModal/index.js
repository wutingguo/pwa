import React, { Component, Fragment } from 'react';
// 公共组件
import XInput from '@resource/components/XInput/Input/index';
import XButton from '@resource/components/XButton';

// 自定义组件
import XModal from '@src/components/XModal';
import XRadio from '../XRadio';

// 公共方法
import {
  getCurrencyPrecision,
  getFormatCurrency,
  getCountryCode
} from '@resource/lib/utils/currency';

import './index.scss';

const countryCode = getCountryCode();

const CountryCodeSymbol = ({ symbol, children }) => {
  const isDE = countryCode === 'DE';
  return <Fragment>
    {!isDE && <span>{symbol}</span>}
    {children}
    {isDE && <span>{symbol}</span>}
  </Fragment>

}

const CreditItem = ({
  index,
  selected,
  type,
  display_name,
  applied_amt,
  available_amt,
  errorMessage,
  symbol,
  onToogleCreditItem,
  onInputBlur,
  onInputChange }) => {

  return <div className="credit-item">
    <div className="credit-item-content">
      <div className="credit-type">
        <XRadio
          checked={selected}
          skin="blue"
          name={`${type}_${index}`}
          text={display_name}
          onClicked={() => onToogleCreditItem(type)}
        />
      </div>
      <div className="credit-avaliable">{getFormatCurrency(available_amt, `${symbol}${available_amt}`)}</div>
      <div className="credit-applied">
        <CountryCodeSymbol symbol={symbol}>
          <XInput
            disabled={!selected}
            value={applied_amt}
            onChange={(v) => onInputChange(type, v)}
            onBlur={() => onInputBlur(type)}
          />
        </CountryCodeSymbol>
      </div>
    </div>
    <div className="credit-item-warning"> {errorMessage} </div>
  </div>

}

const CreditListHeader = () => {
  return <div className="credit-list-header">
    <div className="credit-type">{t("TYPE")}</div>
    <div className="credit-avaliable">{t("AVAILABLE")}</div>
    <div className="credit-applied">{t("APPLIED")}</div>
  </div>
}

const UsageTip = () => {
  return <div className="usage-tip">
    <div>{t("CREDIT_EXPIRE_TIP")}</div>
    <div>{t("CREDIT_SCOPE_TIP")}</div>
  </div>
}

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
  }

  onToogleCreditItem = (type) => {
    const { ava_credit_point_list } = this.state;
    ava_credit_point_list.some(item => {
      if (item.type === type) {
        item.selected = !item.selected;
        return true;
      }
    });
    this.setState(
      { ava_credit_point_list },
      this.checkWarnMessage
    );
  }

  onInputChange = (type, value) => {
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
    this.setState({ ava_credit_point_list });
  }

  onInputBlur = (type) => {
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
      { ava_credit_point_list },
      this.checkWarnMessage
    );
  }

  checkWarnMessage = () => {
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
      totalErrorMessage = t("TOTAL_CREDIT_EXCEED", { n: eligible, symbol })
    }
    this.setState({
      total: total.toFixed(precision),
      totalErrorMessage,
      ava_credit_point_list
    });
    return !(itemExceed || totalExceed);
  }

  applyCredit = () => {

    const { boundProjectActions, onSetStoreCredit, pages } = this.props;
    const checkResult = this.checkWarnMessage();
    if (!checkResult) return;

    const { ava_credit_point_list } = this.state;
    const use_rebate_json = ava_credit_point_list
      .filter(item => item.selected)
      .map(item => ({ type: item.type, amount: item.applied_amt }));

    boundProjectActions.getPrice({
      purchase_num: pages,
      use_rebate_json
    }).then(({ data, ret_code }) => {
      if (ret_code == 200000) {
        onSetStoreCredit(data, use_rebate_json);
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  componentDidMount() {

    const { boundProjectActions, saasBaseUrl, pages } = this.props;
    boundProjectActions.getCartCredit({ saasBaseUrl, pages }).then(({ ret_code, data }) => {
      if (ret_code === 200000) {
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
      }
    }).catch((err) => {
      console.log("err:", err);
    });
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
            <div className="total-error-message">{totalErrorMessage}</div>
          </div>
          <div className="credit-list">

            <CreditListHeader />

            <div className="credit-item-container">
              {
                Array.isArray(ava_credit_point_list) && ava_credit_point_list.map((creditItem, index) => {
                  return <CreditItem
                    key={index}
                    index={index}
                    {...creditItem}
                    symbol={symbol}
                    onToogleCreditItem={this.onToogleCreditItem}
                    onInputChange={this.onInputChange}
                    onInputBlur={this.onInputBlur} />
                })
              }
            </div>

            <UsageTip />

            <div className="buttons-container">
              <XButton
                className='white'
                width={160}
                height={30}
                onClicked={closeModal}
              >{t("CANCEL")}</XButton>
              <XButton
                className='black'
                width={160}
                height={30}
                onClicked={this.applyCredit}
              >{t("OK")}</XButton>
            </div>
          </div>
        </div>
      </XModal>
    )
  }


}

export default CreditApplyModal;