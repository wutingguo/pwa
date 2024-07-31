import React from 'react';
import qs from 'qs';
import XPureComponent from '@resource/components/XPureComponent';
import { create as createHostedFields } from 'braintree-web/hosted-fields';

import XLoading from '@resource/components/XLoading';

import classNames from 'classnames';
import braintreeClient from './_braintreeUtil';

import {
  handlePayment,
  getBraintreeToken
} from './_handleHelp';

import './_CreditCardForm.scss';
import './index.scss';

let timer;

const HOSTED_FIELDS_STYLE = {
  input: {
    'font-size': '16px',
    padding: '0',
  }
};

export default class Payment extends XPureComponent {
  constructor(props) {
    super(props);

    this.state = {
      hostedFieldsInstance: null,
      subscribeSuccess: false,
      isPaying: false,
      isLoading: true,
      errorMsg: '',
      subscribe_orders: null,
      galleryBaseUrl: '',

      cardType: '',
      numberStatus: {
        isEmpty: true
      },
      expirationMonthStatus: {
        isEmpty: true
      },
      expirationYearStatus: {
        isEmpty: true
      },
      cvvStatus: {
        isEmpty: true
      }
    };

    this.handlePayment = (token, callback) => handlePayment(this, token, callback);
    this.getBraintreeToken = (baseUrl) => getBraintreeToken(this, baseUrl);
    this.onHostedFieldsCreated = this.onHostedFieldsCreated.bind(this);
    this.toggleCardInputMethod = this.toggleCardInputMethod.bind(this);
    this.toggleRememberCreditCard = this.toggleRememberCreditCard.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onSubscribeSuccess = this.onSubscribeSuccess.bind(this);

    this.bindEventsToHostedFieldsInstance = this.bindEventsToHostedFieldsInstance.bind(
      this
    );
  }

  bindEventsToHostedFieldsInstance(instance) {
    instance.on('cardTypeChange', event => {
      console.log('event.cards: ', event.cards)
      // Handle a field's change, such as a change in validity or credit card type
      const field = event.fields[event.emittedBy];
      const stateKey = `${event.emittedBy}Status`;
      if (!field.isEmpty) {
        if (field.isValid) {
          this.setState({
            [stateKey]: Object.assign({}, this[stateKey], {
              isEmpty: false,
              isValid: true
            })
          });
        } else if (field.isPotentiallyValid) {
          this.setState({
            [stateKey]: Object.assign({}, this[stateKey], {
              isEmpty: false,
              isValid: true
            })
          });
        } else {
          this.setState({
            [stateKey]: Object.assign({}, this[stateKey], {
              isEmpty: false,
              isValid: false
            })
          });
        }
      }
      if (event.cards.length === 1) {
        this.setState({
          cardType: event.cards[0].type
        });
      } else {
        this.setState({ cardType: '' });
      }
    });

    instance.on('blur', event => {
      const field = event.fields[event.emittedBy];
      const stateKey = `${event.emittedBy}Status`;
      if (stateKey === 'cvvStatus') {
        if (!field.isEmpty) {
          if (field.isValid) {
            this.setState({
              [stateKey]: Object.assign({}, this[stateKey], {
                isEmpty: false,
                isValid: true
              })
            });
          } else {
            this.setState({
              [stateKey]: Object.assign({}, this[stateKey], {
                isEmpty: false,
                isValid: false
              })
            });
          }
        } else {
          this.setState({
            [stateKey]: Object.assign({}, this[stateKey], {
              isEmpty: false,
              isValid: true
            })
          });
        }

      }
    });

    instance.on('validityChange', event => {
      const field = event.fields[event.emittedBy];

      const stateKey = `${event.emittedBy}Status`;

      if (!field.isEmpty) {
        if (field.isValid) {
          this.setState({
            [stateKey]: Object.assign({}, this[stateKey], {
              isEmpty: false,
              isValid: true
            })
          });
        } else if (field.isPotentiallyValid) {
          this.setState({
            [stateKey]: Object.assign({}, this[stateKey], {
              isEmpty: false,
              isValid: true
            })
          });
        } else {
          this.setState({
            [stateKey]: Object.assign({}, this[stateKey], {
              isEmpty: false,
              isValid: false
            })
          });
        }
      }
    });
  }

  parseUrlParams() {
    const urlParams = qs.parse(location.search.split('?')[1]);
    const { subscribe_orders } = urlParams;
    if (!subscribe_orders) history.back();

    this.setState({ subscribe_orders: JSON.parse(subscribe_orders) });
  }

  onHostedFieldsCreated(err, hostedFieldsInstance) {
    if (err) {
      this.setState({
        errorMsg: err.message
      });
    } else {
      this.setState({
        hostedFieldsInstance
      });
    }
  }

  toggleCardInputMethod() {
    this.setState({
      isShowUseNewCreditCard: !this.state.isShowUseNewCreditCard
    });
  }

  toggleRememberCreditCard(e) {
    this.setState({
      isRememberCreditCard: e.target.checked
    });
  }

  onSubscribeSuccess() {
    const { history } = this.props;

    // history.push('/software/success');
    const origin = window.location.origin;
    const href = origin + '/software/success';
    window.location.href = href;
  }

  onSubmit(e) {
    e.preventDefault();
    const {
      isPaying,
      hostedFieldsInstance
    } = this.state;

    window.logEvent.addPageEvent({
      name: 'PaymentInfo_Click_PlaceOrder'
    });

    if (!isPaying) {
      this.setState({ isPaying: true, errorMsg: '', isLoading: true });

      const finalHandle = (res) => {
        this.setState({ isPaying: false, isLoading: false, subscribeSuccess: true });
        this.onSubscribeSuccess();
      };
      hostedFieldsInstance.tokenize((err, payload) => {
        console.log('payload: ', payload)
        console.log('err: ', err)
        if (err) {
          this.setState({
            errorMsg: err.message,
            isPaying: false,
            isLoading: false
          });

          return;
        }
        this.handlePayment(payload.nonce, finalHandle);
      });
    }
  }

  componentDidMount() {
    clearTimeout(timer);
    const { urls } = this.props;

    timer = setTimeout(() => {
      this.setState({
        isLoading: true
      }, () => {
        const baseUrl = urls.get('baseUrl');
        this.parseUrlParams();

        braintreeClient
          .getClientInstance(baseUrl)
          .then(instance => {
            createHostedFields(
              {
                client: instance,
                styles: HOSTED_FIELDS_STYLE,
                fields: {
                  number: {
                    selector: '#card-number',
                    placeholder: 'Card Number'
                  },
                  cvv: {
                    selector: '#cvv',
                    placeholder: 'CSC'
                  },
                  expirationMonth: {
                    selector: '#expiration-month',
                    placeholder: 'MM'
                  },
                  expirationYear: {
                    selector: '#expiration-year',
                    placeholder: 'YY'
                  }
                }
              },
              (err, hostedFieldsInstance) => {
                this.setState({ isLoading: false });
                this.onHostedFieldsCreated(err, hostedFieldsInstance);

                if (err) {
                  return;
                }

                this.bindEventsToHostedFieldsInstance(hostedFieldsInstance);
              }
            );
          })
          .catch(e => {
            this.setState({ isLoading: false });
          });
      })
    }, 500);
  }

  render() {
    const { urls } = this.props;
    const {
      isLoading,
      errorMsg,
      cardType,
      numberStatus,
      expirationMonthStatus,
      expirationYearStatus,
      cvvStatus
    } = this.state;
    const baseUrl = urls.get('baseUrl');

    const classObj = {
      'icon-card-organization': true,
      'default-card': true
    };

    if (cardType && cardType.length) {
      delete classObj['default-card'];

      classObj[cardType] = true;
    }

    const cardIcon = classNames(classObj);

    const cardNumberClass = classNames(' card-number', {
      invalid: !numberStatus.isEmpty && !numberStatus.isValid
    });

    const expirationMonthClass = classNames('expiration-month', {
      invalid: !expirationMonthStatus.isEmpty && !expirationMonthStatus.isValid
    });

    const expirationYearClass = classNames('expiration-year', {
      invalid: !expirationYearStatus.isEmpty && !expirationYearStatus.isValid
    });

    const cvvClass = classNames('cvv', {
      invalid: !cvvStatus.isEmpty && !cvvStatus.isValid
    });

    const containerClass = classNames('credit-card-from-gallery-payment');

    console.log('isLoading', isLoading);

    return <div className="payment-gallery">
      <div className="billing-proplan-content">
        <p className="title">{t('PAYMENT_INFO_TITLE')}</p>

        <div className={containerClass}>
          <form onSubmit={this.onSubmit}>
            <div className="row card-number-container">
              <label className="label" htmlFor="card-number">{t('CREDIT_CARD')}: </label>
              <div
                id="card-number"
                type="text"
                className={cardNumberClass}
                ref={node => {
                  this.cardNumberRef = node;
                }}
              />
            </div>
            <div className="row pay-types">
              <span className="label">{t('PAYMENT_TYPES')}: </span>
              <img src={`${baseUrl}template-resources/images/bill/Billing_CC_All.png`} alt="" />
            </div>
            <div className="row">
              <span className="label">{t('EXPIRATIO_DATE')}: </span>
              <div
                id="expiration-month"
                type="text"
                className={expirationMonthClass}
                ref={node => {
                  this.ccMonthRef = node;
                }}
              />
              <span className="line">/</span>
              <div
                id="expiration-year"
                type="text"
                className={expirationYearClass}
                ref={node => {
                  this.ccYearRef = node;
                }}
              />
            </div>
            <div className="row">
              <label className="label" htmlFor="cvv">{t("CSC")}: </label>
              <div
                id="cvv"
                type="text"
                className={cvvClass}
                ref={node => {
                  this.cvcRef = node;
                }}
              />
            </div>

            <div className="row">
              <p className="error-info">{errorMsg}</p>
            </div>
            <button type="submit" className="start-pro-button">{t("PLACE_ORDER")}</button>
          </form>
        </div>
      </div>

      {isLoading ? <XLoading isShown={true}/> : null}
    </div>
  }
}