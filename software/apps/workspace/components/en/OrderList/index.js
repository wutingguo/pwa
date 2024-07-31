import React, { Component } from 'react';
import { orderStatusMap, serviceTypeMap } from '../../../constants/strings';
import {
  DELETE_ORDER,
  CANCEL_ORDER,
} from '../../../constants/apiUrl';
import { getImageByLanguage } from '../../../utils/img';
import * as xhr from '@resource/websiteCommon/utils/xhr';
import { getLoginPath } from '@resource/websiteCommon/utils/url';
import { relativeUrl, getLanguageCode } from '@resource/lib/utils/language';
import { navigateToWwwOrSoftware, navigateToWwwOrExternalBrowser } from '@resource/lib/utils/history';
import XLink from '@resource/components/XLink';
import { template } from 'lodash';
import ConfirmModal from '../../ConfirmModal';
import AlertModal from '../../AlertModal';
import { getImageUrl } from '../../../utils/img';

import './table-grid.scss';
import './index.scss';

class OrderList extends Component {
  constructor(props) {
    super(props);

    this.cancelOrder = this.cancelOrder.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.doDeleteOrder = this.doDeleteOrder.bind(this);
    this.doCancelOrder = this.doCancelOrder.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.getRenderHTML = this.getRenderHTML.bind(this);
    this.onImageError = this.onImageError.bind(this);
    this.toOrderDetails = this.toOrderDetails.bind(this);

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

  toOrderDetails(orderNumber, isDSOrder) { 
    this.props.history.push(`/software/designer/order-details?id=${orderNumber}${isDSOrder ? '&serviceTypeNum=1' : ''}`)
  }

  cancelOrder(orderUid) {
    this.setState({
      showConfirm: true,
      cancelOrderUid: orderUid,
      confirmText: t('CANCE_ORDER_CONFIRM')
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
      const url = template(DELETE_ORDER)({ baseUrl: this.props.getWWWorigin() });
      xhr.post(url, options).then(result => {
        const { success, errorCode } = result;
        if (errorCode === 1566) {
          window.location = getLoginPath();
          return;
        }
        if (success) {
          const { orderViewList } = this.state;
          const newOrderList = orderViewList.filter(item => item.orderNumber !== deleteOrderNumber);
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
      const url = template(CANCEL_ORDER)(options);
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
              item.deliveryEstimateTimeRange = null;
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
          const msg = respCode === 160 ? t('CANCE_ORDER_MSG_1') : t('CANCE_ORDER_MSG_2');
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
    const lang = getLanguageCode();
    let DEFAULT_COVER_IMAGE_URL = getImageByLanguage('defaultCoverImage', lang);
    const noImageSrc = getImageUrl(DEFAULT_COVER_IMAGE_URL)
    e.target.src = noImageSrc;
  }

  onClickTrackPackage(trackingNumberUrl) {
    navigateToWwwOrExternalBrowser(trackingNumberUrl, true);
  }

  getRenderHTML() {
    const { orderViewList } = this.state;
    const { history } = this.props;
    const html = [];
    const isChildAccount = this.props.userInfo.get('customerLevel') == 3 || false;

    if (orderViewList && orderViewList.length) {
      orderViewList.forEach((item, index) => {
        const {
          orderPreviewImgUrl,
          orderNumber,
          orderUid,
          createDateTime,
          createDateTimeStr,
          total,
          orderStatus,
          deliveryEstimateTime,
          showCancelButton,
          showModifyAddressButton,
          showToPayButton,
          showDeleteButton,
          showShippingStatus,
          shippingStatus,
          deliveryEstimateTimeRange,
          trackingNumberUrl,
          serviceTypeNum
        } = item;

        const isDSOrder = serviceTypeMap.DESIGN_SERVICE == serviceTypeNum;


        html.push(
          <div className="grid item" key={index}>
            <div className="col">
              <img src={orderPreviewImgUrl} onError={this.onImageError} />
            </div>
            <div className="col">
              <a onClick={() => this.toOrderDetails(orderNumber, isDSOrder)}
                className="detail"
              >
                {orderNumber}
              </a>
            </div>
            <div className="col">{createDateTimeStr}</div>
            {!isChildAccount ? <div className="col">{total}</div> : null}
            <div className="col">{t(orderStatus)}</div>
            <div className="col">{deliveryEstimateTimeRange}</div>
            <div className="col edit">
              {showModifyAddressButton ? (
                <XLink
                  onClick={() => location.href = `/manage-address.html?from=saas&orderNumber=${orderNumber}&requestFrom=myOrder&a_type=o_s_a`}
                >
                  {t('CHANGE_ADDRESS')}
                </XLink>
              ) : null}

              {orderStatus === 'IN_SHIPPING' ? (
                <XLink className="track-package" onClick={this.onClickTrackPackage.bind(this, trackingNumberUrl)}>
                  {t('TRACK_PACKAGE')}
                </XLink>
              ) : null}
              {isDSOrder ? (
                <XLink className="track-package" onClick={() => history.push(`/software/designer/ds-order-confirm?service_order_id=${orderNumber}`)}>
                  {t('DESIGN_REQUIREMENT')}
                </XLink>
              ) : null}

              {showCancelButton ? (
                <a href="javascript:;" onClick={this.cancelOrder.bind(this, orderUid)}>
                  {t('CANCEL')}
                </a>
              ) : null}
              {/* {showShippingStatus ? (
                <span>{shippingStatusText[shippingStatus]}</span>
              ) : null} */}
            </div>
          </div>
        );
      });
    }

    return html;
  }

  render() {
    const { showConfirm, confirmText, alertText, showAlert } = this.state;
    const comfirmModalProps = {
      text: confirmText,
      cancelText: t('CANCEL'),
      okText: t('OK_YES'),
      actions: {
        handleClose: this.closeModal,
        handleOk: this.handleOk,
        handleCancel: this.closeModal
      }
    };

    const alerModalProps = {
      html: alertText,
      btnText: t('BTN_YES'),
      actions: {
        handleClose: this.closeModal,
        handleOk: this.closeModal
      }
    };

    const isChildAccount = this.props.userInfo.get('customerLevel') == 3 || false;
    return (
      <div className="order-list">
        <div className="grid head">
          <div className="col">&nbsp;</div>
          <div className="col">{t('ORDER')}</div>
          <div className="col">{t('ORDER_DATE')}</div>
          {!isChildAccount ? <div className="col">{t('GRAND_TOTAL')}</div> : null}
          <div className="col">{t('STATUS')}</div>
          <div className="col">{t('DELIVERY_ESTIMATE')}</div>
          <div className="col">{t('ACTION')}</div>
        </div>
        {this.getRenderHTML()}
        {showConfirm ? <ConfirmModal {...comfirmModalProps} /> : null}
        {showAlert ? <AlertModal {...alerModalProps} /> : null}
      </div>
    );
  }
}

export default OrderList;
