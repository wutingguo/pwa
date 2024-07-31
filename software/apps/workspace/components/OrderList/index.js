import React, { Component } from 'react';
import { formatTime } from '../../utils/date';
import {
  orderStatusText,
  shippingStatusText,
  CDN_PREFIX,
  orderStatusMap
} from '../../constants/strings';
import {
  NO_IMAGE_SRC,
  DELETE_ORDER,
  CANCEL_ORDER
} from '../../constants/apiUrl';
import * as xhr from '@resource/websiteCommon/utils/xhr';
import { getLoginPath } from '@resource/websiteCommon/utils/url';
import XLink from '@resource/components/XLink';
import { template } from '../../utils/template';
import AlertModal from '../AlertModal';

import ConfirmModal from '../ConfirmModal';
import EditOrderAddressWrapper from '../EditOrderAddress';

import './table-grid.scss';
import './index.scss';

class OrderList extends Component {
  constructor(props) {
    super(props);

    this.cancelOrder = this.cancelOrder.bind(this);
    this.deleteOrder = this.deleteOrder.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.doDeleteOrder = this.doDeleteOrder.bind(this);
    this.doCancelOrder = this.doCancelOrder.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.getRenderHTML = this.getRenderHTML.bind(this);
    this.onImageError = this.onImageError.bind(this);
    this.toOrderDetails = this.toOrderDetails.bind(this);
    this.toBillingReview = this.toBillingReview.bind(this);
    this.state = {
      showConfirm: false,
      confirmText: '',
      deleteOrderNumber: '',
      cancelOrderUid: '',
      showAlert: false
    };
  }

  componentDidMount() {
    const { orderViewList } = this.props;
    this.setState({
      orderViewList
    });
  }

  cancelOrder(orderUid) {
    this.setState({
      showConfirm: true,
      cancelOrderUid: orderUid,
      confirmText:
        '您一定要取消订单吗？如果您已经支付，我们约在5天内退还您的付款。'
    });
  }

  toOrderDetails(orderNumber) { 
    this.props.history.push(`/software/designer/order-details?id=${orderNumber}`)
  }

  deleteOrder(orderNumber) {
    this.setState({
      showConfirm: true,
      deleteOrderNumber: orderNumber,
      confirmText: '您确定要删除订单吗？'
    });
  }

  closeModal() {
    this.setState({
      showConfirm: false,
      confirmText: '',
      deleteOrderNumber: '',
      cancelOrderUid: '',
      showAlert: false
    });
  }

  doDeleteOrder() {
    const { deleteOrderNumber } = this.state;
    if (deleteOrderNumber) {
      const options = {
        orderNumber: deleteOrderNumber
      };
      const url = template(DELETE_ORDER, { baseUrl: this.props.getWWWorigin() });
      xhr.post(url, options).then(result => {
        const { success, errorCode } = result;
        if (errorCode === 1566) {
          window.location = getLoginPath();
          return;
        }
        if (success) {
          const { orderViewList } = this.state;
          const newOrderList = orderViewList.filter(
            item => item.orderNumber !== deleteOrderNumber
          );
          this.setState({
            orderViewList: newOrderList,
            showConfirm: false,
            confirmText: '',
            deleteOrderNumber: ''
          });
        }
      });
    }
  }

  doCancelOrder() {
    const { cancelOrderUid } = this.state;
    if (cancelOrderUid) {
      const options = {
        baseUrl: this.props.getWWWorigin(),
        orderUid: cancelOrderUid
      };
      const url = template(CANCEL_ORDER, options);
      xhr.get(url).then(result => {
        const { success, errorCode, respCode } = result;
        if (errorCode === 1566) {
          window.location = getLoginPath();
          return;
        }
        if (respCode === 0) {
          const { orderViewList } = this.state;
          const newOrderList = orderViewList.map(item => {
            if (item.orderUid === cancelOrderUid) {
              item.orderStatus = orderStatusMap.CANCELLED;
              item.deliveryEstimateTime = null;
              item.showModifyAddressButton = false;
              item.showCancelButton = false;
            }
            return item;
          });
          this.setState({
            orderViewList: newOrderList,
            showConfirm: false,
            confirmText: '',
            cancelOrderUid: ''
          });
        } else {
          const msg =
            respCode === 160
              ? '该订单包含特殊商品不支持自主取消，<br />请联系客服协助您'
              : '订单取消失败！';
          this.setState({
            showAlert: true,
            showConfirm: false,
            confirmText: '',
            cancelOrderUid: '',
            alertText: msg
          });
        }
      });
    }
  }

  handleOk() {
    const { deleteOrderNumber, cancelOrderUid } = this.state;

    if (deleteOrderNumber) {
      this.doDeleteOrder();
    } else if (cancelOrderUid) {
      this.doCancelOrder();
    }
  }

  onImageError(e) {
    const noImageSrc = `${CDN_PREFIX}${NO_IMAGE_SRC}`
    e.target.src = noImageSrc;
  }

  toBillingReview(orderNumber) {
    const { history } = this.props;
    history.push(`/software/billing-review?oID=${orderNumber}`)
  }

  getRenderHTML() {
    const { isShowAccount, showEditAddressModal, userInfo } = this.props;
    const { orderViewList } = this.state;
    const html = [];
    const isChildAccount = userInfo.get('customerLevel') == 3

    if (orderViewList && orderViewList.length) {
      orderViewList.forEach((item, index) => {
        const {
          orderPreviewImgUrl,
          orderNumber,
          orderUid,
          createDateTime,
          total,
          orderStatus,
          deliveryEstimateTime,
          showCancelButton,
          showModifyAddressButton,
          showToPayButton,
          showDeleteButton,
          showShippingStatus,
          shippingStatus,
          account,
          mainAccount
        } = item;
        html.push(
          <div className="grid item" key={index}>
            <div className="col">
              <img src={orderPreviewImgUrl} onError={this.onImageError} />
            </div>
            <div className="col">
              <a onClick={() => this.toOrderDetails(orderNumber)}
                className="detail"
              >
                {orderNumber}
              </a>
            </div>
            <div className="col">
              {formatTime(createDateTime, 'yyyy-mm-dd hh:ii:ss')} 
            </div>
            {isShowAccount ? (
              <div className="col">{account || '主账户'}</div>
            ) : null}
            {!isChildAccount ? <div className="col">{total}</div> : null}
            <div className="col">{orderStatusText[orderStatus]}</div>
            <div className="col">
              {deliveryEstimateTime ? formatTime(deliveryEstimateTime) : ''}
            </div>
            <div className="col edit">
              {showModifyAddressButton ? (
                <XLink
                  onClick={showEditAddressModal.bind(undefined, orderNumber)}
                >
                  修改地址
                </XLink>
              ) : null}
              {showToPayButton ? (
                <XLink
                  onClick={() => this.toBillingReview(orderNumber)}
                >
                  去支付
                </XLink>
              ) : null}
              {showCancelButton ? (
                <a
                  href="javascript:;"
                  onClick={this.cancelOrder.bind(this, orderUid)}
                >
                  取消
                </a>
              ) : null}
              {showDeleteButton ? (
                <a
                  href="javascript:;"
                  onClick={this.deleteOrder.bind(this, orderNumber)}
                >
                  删除订单
                </a>
              ) : null}
              {showShippingStatus ? (
                <span>{shippingStatusText[shippingStatus]}</span>
              ) : null}
            </div>
          </div>
        );
      });
    }

    return html;
  }

  render() {
    const { isShowAccount, userInfo } = this.props;
    const {
      showConfirm,
      confirmText,
      alertText,
      showAlert
    } = this.state;
    const comfirmModalProps = {
      text: confirmText,
      actions: {
        handleClose: this.closeModal,
        handleOk: this.handleOk,
        handleCancel: this.closeModal
      }
    };

    const alerModalProps = {
      html: alertText,
      btnText: '我知道了',
      actions: {
        handleClose: this.closeModal,
        handleOk: this.closeModal
      }
    };

    const isChildAccount = userInfo.get('customerLevel') === 3

    return (
      <div className="order-list">
        <div className="grid head">
          <div className="col">&nbsp;</div>
          <div className="col">订单编号</div>
          <div className="col">下单时间</div>
          {isShowAccount ? <div className="col">下单账户</div> : null}
          {!isChildAccount ? <div className="col">订单金额</div> : null}
          <div className="col">订单状态</div>
          <div className="col">预计发货时间</div>
          <div className="col">操作</div>
        </div>
        {this.getRenderHTML()}
        {showConfirm ? <ConfirmModal {...comfirmModalProps} /> : null}
        {showAlert ? <AlertModal {...alerModalProps} /> : null}
      </div>
    );
  }
}

export default EditOrderAddressWrapper(OrderList);
