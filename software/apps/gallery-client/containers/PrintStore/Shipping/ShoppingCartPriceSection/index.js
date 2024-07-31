import classnames from 'classnames';
import React, { Component } from 'react';

import { formatCurrency, needFormatCurrencyCountryMap } from '@resource/lib/utils/currency';
import { getLanguageCode } from '@resource/lib/utils/language';

import BillingProPlanModal from '@apps/gallery-client/components/en/BillingProPlanModal';
import CouponCodeApplyModal from '@apps/gallery-client/components/en/CouponCodeApplyModal';
import CreditApplyModal from '@apps/gallery-client/components/en/CreditApplyModal';
import StudioSampleApplyModal from '@apps/gallery-client/components/en/StudioSampleApplyModal';
import SubscribeToProPlanModal from '@apps/gallery-client/components/en/SubscribeToProPlanModal';
import { getCreditShowEntrance } from '@apps/gallery-client/services/cart';

import './index.scss';

class ShoppingCartPriceSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCreditButton: false,
      showCreditModal: false,
      showCouponCodeModal: false,
      showStudioSampleModal: false,
      showSubscribeToProPlanModal: false,
      showBillingProPlanModal: false,
    };
    this.toogleCreditModal = this.toogleCreditModal.bind(this);
    this.toogleStudioSampleModal = this.toogleStudioSampleModal.bind(this);
    this.toogleCouponCodeApplyModal = this.toogleCouponCodeApplyModal.bind(this);
    this.toggleSubscribeToProPlanModal = this.toggleSubscribeToProPlanModal.bind(this);
    this.toggleBillingProPlanModal = this.toggleBillingProPlanModal.bind(this);
  }

  toogleCouponCodeApplyModal() {
    const { isCheckout } = this.props;
    const eventName = isCheckout
      ? 'US_PC_Checkout_ApplyCouponCodeInCheckout'
      : 'US_PC_Cart_ApplyCouponCodeInCart';
    window.logEvent.addPageEvent({
      name: eventName,
      timestamp: Date.now(),
    });

    this.setState({
      showCouponCodeModal: !this.state.showCouponCodeModal,
    });
  }

  toogleCreditModal() {
    const { isCheckout } = this.props;
    const eventName = isCheckout
      ? 'US_PC_Checkout_ApplyStoreCreditInCheckout'
      : 'US_PC_Cart_ApplyStoreCreditInCart';
    window.logEvent.addPageEvent({
      name: eventName,
      timestamp: Date.now(),
    });

    this.setState({
      showCreditModal: !this.state.showCreditModal,
    });
  }

  toogleStudioSampleModal() {
    this.setState({
      showStudioSampleModal: !this.state.showStudioSampleModal,
    });
  }

  toggleSubscribeToProPlanModal() {
    this.setState({
      showSubscribeToProPlanModal: !this.state.showSubscribeToProPlanModal,
    });
  }

  toggleBillingProPlanModal() {
    this.setState({
      showBillingProPlanModal: !this.state.showBillingProPlanModal,
    });
  }

  componentDidMount() {
    // getCreditShowEntrance()
    //   .then(data => {
    //     this.setState({showCreditButton: data});
    //   })
  }

  render() {
    const {
      price,
      currency,
      countryCode,
      refreshPageData,
      isCheckout,
      isSubscribeProPlan = false,
      onSubscribeProPlanSuccess,
      additionalData,
    } = this.props;
    const {
      showCreditButton,
      showCreditModal,
      showCouponCodeModal,
      showStudioSampleModal,
      showSubscribeToProPlanModal,
      showBillingProPlanModal,
    } = this.state;
    const { code, symbol } = currency;
    const { item_total, item_discount, payable_amount, shipping_fee, tax, total_money } = price;
    const shoppingCartPriceDetailCls = classnames('shopping-cart-price-detail', {
      'shopping-cart-price-detail-de': getLanguageCode() === 'de',
    });

    let formatItemTotal = `${symbol}${item_total}`;
    let formatCouponCount = `${symbol}${item_discount}`;
    let formatTotalMoney = `${symbol}${total_money}`;
    let formatFee = isCheckout ? `${symbol}${shipping_fee}` : '';
    let formatTax = isCheckout ? `${symbol}${tax}` : '';
    let formatPayableAmount = isCheckout ? `${symbol}${payable_amount}` : '';
    if (needFormatCurrencyCountryMap.includes(countryCode)) {
      formatItemTotal = formatCurrency(item_total);
      formatCouponCount = formatCurrency(item_discount);
      formatTotalMoney = formatCurrency(total_money);
      formatFee = isCheckout ? formatCurrency(shipping_fee) : '';
      formatTax = isCheckout ? formatCurrency(tax) : '';
      formatPayableAmount = isCheckout ? formatCurrency(payable_amount) : '';
    }

    return (
      <div className="shopping-cart-price-section">
        <div className={shoppingCartPriceDetailCls}>
          <ul>
            <li>
              <div className="price-left">{t('ITEMS_TOTAL')}:</div>
              <div className="price-right">{formatItemTotal}</div>
            </li>
            {!__isCN__ && (
              <li className="coupon_wrap">
                <div className="price-left">Coupon Code:</div>
                <div className="price-right">-{formatCouponCount}</div>
              </li>
            )}
            {/* checkout */}
            {isCheckout && (
              <li>
                <div className="price-left">{t('CHECKOUT_PRICE_SHIPPINT')}:</div>
                <div className="price-right">{formatFee}</div>
              </li>
            )}
            {isCheckout && !__isCN__ && (
              <li>
                <div className="price-left">{t('CHECKOUT_PRICE_TAX')}:</div>
                <div className="price-right">{formatTax}</div>
              </li>
            )}
            {isCheckout && (
              <li className="shipping-total">
                <div className="price-left">{t('CHECKOUT_PRICE_TOTAL')}:</div>
                <div className="price-right">
                  <span>{formatPayableAmount}</span>
                  {!__isCN__ && <span className="shipping-total-code">{code}</span>}
                </div>
              </li>
            )}
            {isSubscribeProPlan && (
              <li>
                <span className="subscribe-pro-plan" onClick={this.toggleSubscribeToProPlanModal}>
                  {t('SUBSCRIBE_TO_PRO_PLAN_AND_EARN')}
                </span>
              </li>
            )}
          </ul>
        </div>

        {!isCheckout && (
          <div className="shopping-cart-price-summary">
            <div className="subtotal-price-container">
              <span>{t('SUBTOTAL')}:</span>
              <span className="subtotal-price">{formatTotalMoney}</span>
              <span className="subtotal-price-code">{code}</span>
            </div>
          </div>
        )}

        {showCreditModal && (
          <CreditApplyModal refreshPageData={refreshPageData} closeModal={this.toogleCreditModal} />
        )}
        {showCouponCodeModal && (
          <CouponCodeApplyModal
            refreshPageData={refreshPageData}
            closeModal={this.toogleCouponCodeApplyModal}
            toogleStudioSampleModal={this.toogleStudioSampleModal}
          />
        )}
        {showStudioSampleModal && (
          <StudioSampleApplyModal
            refreshPageData={refreshPageData}
            closeModal={this.toogleStudioSampleModal}
          />
        )}
        {showSubscribeToProPlanModal && (
          <SubscribeToProPlanModal
            onSubscribe={this.toggleBillingProPlanModal}
            closeModal={this.toggleSubscribeToProPlanModal}
          />
        )}
        {showBillingProPlanModal && (
          <BillingProPlanModal
            onSubscribeProPlanSuccess={onSubscribeProPlanSuccess}
            closeModal={this.toggleBillingProPlanModal}
          />
        )}
      </div>
    );
  }
}

export default ShoppingCartPriceSection;
