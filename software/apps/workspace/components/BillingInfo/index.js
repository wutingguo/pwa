import React, { Component } from 'react';
import '../OrderList/table-grid.scss';
import { formatTime } from '../../utils/date';
import EditOrderAddressWrapper from '../EditOrderAddress';
import './index.scss';

class BillingInfo extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { data, showEditAddressModal } = this.props;
    const {
      orderNumber,
      orderAddress,
      showModifyAddressButton,
      serviceLevelName,
      orderPaymentMethod,
      appliedCoupon,
      deliveryEstimateTime,
    } = data;
    return (
      <div className="section billing-info">
        <div className="section-title">付款详情</div>
        <div className="section-content">
          <div className="grid">
            <div className="col col-2">地址</div>
            <div className="col col-10">
              <div className="address">{orderAddress}</div>
              {showModifyAddressButton ? (
                <a
                  className="edit-address"
                  href="javascript:;"
                  onClick={showEditAddressModal.bind(this, orderNumber)}
                >
                  修改地址
                </a>
              ) : null}
            </div>
          </div>
 {/*         <div className="grid">
            <div className="col col-2">快递类型</div>
            <div className="col col-10">{serviceLevelName}</div>
          </div>*/}
          <div className="grid">
            <div className="col col-2">支付方式</div>
            <div className="col col-10">{orderPaymentMethod}</div>
          </div>
          {/*<div className="grid">
            <div className="col col-2">优惠码</div>
            <div className="col col-10">{appliedCoupon}</div>
          </div>*/}
          <div className="grid">
            <div className="col col-2">预计送达时间</div>
            <div className="col col-10">{ deliveryEstimateTime ? formatTime(deliveryEstimateTime) : ''}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default EditOrderAddressWrapper(BillingInfo);
