import React, { Component } from 'react';
import XModal from '@common/components/XModal';
import { GoogleAndFacebookSubscribeProPlanEnv } from '@resource/websiteCommon/utils/googleAndFacebookTrack'
import CreditCardForm from '../BillingProPlan/_CreditCardForm';
import XLoading from '@common/components/XLoading';

import { payProPlanByToken } from '../BillingProPlan/_handleHelp';
import * as env from '@src/utils/env';

import './index.scss';

class BillingProPlanModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      saasBaseUrl: "",
      userInfo: {},
      hostedFieldsInstance: null,
      subscribeSuccess: false,
      isPaying: false,
      errorMsg: ''
    };

    this.onHostedFieldsCreated = this.onHostedFieldsCreated.bind(this);
    this.toggleCardInputMethod = this.toggleCardInputMethod.bind(this);
    this.toggleRememberCreditCard = this.toggleRememberCreditCard.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onSubscribeSuccess = this.onSubscribeSuccess.bind(this);
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
    const {
      onSubscribeProPlanSuccess,
      closeModal
    } = this.props;

    if (onSubscribeProPlanSuccess) {
      onSubscribeProPlanSuccess();
    }

    closeModal();
  }

  onSubmit(e) {
    e.preventDefault();
    const {
      isPaying,
      hostedFieldsInstance
    } = this.state;
    const self = this;
    if (!isPaying) {
      this.setState({ isPaying: true, errorMsg: '' });

      const finalHandle = (err, result = {}) => {
        this.setState({ isPaying: false });
        if (!err) {
          this.setState({
            subscribeSuccess: true
          });
          const { currency_code, subscription_id, purchase_amount } = result || {};
          const isNotEmpty = [currency_code, subscription_id, purchase_amount].every(Boolean);
          isNotEmpty && GoogleAndFacebookSubscribeProPlanEnv({ currency_code, subscription_id, purchase_amount });
          this.onSubscribeSuccess();
        } else {
          this.setState({
            errorMsg: err
          });
        }
      };
      hostedFieldsInstance.tokenize((err, payload) => {
        console.log('payload: ', payload)
        console.log('err: ', err)
        if (err) {
          this.setState({
            errorMsg: err.message,
            isPaying: false
          });
          return;
        }
        payProPlanByToken(self, payload.nonce, null, finalHandle);
      });
    }
  }

  async componentDidMount() {
    const data = await env.getEnv();
    if (data && data.env) {
      this.setState({
        saasBaseUrl: data.env.saasBaseUrl
      });
    }
  }

  render() {
    const {
      closeModal
    } = this.props;

    const { errorMsg, isPaying } = this.state;

    const pageTitle = t('SUBSCRIBE_PRO_PLAN');

    const xmodalProps = {
      data: {
        title: t("SUBSCRIBE_PRO_PLAN"),
        className: 'billing-pro-plan-modal'
      },
      actions: {
        handleClose: closeModal
      }
    };

    return (
      <XModal {...xmodalProps}>
        <div className="billing-pro-plan-modal-content">
          {isPaying ? <XLoading backgroundColor="rgba(255,255,255,0.6)" /> : null}
          <CreditCardForm
            errorMsg={errorMsg}
            actions={{
              onHostedFieldsCreated: this.onHostedFieldsCreated,
              toggleCardInputMethod: this.toggleCardInputMethod,
              toggleRememberCreditCard: this.toggleRememberCreditCard,
              onSubmit: this.onSubmit
            }}
          />
        </div>
      </XModal>
    );
  }
}

export default BillingProPlanModal;
