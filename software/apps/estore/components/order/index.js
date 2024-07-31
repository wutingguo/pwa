import React, { Component } from 'react';

import XLoading from '@resource/components/XLoading';

import estoreService from '@apps/estore/constants/service';

import { translateStatus } from './orderDetail/_renderHelp';
import OrderHeader from './orderHeader';
import OrderList from './orderList';

import './index.scss';

class Order extends Component {
  state = {
    orderList: [],
    orderTitleList: [
      { title: t('ORDER_NUM', 'Order') },
      { title: t('STATUS', 'Status') },
      { title: t('CUSTOMER', 'Customer') },
      { title: t('COLLECTION', 'Collection') },
      { title: t('FULFILLMENT', 'Fulfillment') },
      { title: t('ORDER_DATE', 'Order Date') },
      { title: t('GRAND_TOTAL', 'Grand Total') },
      { title: t('ACTION', 'Action') },
    ],
    filterProps: {},
  };
  componentDidUpdate(preProps) {
    const { estoreInfo } = this.props;
    const { estoreInfo: preEstoreInfo } = preProps;
    const store_id = estoreInfo.id;
    const preStoreId = preEstoreInfo.id;
    if (store_id !== preStoreId) {
      this._getOrderList();
    }
  }
  _getOrderList = () => {
    const { estoreInfo, urls } = this.props;
    const store_id = estoreInfo.id;
    if (!store_id) return;
    this.setState({
      loading: true,
    });

    const estoreBaseUrl = urls.get('estoreBaseUrl');
    estoreService.getOrderlist({ baseUrl: estoreBaseUrl, store_id }).then(res => {
      this.setState({
        orderList: res.data.records,
        // orderList: [],
        loading: false,
      });
    });
  };
  componentDidMount() {
    this._getOrderList();
  }

  render() {
    const { orderTitleList, orderList, filterProps, loading } = this.state;
    const orderListProps = {
      orderList,
      history: this.props.history,
      filterProps,
      translateStatus: status => translateStatus(this, status),
    };

    return (
      <div className="order_content">
        <XLoading isShown={loading} />
        <div class="store-common-header">
          <div class="store-common-header__title">{t('ESTPRE_ORDERS')}</div>
          <div class="store-common-header__options"></div>
        </div>
        <div className="order_list">
          {orderList && orderList.length > 0 && <OrderHeader headList={orderTitleList} />}
          <OrderList {...orderListProps} />
        </div>
      </div>
    );
  }
}

export default Order;
