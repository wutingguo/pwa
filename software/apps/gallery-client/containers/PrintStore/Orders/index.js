import { fromJS } from 'immutable';
import React, { Component, Fragment } from 'react';

import estoreService from '@apps/estore/constants/service';
import { getOrderDetail } from '@apps/gallery-client/services/cart';

import { renderOrderList } from './_renderHelp';

import './index.scss';

const createPayName = payment_method => {
  const map = {
    PAYPAL: 'PayPal',
    OFFLINE: 'Offline Payment',
    STRIPE: 'Credit or Debit Card (processed by Stripe)',
  };
  return map[payment_method];
};

const createStatusName = cstatus => {
  // CREATED Offline的状态
  const map = { CREATED: 'Pending Payment' };
  return map[cstatus] || t(`${cstatus}`);
};

export default class OrderDetail extends Component {
  constructor() {
    super();
    this.renderOrderList = renderOrderList.bind(this);
  }
  state = {
    fulfillmentType: 'auto',
    status: '0',
    detail: {},
    infoShow: false,
    payment_detail: {},
    item_detail: [],
    order_price: {},
    currency: {},
    trackPackage: {},
  };
  componentDidMount() {
    const pathSplit = location.hash.split('orders/');
    const { boundGlobalActions } = this.props;
    boundGlobalActions.getEnv().then(res => {
      const { env } = res;
      const baseUrl = env.estoreBaseUrl;
      const imageUrl = env.imgBaseUrl;
      const order_no = pathSplit[1];
      this.setState({
        baseUrl,
        order_no,
        imageUrl,
      });
      const params = {
        order_no,
        baseUrl,
      };
      estoreService.trackPackage({ baseUrl, order_no }).then(res => {
        const { data = {} } = res;
        console.log('data: ', data);
        this.setState({
          trackPackage: { ...data },
        });
      });
      getOrderDetail(params).then(res => {
        const { item_detail = [], detail = {} } = res;
        const { fulfill_type = 1 } = detail;

        this.setState({
          fulfillType: fulfill_type === 1 ? 'Automatic' : 'Self',
          isShowLoading: false,
        });
        this.initItemDetail(item_detail);
        this.setState(res);
      });
    });
  }

  openTrack = () => {
    const { track_package_url, shipment_number, courier } = this.state.trackPackage;
    if (track_package_url) {
      if (courier === 'EDHL') {
        window.open(track_package_url);
        return;
      }
      window.open(track_package_url + shipment_number);
    } else {
      this.setState({
        infoShow: !this.state.infoShow,
      });
    }
  };
  renderPayAddress = address => {
    let arr = [];
    for (let key in address) {
      if (address[key]) {
        arr.push(address[key]);
      }
    }
    return arr.join(', ');
  };

  initItemDetail = item_detail => {
    console.log('item_detail: ', item_detail);
    const { baseUrl, imageUrl } = this.state;
    const { urls } = this.props;
    const saasShareUrl = urls.get('estoreBaseUrl');
    let init_item_detail = [];
    const promiseArr = [];
    const list = [];
    item_detail.forEach((item, index) => {
      const { target_spu_uuid: spu_uuid, target_product_type } = item;
      const res = estoreService.getSpuDetail({ baseUrl, spu_uuid });
      promiseArr.push(res);
      if (target_product_type === 2) {
        list.push(item.cover_storage_path);
      }
    });
    if (!(list.length || promiseArr.length)) {
      return;
    }
    const imageUrlsPromise = estoreService.getImageUrls({
      baseUrl: saasShareUrl,
      asset_uuids: list.join(','),
    });
    promiseArr.push(imageUrlsPromise);

    Promise.all(promiseArr)
      .then(ret => {
        const res = ret.slice(0, ret.length - 1);
        init_item_detail = res.map((item, index) => {
          if (item.data && item.ret_code === 200000) {
            return {
              ...item.data,
              ...item_detail[index],
            };
          }
          return {
            ...item_detail[index],
          };
        });
        console.log(init_item_detail, 'init_item_detail');
        this.setState({
          item_detail: init_item_detail,
        });
      })
      .catch(err => {});
  };
  render() {
    const {
      detail: order_detail,
      payment_detail,
      order_price,
      trcakPackage,
      trackPackage,
      currency,
      infoShow,
    } = this.state;
    const { order_shipment = {}, payment_method, pay_transaction_id } = payment_detail;
    const { sub_total, shipping, tax, total, sku_discount } = order_price;
    const fufillmentName = ['self', 'Automatic'];

    const { supplier_name = '', fulfill_type } = order_detail;
    const { fulfillType } = this.state;
    const {
      ship_method_name = '',
      address = '',
      city = '',
      country_code = '',
      country_name = '',
      province = '',
      province_name = '',
      receiver_email = '',
      receiver_name = '',
      receiver_phone = '',
      zip_code = '',
      address2 = '',
    } = order_shipment;
    const pay_name = createPayName(payment_method);
    const fulFillName = `${supplier_name} (${fulfillType})`;
    const { symbol } = currency;
    const addressObj = {
      receiver_name,
      address,
      address2,
      city,
      province_name,
      zip_code,
      country_name,
      receiver_phone,
    };

    return (
      <div className="order_detail">
        <div className="order_info">
          <div className="d_title">Order Details</div>
          <div className="order_tb detail">
            <div className="column">
              <div className="tr">Order</div>
              <div className="td">{order_detail.order_number}</div>
            </div>
            <div className="column">
              <div className="tr">Order Date</div>
              <div className="td">{order_detail.order_date}</div>
            </div>
            <div className="column">
              <div className="tr">Order Status</div>
              <div className="td">{createStatusName(order_detail.cstatus)}</div>
            </div>
            {order_detail.cstatus === 'IN_SHIPPING' ? (
              <div className="trackWrapper">
                <div className="trackButton" onClick={this.openTrack}>
                  {t('TRACK_PACKAGE')}
                </div>
                {infoShow && (
                  <div className="trackInfo">
                    {trackPackage.courier && trackPackage.shipment_number ? (
                      <Fragment>
                        <div style={{ width: 'max-content' }}>Carrier: {trackPackage.courier}</div>
                        <div style={{ width: 'max-content' }}>
                          Tracking Number: {trackPackage.shipment_number}
                        </div>
                      </Fragment>
                    ) : (
                      <div style={{ width: 'max-content' }}>No shipping needed</div>
                    )}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
        <div className="pay_info">
          <div className="d_title">Payment Details</div>
          <div className="row">
            <span className="title">Address</span>
            <span className="info">{this.renderPayAddress(addressObj)}</span>
          </div>
          <div className="row">
            <span className="title">Shipping Method</span>
            <span className="info">{ship_method_name}</span>
          </div>
          <div className="row">
            <span className="title">Payment Method</span>
            <span className="info">{pay_name}</span>
          </div>
        </div>
        <div className="d_detail">
          <div className="d_title">Item Details</div>
          <div className="order_tb">
            <div className="th">
              <div className="td">Display</div>
              <div className="td">item</div>
              <div className="td">Unit Price</div>
              <div className="td">Quantity</div>
              <div className="td">Unit Total</div>
            </div>
            {this.renderOrderList(this)}
          </div>
        </div>
        <div className="order_price">
          <div className="price">
            Subtotal:{' '}
            <span>
              {symbol}
              {sub_total}
            </span>
          </div>
          {!__isCN__ ? (
            <div className="price">
              Coupon Code:{' '}
              <span>
                -{symbol}
                {sku_discount}
              </span>
            </div>
          ) : null}
          <div className="price">
            Shipping:{' '}
            <span>
              {symbol}
              {shipping}
            </span>
          </div>
          <div className="price">
            Tax:{' '}
            <span>
              {symbol}
              {tax}
            </span>
          </div>
          <div className="price">
            Order Total:{' '}
            <span>
              {symbol}
              {total}
            </span>
          </div>
        </div>
      </div>
    );
  }
}
