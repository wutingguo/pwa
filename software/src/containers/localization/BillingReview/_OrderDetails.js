import React from 'react';
import { format } from '@resource/lib/utils/timeFormat';
import Title from './_Title';

export default (props) => {
  const { detailData } = props;
  const {
    order_number,
    plan_name_list = [],
    end_date
  } = detailData;
  return (
    <div>
      <Title title={"订单详情"} />
      {
          <div className="order-wrapper">
            <div className="order-wrap">
              <div className="order">
                <span className="label"> 订单编号: </span>
                <span className="value"> {order_number} </span>
              </div>
              <div className="order">
                <span className="label"> 订阅版本: </span>
                <span className="value"> {Array.isArray(plan_name_list) && plan_name_list.join('；')} </span>
              </div>
              <div className="order">
                <span className="label"> 到期时间: </span>
                <span className="value"> {format(end_date)} </span>
              </div>
              <div className="order">
                <span className="label"> 请在 </span>
                <span className="hint"> 24小时 </span>
                <span className="label"> 内完成付款，否则系统将取消订单 </span>
              </div>
            </div>
          </div>
      }
    </div>
  )
}
