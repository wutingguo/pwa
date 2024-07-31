import React from 'react';
import { formatCurrency, needFormatCurrencyCountryMap } from '@resource/lib/utils/currency';

export const creditColumns = ({ checked, onChange }) => [
  {
    dataIndex: 'radio',
    className: 'table-radio',
    render(text, i, item) {
      return <input name='radio' type='radio' checked={checked === item.check_code} onChange={() => onChange(item)} />
    }
  },
  {
    dataIndex: 'img',
    className: 'credit-img',
    render(value, i, { brand = 'no-found' }) {
      // return <img src={creditImgObj[brand]} />
      return <i className={`icon-bank-card icon-${brand.toLocaleLowerCase()}`} />
    }
  },
  {
    dataIndex: 'brand',
    render(value) {
      if (value === 'MasterCard') {
        return t("MASTER_CARD");
      }
      return value;
    }
  },
  {
    dataIndex: 'card_number',
    render: (value) => `**** **** **** ${value}`
  }
];

export const creditImgObj = {
  JCB: 'icon-jcb',
  Visa: 'icon-visa',
  MasterCard: 'icon-mastercard',
  Maestro: 'icon-maestrocard',
  'American Express': 'icon-american',
  'Diners Club': 'icon-dinerclub',
  UnionPay: 'icon-unionpay',
  Discover: 'icon-discover',
  default: 'icon-no-found'
}

export const braintreeFields = {
  number: 'number',
  expirationMonth: 'expirationMonth',
  expirationYear: 'expirationYear',
  cvv: 'cvv'
}

export const errType = {
  invalidNumber: 'invalidNumber',
  invalidDate: 'invalidDate',
  invalidCSC: 'invalidCSC'
}

export const errConfig = {
  [errType.invalidNumber]: 'INVALID_NUMBER',
  [errType.invalidDate]: 'INVALID_EXPIRATION_DATE',
  [errType.invalidCSC]: 'INVALID_SECURITY_CODE'
}

export const errText = {
  [errType.invalidNumber]: t("INVALID_NUMBER"),
  [errType.invalidDate]: t("INVALID_EXPIRATION_DATE"),
  [errType.invalidCSC]: t("INVALID_SECURITY_CODE")
}

export const shipInfoConfig = [
  {
    key: 'fullName',
    label: 'SHIP_TO'
  },
  {
    key: 'address',
  },
  {
    key: 'phone',
    label: 'PHONE'
  },
  {
    key: 'email',
    label: 'EMAIL_ADDRESS'
  }
];

export const costInfoColumns = [
  {
    dataIndex: 'label',
    render: value => `${value}:`
  },
  {
    className: 'cost-value',
    dataIndex: 'value'
  }
];

const costDataConfig = [
  {
    key: 'item_total',
    label: 'Items Total',
    isNegative: false
  },
  // {
  //   key: 'volume_discount',
  //   label: 'VOLUME_DISCOUNT',
  //   isNegative: true
  // },
  // {
  //   key: 'coupon_discount',
  //   label: 'COUPON_CODE',
  //   isNegative: true
  // },
  {
    key: 'applied_credits',
    label: 'Store Credit',
    isNegative: true
  },
  // {
  //   key: 'fee',
  //   label: 'SHIPPING',
  //   isNegative: false
  // },
  // {
  //   key: 'tax',
  //   label: 'TAX',
  //   isNegative: false
  // },
  {
    key: 'payable_amount',
    label: 'Total',
    isNegative: false
  }
];

export const getCostData = (data = {}, currency = {}, countryCode = 'US', hasPoints) => {
  const { symbol = '', code = '' } = currency;
  const costData = costDataConfig.map(item => {
    const { key = '' } = item;
    const price = data[key] || '0.00';
    if (key === 'volume_discount' && +price <= 0) {
      return '';
    }
    let value = key === 'payable_amount' ? symbol + price + ' ' + code : symbol + price;
    value = (item.isNegative && +price) ? '-' + value : value;

    if (needFormatCurrencyCountryMap.includes(countryCode)) {
      value = (item.isNegative && +price) ?
        `-${formatCurrency(price)}` :
        key === 'payable_amount' ?
          `${formatCurrency(price)} ${code}` :
          formatCurrency(price)
    }

    return {
      ...item,
      label: item.label,
      value
    }
  });

  // 如果不包含积分需要剔除applied_credits key
  return costData.filter(item => (hasPoints ? true : item.key != "applied_credits") && !!item);
}
