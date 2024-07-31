import React, { Component } from 'react';

import * as xhr from '@resource/websiteCommon/utils/xhr';
import { template } from '../../../utils/template';
import { getQueryStringObj } from '../../../utils/url';
import {
  GET_ORDER_PROCESS_DETAIL,
  GET_ORDER_ITEM_DETAIL,
  GET_BASE_ORDER_DETAIL
} from '../../../constants/apiUrl';

import LoadingImg from '@common/components/LoadingImg';

import OrderInfo from '../../../components/OrderInfo';
import OrderItems from '../../../components/OrderItems';
import BillingInfo from '../../../components/BillingInfo';
import OrderStatus from '../../../components/OrderStatus';

import './index.scss';

export default class OrderDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      processData: null,
      itemData: null,
      baseOrderData: null,
      isDataLoaded: false
    };

    this.getData = this.getData.bind(this);
    this.getProcessData = this.getProcessData.bind(this);
    this.getItemData = this.getItemData.bind(this);
    this.getBaseData = this.getBaseData.bind(this);
    this.refreshData = this.refreshData.bind(this);
    this.getWWWorigin = this.getWWWorigin.bind(this);
    this.backOrder = this.backOrder.bind(this);
  }

  componentDidMount() {
    this.refreshData();
  }

  backOrder() {
    this.props.history.goBack()
  }

  getWWWorigin() {
    const { envUrls } = this.props;
    const baseUrl = envUrls.get('baseUrl');
    return baseUrl
  }

  refreshData() {
    const qs = getQueryStringObj();
    const { id } = qs;

    Promise.all([
      this.getProcessData(id),
      this.getItemData(id),
      this.getBaseData(id)
    ])
      .then(result => {
        const [processData, itemData, baseOrderData] = result;
        this.setState({
          processData,
          itemData,
          baseOrderData,
          isDataLoaded: true
        });
      })
      .catch(err => {
        console.log('接口请求失败！', err);
        this.setState({
          isDataLoaded: false
        });
      });
  }

  getItemData(orderNumber) {
    const url = template(GET_ORDER_ITEM_DETAIL, {
      baseUrl: this.getWWWorigin(),
      orderNumber
    });
    return this.getData(url);
  }

  getBaseData(orderNumber) {
    const url = template(GET_BASE_ORDER_DETAIL, {
      baseUrl: this.getWWWorigin(),
      orderNumber
    });
    return this.getData(url);
  }

  getProcessData(orderNumber) {
    const url = template(GET_ORDER_PROCESS_DETAIL, {
      baseUrl: this.getWWWorigin(),
      orderNumber
    });
    return this.getData(url);
  }

  getData(url) {
    return new Promise((resolve, reject) => {
      xhr.get(url).then(result => {
        const { success, data } = result;
        if (success) {
          resolve(data);
        } else {
          reject();
        }
      });
    });
  }

  render() {
    const { isDataLoaded, processData, itemData, baseOrderData } = this.state;
    const arrowStr = '<';

    return (
      <div className="order-detail-container">
        <div className="detail-title">订单详情</div>
        {isDataLoaded ? (
          <div className="order-detail">
            <div className="section">
              <div className="back-order" onClick={this.backOrder}>{arrowStr} 全部订单</div>
            </div>

            <OrderInfo data={baseOrderData} {...this.props} />

            <OrderItems data={itemData} {...this.props} />

            <BillingInfo data={baseOrderData} refreshData={this.refreshData} {...this.props} />

            <OrderStatus data={processData} {...this.props} />

            <div className="section">
              <div className="back-order" onClick={this.backOrder}>{arrowStr} 全部订单</div>
            </div>
          </div>
        ) : (
          <LoadingImg />
        )}
      </div>
    );
  }
}
