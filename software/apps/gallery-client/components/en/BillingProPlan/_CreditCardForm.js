import React, { Component } from 'react';
import { create as createHostedFields } from 'braintree-web/hosted-fields';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import braintreeClient from './_braintreeUtil';
import XLoading from '@common/components/XLoading';
import {
  getSupportPaymentTypes
} from '@resource/lib/utils/payment/paymentTypes';

import './_CreditCardForm.scss';

const HOSTED_FIELDS_STYLE = {
  input: {
    'font-size': '16px',
    padding: '0',
  }
};

export default class UseNewCreditCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
      },
      paymentTypes: [],
      isLoading: true
    };
    this.getPaymentTypes = this.getPaymentTypes.bind(this);
    this.bindEventsToHostedFieldsInstance = this.bindEventsToHostedFieldsInstance.bind(
      this
    );
  }

  componentDidMount() {
    braintreeClient
      .getClientInstance()
      .then(instance => {
        createHostedFields(
          {
            client: instance,
            styles: HOSTED_FIELDS_STYLE,
            fields: {
              number: {
                selector: '#card-number',
                placeholder: t("CARD_NUMBER")
              },
              cvv: {
                selector: '#cvv',
                placeholder: t("CSC")
              },
              expirationMonth: {
                selector: '#expiration-month',
                placeholder: t("MM")
              },
              expirationYear: {
                selector: '#expiration-year',
                placeholder: t("YYYY")
              }
            }
          },
          (err, hostedFieldsInstance) => {
            this.props.actions.onHostedFieldsCreated(err, hostedFieldsInstance);

            if (err) {
              return;
            }

            this.bindEventsToHostedFieldsInstance(hostedFieldsInstance);
            this.setState({ isLoading: false });
          }
        );
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
      if(stateKey === 'cvvStatus') {
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

  render() {
    const {
      isShown,
      isRememberCreditCard,
      hasCardList,
      actions,
      errorMsg
    } = this.props;
    const {
      cardType,
      numberStatus,
      expirationMonthStatus,
      expirationYearStatus,
      cvvStatus,
      isLoading,
      paymentTypes
    } = this.state;
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

    const containerClass = classNames('credit-card-from');

    return (
      <div className={containerClass}>
        {isLoading ? <XLoading  backgroundColor="rgba(255,255,255,0.6)" /> : null}
        <form onSubmit={actions.onSubmit}>
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
            <div className="pay-types-image-container">
              {paymentTypes.map(item => {
                return (
                  <img
                    className="payment-image"
                    src={`/clientassets/portal/template-resources/images/bill/${item}.png`}
                  />
                );
              })}
            </div>
            {/* <img src="/clientassets/portal/template-resources/images/bill/Billing_CC_All.png" alt=""/> */}
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
            <label className="label" htmlFor="cvv">CSC: </label>
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
          <button type="submit" className="start-pro-button">
            {t('START_PRO_PLAN')}
          </button>
        </form>
      </div>
    );
  }
}

UseNewCreditCard.propTypes = {
  errorMsg: PropTypes.string.isRequired,
  actions: PropTypes.shape({
    onHostedFieldsCreated: PropTypes.func.isRequired,
    toggleCardInputMethod: PropTypes.func.isRequired,
    toggleRememberCreditCard: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }).isRequired
};
