import React, { Component, useEffect } from 'react';

import './index.scss';

function goDetail(url, history) {
  window.logEvent.addPageEvent({
    name: 'Estore_Orders_Click_View',
  });
  history.push(url);
}
export default function OrderList(props) {
  const { orderList, history, translateStatus } = props;
  const initOrderList =
    orderList &&
    orderList.map(item => {
      return {
        url: `/software/e-store/orders/${item.orderId}`,
        ...item,
      };
    });

  return (
    <div className="list_wrap">
      {initOrderList && initOrderList.length > 0 ? (
        initOrderList.map(item => {
          const {
            store_order_no: order_no,
            production_order_status: order_status,
            customer_name: customer,
            collection_name,
            create_time: order_date,
            pay_amount: grand_total,
            order_currency_symbol,
            fulfill_name,
          } = item;
          const url = `/software/e-store/orders/${order_no}`;
          // let fulfillment = `${supplier_name || 'Custom'} (${fullmentName[fulfill_type]})`;
          const fulfillment = fulfill_name;

          const status = translateStatus(order_status).status;
          return (
            <div className="order_item">
              <span
                className="order_no"
                onClick={() => {
                  goDetail(url, history);
                }}
              >
                {order_no}
              </span>
              <span>{status}</span>
              <span className="ellipsis" title={customer}>
                {customer}
              </span>
              <span>{collection_name}</span>
              <span>{fulfillment}</span>
              <span>{order_date}</span>
              <span>{(__isCN__ ? '¥' : order_currency_symbol) + grand_total}</span>
              <span>
                <a
                  className="view"
                  onClick={() => {
                    goDetail(url, history);
                  }}
                >
                  {__isCN__ ? '查看' : 'View'}
                </a>
              </span>
            </div>
          );
        })
      ) : (
        <div className="no_order">{t('EMPTY_ORDER')}</div>
      )}
    </div>
  );
}
