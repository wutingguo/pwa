import React, { Component, Fragment } from 'react';
import '../OrderList/table-grid.scss';
import './index.scss';
import { relativeUrl } from '@resource/lib/utils/language';
import XLink from '@resource/components/XLink';
import { navigateToWwwOrSoftware } from '@resource/lib/utils/history';

class BillingInfo extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // design service订单
    // 订单类型 默认值：0  design services：1
    const { data, isDSOrder, history } = this.props;
    const {
      orderNumber,
      orderAddress,
      showModifyAddressButton,
      serviceLevelName,
      orderPaymentMethod,
      appliedCoupon,
      deliveryEstimateTimeRange,
      downloadReceiptUrl
    } = data;

    const divStyle = {
      'border-bottom': 'none'
    }
    return (
      <div className="section billing-info" style={divStyle} >
        <div className="section-title">{t('PAYMENT_DETAILS')}</div>
        <div className="section-content">
          {
            !isDSOrder && <div> 
            <div className="grid">
              <div className="col col-2">{t('ADDRESS')}</div>
              <div className="col col-10">
                <div className="address">{orderAddress}</div>
                {showModifyAddressButton ? (
                  <XLink
                    className="edit-address"
                    onClick={() => location.href = `/manage-address.html?from=saas&orderNumber=${orderNumber}&requestFrom=orderDetail&a_type=o_s_a`}
                    target="_blank"
                  >
                    {t('CHANGE_ADDRESS')}
                  </XLink>
                ) : null}
              </div>
            </div>
            <div className="grid">
                <div className="col col-2">{t('SHIPPING_METHOD')}</div>
                <div className="col col-10">{serviceLevelName}</div>
              </div>
            </div>
          }
          <div className="grid">
            <div className="col col-2">{t('PAYMENT_METHOD')}</div>
            <div className="col col-10">
              <div className="receipt">
                {orderPaymentMethod.length > 0 ? <div className="payment" >{orderPaymentMethod}</div> : null}
                <a target="blank" href={downloadReceiptUrl} className="receipt-fonts">{t('DOWNLAOD_RECEIPT')}</a>
              </div>
            </div>
          </div>
          {/* <div className="grid">
            <div className="col col-2">优惠码</div>
            <div className="col col-10">{appliedCoupon}</div>
          </div> */}
          <div className="grid">
            <div className="col col-2">{t('DELIVERY_ESTIMATE')}</div>
            <div className="col col-10">{deliveryEstimateTimeRange}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default BillingInfo;
