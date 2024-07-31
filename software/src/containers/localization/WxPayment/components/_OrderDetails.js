import React from 'react';
// import '../index.scss';

export default ({ orderNumber, orderAmount }) => {
  return (
    <div className="order-wrapper">
      <div className="order-wrap">
        <div className="order">
          <span className="label"> 请及时支付，以便我们更快处理您的订单</span>
        </div>
        <div className="order-detail-warp">
          <div>
            <div className="order">
              <span className="label"> 订单编号: </span>
              <span className="value"> {orderNumber} </span>
            </div>
            <div className="order">
              <span className="label"> 请在 </span>
              <span className="hint"> 24小时 </span>
              <span className="label"> 内付款，否则交易会被取消 </span>
            </div>
          </div>
          <div>
            <div className="amount">
              <span className="label"> 总金额：</span>
              <span className="label"> ￥{orderAmount} </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
