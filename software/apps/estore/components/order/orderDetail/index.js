import React, { Component } from 'react';
import { Fragment } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import loadingImg from '@common/components/XLoading/icon/loading.svg';

import { XLoading } from '@common/components';

import { SEND_PHOTO_DOWNLOADS_MODAL } from '@apps/estore/constants/modalTypes';
import estoreService from '@apps/estore/constants/service';

import { orderPayName } from '../../../constants/strings';
import { orderStatusType } from '../../../constants/strings';

import {
  ExportOrder,
  MarkAsPaid,
  MarkStatus,
  ViewOrder,
  cancelOrder,
  getEstoreDetail,
  getTrackPackage,
  handleDownload,
  openOrderDetails,
  openProject,
  sendToLab,
  showCostModal,
  showDiscountModal,
  trackPackage,
} from './_handleHelp';
import { renderOptionBtns, renderOrderList, renderPayAddress, renderStatus } from './_renderHelp';

import './index.scss';

export default class OrderDetail extends Component {
  constructor() {
    super();
    this.sendToLab = () => sendToLab(this);
    this.cancelOrder = () => cancelOrder(this);
    this.MarkStatus = status => MarkStatus(this, status);
    this.ExportOrder = item_id => ExportOrder(this, item_id);
    this.ViewOrder = (enc_item_id, urls) => ViewOrder(this, enc_item_id, urls);
    this.trackPackage = () => trackPackage(this);
    this.getEstoreDetail = () => getEstoreDetail(this);
    this.getTrackPackage = () => getTrackPackage(this);
    this.MarkAsPaid = () => MarkAsPaid(this);
    this.showCostModal = () => showCostModal(this);
    this.showDiscountModal = arg => showDiscountModal(this, arg);
    this.openOrderDetails = () => openOrderDetails(this);
    this.renderOptionBtns = renderOptionBtns.bind(this);
    this.renderStatus = renderStatus.bind(this);
    this.renderOrderList = renderOrderList.bind(this);
    this.openProject = openProject.bind(this);
    this.renderPayAddress = renderPayAddress.bind(this);
    this.handleDownload = order_item_id => handleDownload(this, order_item_id);
    this.initItemDetail = this.initItemDetail.bind(this);
    this.handleSend = this.handleSend.bind();
  }
  state = {
    fulfillmentType: '1',
    status: '0',
    detail: {},
    payment_detail: {},
    item_detail: [],
    order_price: {},
    currency: {},
    productTabs: [],
    curTab: 0,
  };

  timer = null;

  componentDidMount() {
    const pathSplit = location.pathname.split('orders/');
    const node = document.getElementById('estore-wrapper');
    node.scrollIntoView(true);
    const { estoreInfo, urls } = this.props;

    const store_id = estoreInfo.id;
    const baseUrl = urls.get('estoreBaseUrl');
    const order_no = pathSplit[1];
    this.setState(
      {
        baseUrl,
        order_no,
      },
      () => {
        this.getEstoreDetail(this);
      }
    );
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  initItemDetail = item_detail => {
    const { baseUrl, detail } = this.state;

    const getProductType = name => {
      // const auto = __isCN__ ? '自动' : 'Auto';
      // const self = __isCN__ ? '手动' : 'Self';
      if (name === t('AUTO_PRODUCT')) {
        return {
          productType: 1,
          renderBtn: that => {
            const {
              detail: { cstatus },
            } = that.state;
            if (cstatus === orderStatusType.PAID) {
              return (
                <div onClick={this.sendToLab} className="sendToLab">
                  {t('SEND_TO_LAB', 'Send To Lab')}
                </div>
              );
            }
            return <Fragment />;
          },
        };
      } else if (name === t('SELF_PRODUCT')) {
        return {
          productType: 2,
        };
      }
      return {
        productType: 4,
        renderBtn: this.renderSendPhotoDownload,
      };
    };
    const { fulfill_name } = detail;
    const tabs = fulfill_name
      .split('+')
      .map(item => ({
        key: item,
        // name: item === 'Digital' ? 'Digital' : `${item}${__isCN__ ? '履约' : ' Fulfilled'}`,
        name: item === 'Digital' ? 'Digital' : `${item}${t('FULFILLED')}`,
        ...getProductType(item),
      }))
      .sort((a, b) => a.productType - b.productType);
    this.setState({
      productTabs: tabs,
    });

    let init_item_detail = [];
    const promiseArr = [];
    item_detail.forEach((item, index) => {
      const { target_spu_uuid: spu_uuid } = item;
      const res = estoreService.getSpuDetail({ baseUrl, spu_uuid });
      promiseArr.push(res);
    });
    Promise.all(promiseArr)
      .then(res => {
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
        this.setState({
          item_detail: init_item_detail,
        });
      })
      .catch(err => {});
  };

  handleSend = () => {
    const { boundGlobalActions } = this.props;
    const { detail } = this.state;
    window.logEvent.addPageEvent({
      name: 'Estore_Orders_OrderDetail_Click_SendPhotoDownload',
    });
    boundGlobalActions.showModal(SEND_PHOTO_DOWNLOADS_MODAL, {
      close: status => {
        if ([1, 2, 3].includes(status)) {
          this.setState({ detail: { ...detail, digital_email_status: status } }, () => {
            this.getStateLoop();
          });
        } else {
          this.setState({ detail: { ...detail, digital_email_status: status } });
        }
        boundGlobalActions.hideModal(SEND_PHOTO_DOWNLOADS_MODAL);
      },
      digital_status: detail?.digital_email_status,
      detail: this.state.detail,
      item_detail: this.state.item_detail,
      noCancel: true,
      open,
    });
  };

  getStateLoop = () => {
    this.timer = setInterval(() => {
      this.getEstoreDetail(this);
    }, 3000);
  };

  changeTab = i => {
    this.setState({
      curTab: i,
    });
  };

  renderEstimateCost = () => {
    const { currency, order_price } = this.state;
    const { symbol } = currency;
    const { shipping, estimate_cost, auto_shipping } = order_price;

    return (
      <div className="price">
        {t('ESTIMATED_COST', 'Estimated Cost Of Auto Fulfilled Items')}:{' '}
        <a onClick={this.showCostModal} style={{ cursor: 'pointer' }}>
          {symbol}
          {estimate_cost && ((estimate_cost * 100 + auto_shipping * 100) / 100).toFixed(2)}
        </a>
      </div>
    );
  };

  renderTabs = () => {
    const { productTabs, curTab } = this.state;
    const renderBtn = productTabs[curTab]?.renderBtn;
    return (
      <div className="classifiedTabs">
        <div className="wrapperTabs">
          {productTabs.map((item, i) => (
            <div
              key={item.key}
              className={`tab ${i === curTab ? 'cur' : ''}`}
              onClick={() => this.changeTab(i)}
            >
              {item.name}
            </div>
          ))}
        </div>
        <div className="buttom">{renderBtn ? renderBtn(this) : null}</div>
      </div>
    );
  };

  renderSendPhotoDownload = () => {
    const { detail } = this.state;
    const digital_email_status = detail?.digital_email_status;
    if ([1, 2, 3].includes(digital_email_status)) {
      return (
        <span className="photo_download disabled">
          <img className="loading" src={loadingImg}></img> Preparing Photo Downloads
        </span>
      );
    }
    if (digital_email_status == -1) {
      return (
        <span className="photo_download error">
          {/* <img className="loading" src={loadingImg}></img>  */}
          Failure: please contact support team
        </span>
      );
    }
    return (
      <span className="photo_download" onClick={() => this.handleSend(detail)}>
        {digital_email_status == 4 ? 'Resend Photo Downloads' : 'Send Photo Downloads'}
      </span>
    );
  };

  render() {
    const { history, boundGlobalActions } = this.props;
    const {
      detail: order_detail,
      payment_detail,
      item_detail,
      order_price,
      currency,
      order_no,
      isShowLoading,
      mixedExistedAuto,
      curTab,
    } = this.state;
    const { order_shipment = {}, payment_method, pay_transaction_id } = payment_detail;
    const { sub_total, shipping, tax, total, sku_discount } = order_price;
    const vaildCoupon = sku_discount !== '0.00';
    const { fulfill_type, contains_digital, fulfill_name } = order_detail;
    const {
      ship_method_name = '',
      address = '',
      city = '',
      country_name = '',
      province_name = '',
      receiver_name = '',
      receiver_phone = '',
      zip_code = '',
      address2 = '',
      district = '',
    } = order_shipment;
    const pay_name = orderPayName[payment_method];
    const { symbol } = currency;
    let addressObj = {
      receiver_name,
      address,
      address2,
      city,
      province_name,
      zip_code,
      country_name,
      receiver_phone,
    };

    if (__isCN__) {
      addressObj = {
        receiver_name,
        receiver_phone,
        province_name,
        city,
        district,
        address,
        address2,
        zip_code,
      };
    }

    return (
      <div
        className="order_detail"
        id="order_detail"
        onClick={() => {
          this.setState({ showTrackPop: false });
        }}
      >
        <XLoading type="imageLoading" zIndex={99} isShown={isShowLoading} />
        <div className="d_top">
          <div
            className="d_back"
            onClick={() => {
              history.push('/software/e-store/orders');
            }}
          >
            {`< ${t('ESTPRE_ORDERS', 'Order')} ${order_no}`}
          </div>
        </div>
        <div className="status_wrap">
          <div className="d_title">{t('STATUS', 'Status')}</div>
          <div className="status_box">
            <div className="left">{this.renderStatus(this)}</div>
            <div className="right">{this.renderOptionBtns(this)}</div>
          </div>
        </div>
        <div className="order_info">
          <div className="d_title">{t('ORDER_DETAILS', 'Order Details')}</div>
          <div className="order_tb">
            <div className="column">
              <div className="tr">{t('ORDER_DATE', 'Order Date')}</div>
              <div className="td">{order_detail.order_date}</div>
            </div>
            <div className="column">
              <div className="tr">{t('COLLECTION', 'Collection')}</div>
              <div className="td">{order_detail.source_app_name || t('DELETED', 'Deleted')}</div>
            </div>
            <div className="column">
              <div className="tr">{t('FULFILLMENT', 'Fufillment')}</div>
              <div className="td">{fulfill_name}</div>
            </div>

            <div className="column">
              <div className="tr">{t('STORE_STATUS_PRICE_SHEET', 'Price Sheet')}</div>
              <div className="td">{order_detail.price_sheet_name}</div>
            </div>
            {fulfill_type === 1 && (
              <div className="column">
                <div className="tr">{t('RELATED_ORDER', 'Related Zno Lab Order')}</div>
                <div onClick={this.openOrderDetails} className="td blue">
                  {order_detail.zno_order_number}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="pay_info">
          <div className="d_title">{t('PAYMENT_DETAILS', 'Payment Details')}</div>
          <div className="row">
            <span className="title">{t('ADDRESS', 'Address')}</span>
            <span className="info">{this.renderPayAddress(addressObj)}</span>
          </div>
          <div className="row">
            <span className="title">{t('CHECKOUT_SHIPPING_METHOD', 'Shipping Method')}</span>
            <span className="info">{ship_method_name}</span>
          </div>
          <div className="row">
            <span className="title">{t('PAYMENT_METHOD', 'Payment Method')}</span>
            <span className="info">{pay_name}</span>
          </div>
          {(payment_method === 'PAYPAL' || payment_method === 'STRIPE') && (
            <div className="row">
              <span className="title">Transaction ID</span>
              <span className="info transaction">
                <CopyToClipboard
                  text={pay_transaction_id}
                  onCopy={() => {
                    window.logEvent.addPageEvent({
                      name: 'Estore_Orders_OrderDetail_Click_TransactionID',
                    });
                    boundGlobalActions.addNotification({
                      message: t('Successfully copied'),
                      level: 'success',
                      autoDismiss: 2,
                    });
                  }}
                >
                  <div>
                    <span>{pay_transaction_id}</span>
                    <img src={require('./images/copy.png')} />
                  </div>
                </CopyToClipboard>
              </span>
            </div>
          )}
        </div>
        <div className="d_detail">
          <div className="d_title">
            {t('ITEM_DETAILS', 'Item Details')}
            {this.renderTabs()}
          </div>
          <div className="order_table">
            <div className="th">
              <div className="td">{t('ORDER_DISPLAY', 'Display')}</div>
              <div className="td">{t('ITEM', 'item')}</div>
              <div className="td">{t('UNIT_PRICE', 'Unit Price')}</div>
              <div className="td">{t('QUANTITY', 'Quantity')}</div>
              <div className="td">{t('UNIT_TOTAL', 'Unit Total')}</div>
              <div className="td">{t('ACTION', 'Action')}</div>
            </div>
            {this.renderOrderList(this)}
          </div>
          {mixedExistedAuto && !curTab && this.renderEstimateCost()}
        </div>
        <div className={`order_price bg`}>
          <div className="title">{t('ORDER_SUMMARY', 'Order Summary')}</div>
          <div className="price">
            {t('SUBTOTAL', 'Subtotal')}:{' '}
            <span>
              {symbol}
              {sub_total}
            </span>
          </div>
          {!__isCN__ && (
            <div className="price coupon">
              Coupon Code:{' '}
              <span
                className={`${vaildCoupon ? 'discount' : ''}`}
                onClick={vaildCoupon ? () => this.showDiscountModal(item_detail) : () => {}}
              >
                -{symbol}
                {sku_discount}
              </span>
            </div>
          )}
          <div className="price">
            {t('SHIPPING', 'Shipping')}:{' '}
            <span>
              {symbol}
              {shipping}
            </span>
          </div>
          {!__isCN__ && (
            <div className="price">
              Tax:{' '}
              <span>
                {symbol}
                {tax}
              </span>
            </div>
          )}
          <div className="price">
            {t('ORDER_TOTAL', 'Order Total')}:{' '}
            <span>
              {symbol}
              {total}
            </span>
          </div>
        </div>
        <div className="placeholder" />
      </div>
    );
  }
}
