import React, { Component } from 'react';

import * as xhr from '@resource/websiteCommon/utils/xhr';
import { template } from 'lodash';
import { getQueryStringObj } from '../../../utils/url';
import {
  GET_ORDER_PROCESS_DETAIL_EN,
  GET_ORDER_ITEM_DETAIL_EN,
  GET_BASE_ORDER_DETAIL_EN
} from '../../../constants/apiUrl';
import LoadingImg from '@common/components/LoadingImg';

import OrderInfo from '../../../components/en/OrderInfo';
import OrderItems from '../../../components/en/OrderItems';
import BillingInfo from '../../../components/en/BillingInfo';
import OrderStatus from '../../../components/en/OrderStatus';

import { getUrlParam } from '@resource/lib/utils/url';

import { serviceTypeMap } from '../../../constants/strings';

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
    // design service订单
    // 订单类型 默认值：0  design services：1
    this.serviceTypeNum = Number(getUrlParam("serviceTypeNum"));
    this.isDSOrder = serviceTypeMap.DESIGN_SERVICE == this.serviceTypeNum;

  }

  componentDidMount() {
    const qs = getQueryStringObj();
    const { id, oID } = qs;
    let orderID = id || oID;

    Promise.all([
      this.getProcessData(orderID),
      this.getItemData(orderID),
      this.getBaseData(orderID)
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
        console.log('Connect failed!', err);
        this.setState({
          isDataLoaded: false
        });
      });
  }

  getWWWorigin = () => {
    const { envUrls } = this.props;
    const baseUrl = envUrls.get('baseUrl');
    return baseUrl
  }

  getProcessData(orderNumber) {
    const url = template(GET_ORDER_PROCESS_DETAIL_EN)({
      baseUrl: this.getWWWorigin(),
      orderNumber,
      serviceTypeNum: this.serviceTypeNum
    });
    return this.getData(url);
  }

  getItemData(orderNumber) {
    const url = template(GET_ORDER_ITEM_DETAIL_EN)({
      baseUrl: this.getWWWorigin(),
      orderNumber,
      serviceTypeNum: this.serviceTypeNum
    });
    return this.getData(url);
  }

  getBaseData(orderNumber) {
    const url = template(GET_BASE_ORDER_DETAIL_EN)({
      baseUrl: this.getWWWorigin(),
      orderNumber,
      serviceTypeNum: this.serviceTypeNum
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

  backOrder = () => {
    this.props.history.push('/software/designer/my-orders')
  }

  render() {
    const { isDataLoaded, processData, itemData, baseOrderData } = this.state;
    const arrowStr = '<';

    return (
      <div className="order-detail-container">
        <h2 className="order-page-title">{t('MY_ORDER_DETAILS')}</h2>
        {isDataLoaded ? (
          <div className="order-detail">
            <div className="section">
              <div className="back-order" onClick={this.backOrder}>{`${arrowStr} ${t('ALL_ORDERS')}`}</div>
            </div>
            <OrderStatus data={processData} />

            <OrderInfo data={baseOrderData} />

            <OrderItems data={itemData} isDSOrder={this.isDSOrder} />

            <BillingInfo data={baseOrderData} isDSOrder={this.isDSOrder} history={this.props.history} />
            <div className="section-bottom-line">
              <div className="back-order" onClick={this.backOrder}>{`${arrowStr} ${t('ALL_ORDERS')}`}</div>
            </div>
          </div>
        ) : (
          <LoadingImg />
        )}
      </div>
    );
  }
}
