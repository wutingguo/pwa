import React, { Component } from 'react';
import classnames from 'classnames';
import XLoading from '@resource/components/XLoading';
import { create as createHostedFields } from 'braintree-web/hosted-fields';
import braintreeClient from './BraintreeUtil';
import { creditImgObj, braintreeFields, errType, errText } from './Config';
import { getSupportPaymentTypes } from '@resource/lib/utils/payment/paymentTypes';

const HOSTED_FIELDS_STYLE = {
  input: {
    'font-size': '16px',
    padding: '0'
  }
};

class NewCredit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      hostedFieldsInstance: null,
      cardIcon: creditImgObj.default, // 信用卡图片
      errMsg: {
        create: '',
        [errType.invalidNumber]: '',
        [errType.invalidDate]: '',
        [errType.invalidCSC]: ''
      },
      checked: true,
      paymentTypes: []
    };

    this.getPaymentTypes = this.getPaymentTypes.bind(this);
  }

  componentDidMount() {
    braintreeClient
      .getClientInstance()
      .then(instance => {

        const options = {
          client: instance,
          styles: HOSTED_FIELDS_STYLE,
          fields: {
            [braintreeFields.number]: {
              selector: '#card-number',
              placeholder: t("CARD_NUMBER")
            },
            [braintreeFields.expirationMonth]: {
              selector: '#expiry-month',
              placeholder: t("MM")
            },
            [braintreeFields.expirationYear]: {
              selector: '#expiry-year',
              placeholder: t("YYYY")
            },
            [braintreeFields.cvv]: {
              selector: '#cvv',
              placeholder: t("CSC")
            }
          }
        }

        createHostedFields(options, (err, hostedFieldsInstance) => {
          if (err) {
            this.setState(({ errMsg }) => ({
              errMsg: {
                ...errMsg,
                create: err.message
              }
            }));
            return;
          }
          this.bindEventsToHostedFieldsInstance(hostedFieldsInstance);
          this.setState({
            hostedFieldsInstance,
            isLoading: false
          });
        });

      })
      .catch(e => {
        this.setState({
          isLoading: false
        });
      });

    this.getPaymentTypes();
  }

  getPaymentTypes() {
    this.setState({
      paymentTypes: getSupportPaymentTypes()
    });
  }

  validateFields(event) {
    const { emittedBy, fields } = event;
    const { expirationMonth: month, expirationYear: year } = braintreeFields;
    const [field, monthField, yearField] = [
      fields[emittedBy],
      fields[month],
      fields[year],
    ];
    let key, value;
    let valid = field.isValid || field.isPotentiallyValid;
    const monthValid = monthField.isValid || monthField.isPotentiallyValid;
    const yearValid = yearField.isValid || yearField.isPotentiallyValid;

    if (emittedBy === braintreeFields.number) {
      key = errType.invalidNumber;
    } else if (emittedBy === month || emittedBy === year) {
      key = errType.invalidDate;
      valid = monthValid && yearValid;
    } else {
      key = errType.invalidCSC;
    }
    value = valid ? '' : errText[key];

    this.setState(({ errMsg }) => ({
      errMsg: {
        ...errMsg,
        [key]: value
      }
    }));
  }

  onInstanceCardTypeChange = event => {
    // Handle a field's change, such as a change in validity or credit card type
    let cardType = 'default';
    this.validateFields(event);
    // 更新信用卡图片
    if (event.cards.length === 1) {
      cardType = event.cards[0].niceType;
      cardType = cardType === 'Mastercard' ? 'MasterCard' : cardType;
    }
    this.setState({
      cardIcon: creditImgObj[cardType]
    });
  }

  onInstanceBlur = event => {
    this.validateFields(event);
  }

  onInstanceValidityChange = event => {
    this.validateFields(event);
  }

  bindEventsToHostedFieldsInstance = instance => {
    instance.on('cardTypeChange', this.onInstanceCardTypeChange);
    instance.on('blur', this.onInstanceBlur);
    instance.on('validityChange', this.onInstanceValidityChange);
  };

  onCheckedChange = e => {
    this.setState({
      checked: e.target.checked
    });
  }

  onSubmit = () => {
    const { hostedFieldsInstance, checked } = this.state;
    return new Promise((resolve, reject) => {
      if (!hostedFieldsInstance) {
        reject();
      };

      hostedFieldsInstance.tokenize((err, payload) => {
        if (err) {
          alert(err.message);
          return;
        }
        resolve({
          nonce: payload.nonce,
          checked
        });
      });

    })
  };

  render() {
    const { className, detailLoading } = this.props;
    const { isLoading, errMsg, checked, paymentTypes, cardIcon } = this.state;
    const loading = !detailLoading && isLoading;
    const errText = Object.values(errMsg).filter(item => !!item);
    const wrapperCls = classnames('new-credit-card-wrapper', {
      [className]: !!className
    });
    const bankCardCls = classnames('icon-bank-card', cardIcon);

    return (
      <div className={wrapperCls}>
        {loading ? <XLoading isShown={loading} backgroundColor="rgba(255,255,255,0.6)" /> : null}
        <form onSubmit={this.onSubmit}>
          <div className="credit-card">
            <div className="title">{t("CREDIT_CARD")}</div>
            <div className="credit-card-input-wrapper">
              <i className={bankCardCls}></i>
              <div id="card-number" type="text" className="credit-card-input" ref={node => (this.cardNumberRef = node)} />
            </div>
          </div>
          {/* payment types */}
          <div className="credit-card">
            <div className="title">{t("PAYMENT_TYPES")}</div>
            <div className="pay-types-image-container">
              {paymentTypes.map(item => <i className={`icon-bank-card icon-${item}`}></i>)}
            </div>
          </div>
          {/* expiry date */}
          <div className="expiry-csc-wrapper">
            <div className="expiry-date">
              <div className="title">{t("EXPIRED_DATE")}</div>
              <div className="expiry-full-date">
                <div id="expiry-month" type="text" className="expiry-month" ref={node => { this.expiryMonthRef = node; }} />
                <div id="expiry-year" type="text" className="expiry-year" ref={node => { this.expiryYearRef = node; }} />
              </div>
            </div>
            {/* csc */}
            <div>
              <div className="title">{t("CSC")}</div>
              <div id="cvv" type="text" className="csc" ref={node => { this.cscRef = node; }} />
            </div>
          </div>
          <div className="remember-credit">
            <input name="remember" type="checkbox" checked={checked} onChange={this.onCheckedChange} />
            <span>&nbsp;{t("REMEMBER_CREDIT_CARD")}</span>
          </div>
          <div className={"err-msg"}> {errText.map((item, i) => <div key={i}>{item}</div>)} </div>
        </form>
      </div>
    );
  }
}

export default NewCredit;
