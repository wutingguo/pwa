import { isEqual } from 'lodash';
import React, { Component } from 'react';

import {
  formatCurrency,
  getFormatCurrency,
  needFormatCurrencyCountryMap,
} from '@resource/lib/utils/currency';

import XLoading from '@common/components/XLoading';
import XRadio from '@common/components/XRadio';

import airplaneHightlight from '@common/icons/airplane-highlight.svg';
import airplane from '@common/icons/airplane.svg';
import dropshipHighlight from '@common/icons/dropship_highlight.svg';
import dropship from '@common/icons/dropship_normal.svg';
import standardHighlight from '@common/icons/standard-highlight.svg';
import standard from '@common/icons/standard-normal.svg';

import BillingProPlanModal from '@apps/gallery-client/components/en/BillingProPlanModal';
import DropShipServiceSubscribeToProPlanModal from '@apps/gallery-client/components/en/DropShipServiceSubscribeToProPlanModal';
import {
  changeDropShip,
  changeShippingMethod,
  saveShipMethod,
} from '@apps/gallery-client/services/cart';

import './index.scss';

class ShippingMethod extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingData: false,
      showBillingProPlanModal: false,
      showSubscribeToProPlanModal: false,
    };
  }

  componentDidUpdate(preProps) {
    if (__isCN__) {
      const { methods: preMethods, current_method_id: preCurrent_method_id } = preProps;
      const { methods, current_method_id, dropServiceData } = this.props;
      if (!isEqual(preMethods, methods) && methods.length && Object.keys(dropServiceData).length) {
        if (current_method_id) {
          this.onToggleMethod('', current_method_id);
        } else {
          this.onToggleMethod('', 'FES');
        }
      }
    }
  }

  onToggleMethod = (method_id, code) => {
    const { onDisabledBtn, dropServiceData, rack_id, cartMethod, estoreBaseUrl } = this.props;
    const baseUrl = estoreBaseUrl;
    const { cart_items } = dropServiceData;
    this.setState({
      isLoadingData: true,
    });
    if (!cartMethod?.method_id) {
      console.error('cartMethod', cartMethod);
    }
    window.logEvent.addPageEvent({
      name: 'ClientEstore_Shipping_Click_ChangeShippingMethod',
    });
    let supplierIdArr = [];
    if (cart_items && cart_items.length) {
      cart_items.forEach(i => {
        supplierIdArr.push(i.supplier_id);
      });
    }
    onDisabledBtn();
    saveShipMethod(
      {
        id: cartMethod?.method_id,
        supplier_id: [...new Set(supplierIdArr)],
        rack_id: +rack_id,
        ship_method: code,
      },
      baseUrl
    )
      .then(data => {
        window.logEvent.addPageEvent({
          name: 'US_PC_Checkout_ChangeShippingMethodInCheckout',
          timestamp: Date.now(),
          serviceName: code,
        });
        this.props.getCurrentCartData(true, true).then(() => {
          this.setState({
            isLoadingData: false,
          });
        });
      })
      .catch(() => {
        this.setState({
          isLoadingData: false,
        });
      });
  };

  onBeforeDropShipService = () => {
    this.toggleSubscribeToProPlanModal();
  };
  onDropShipService = added => {
    const { refreshPageData, onDisabledBtn, isShowGuideSubscribeProplan } = this.props;

    if (isShowGuideSubscribeProplan) {
      this.onBeforeDropShipService();
      return;
    }
    this.setState({
      isLoadingData: true,
    });
    onDisabledBtn();
    changeDropShip(added)
      .then(data => {
        refreshPageData(data, !added);
        this.setState({
          isLoadingData: false,
        });
      })
      .catch(() => {
        this.setState({
          isLoadingData: false,
        });
      });
  };

  renderMethods = () => {
    const {
      methods,
      currency,
      current_method_id,
      dropServiceData = {},
      holiday_message,
      is_in_holiday,
      countryCode,
      isThirdOrder,
    } = this.props;
    // const { show_entrance, added, drop_ship_base_data } = dropServiceData;

    return (
      <div className="methods-items">
        <div className="methods-wrap">
          {methods.map(method => {
            let iconSrc = '';
            if (method.code === 'FES') {
              iconSrc = standard;
              if (method.code === current_method_id) {
                iconSrc = standardHighlight;
              }
            } else {
              iconSrc = airplane;
              if (method.code === current_method_id) {
                iconSrc = airplaneHightlight;
              }
              if (isThirdOrder) iconSrc = '';
            }

            let formatShippingCost = `${currency['symbol'] || ''}${method.shipping_cost}`;
            if (needFormatCurrencyCountryMap.includes(countryCode)) {
              formatShippingCost = formatCurrency(method.shipping_cost);
            }

            return (
              <div
                key={method.id}
                className="method-item"
                onClick={() => this.onToggleMethod(method.id, method.code)}
              >
                <div className="method">
                  <XRadio
                    skin="blue"
                    name={method.code}
                    text={method.name}
                    checked={method.code === current_method_id}
                    className="method-radio"
                  />
                  <div className="method-cost">
                    <span>{formatShippingCost}</span>
                    {iconSrc ? <img src={iconSrc} /> : null}
                  </div>
                </div>
                <div className="method-desc">
                  <div className="method-describe" title={method.describe}>
                    {method.describe}
                  </div>
                </div>
              </div>
            );
          })}
          {methods.length === 0 && <div>{t('SHIPPING_TIPS')}</div>}

          <span className="holiday-message">{is_in_holiday ? holiday_message : ''}</span>
        </div>
      </div>
    );
  };

  toggleBillingProPlanModal = () => {
    this.setState({
      showBillingProPlanModal: !this.state.showBillingProPlanModal,
    });
  };

  toggleSubscribeToProPlanModal = () => {
    this.setState({
      showSubscribeToProPlanModal: !this.state.showSubscribeToProPlanModal,
    });
  };
  subscribeProPlanSuccess = () => {
    const { dropServiceData = {}, onSubscribeProPlanSuccess } = this.props;
    const { added } = dropServiceData;
    onSubscribeProPlanSuccess && onSubscribeProPlanSuccess();
    this.onDropShipService(added);
  };
  render() {
    const { methods, isPureDigital } = this.props;
    const { isLoadingData, showSubscribeToProPlanModal, showBillingProPlanModal } = this.state;

    return methods ? (
      <div className="shipping-methods-wrap">
        <div className="shipping-header">
          <span className={`shipping-header-topic ${isPureDigital ? 'pureDigital' : ''}`}>
            {t('CHECKOUT_SHIPPING_METHOD')}
          </span>
        </div>
        <div className="shipping-methods-content">
          {isPureDigital ? t('DIGITAL_SHIPPING_METHOD_TIPS') : this.renderMethods()}
        </div>
        {showSubscribeToProPlanModal && (
          <DropShipServiceSubscribeToProPlanModal
            onSubscribe={this.toggleBillingProPlanModal}
            closeModal={this.toggleSubscribeToProPlanModal}
          />
        )}
        {showBillingProPlanModal && (
          <BillingProPlanModal
            onSubscribeProPlanSuccess={this.subscribeProPlanSuccess}
            closeModal={this.toggleBillingProPlanModal}
          />
        )}
      </div>
    ) : null;
  }
}

export default ShippingMethod;
