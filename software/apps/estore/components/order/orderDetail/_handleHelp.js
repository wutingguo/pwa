import Immutable from 'immutable';
import React from 'react';

import { getCookieMap } from '@resource/logevent/util/html/cookie';

import {
  ADD_COST_MODAL,
  ADD_SHIPPING_MODAL,
  DOWNLOADMODAL,
  SHOW_DISCOUNT_MODAL,
} from '@apps/estore/constants/modalTypes';
import estoreService from '@apps/estore/constants/service';

export const sendToLab = that => {
  const { boundGlobalActions, userInfo = Immutable.Map({}) } = that.props;
  const { baseUrl, detail = {} } = that.state;
  const { order_number } = detail;
  const { uidPk, securityToken, timestamp } = userInfo.toJS();
  const cookieMap = getCookieMap();
  window.logEvent.addPageEvent({
    name: 'Estore_Orders_OrderDetail_Click_SendToLab',
  });

  const { addNotification, hideConfirm, showConfirm } = boundGlobalActions;
  const auth = {
    customerId: uidPk,
    securityToken,
    timestamp,
  };

  const closeOrderDetailSendToLabPop = () => {
    hideConfirm();
    window.logEvent.addPageEvent({
      name: 'Estore_Orders_OrderDetailSendToLabPop_Click_Cancel',
    });
  };

  const data = {
    className: 'send_to_lab_confirm',
    close: closeOrderDetailSendToLabPop,
    title: `${t('SEND_TO_LAB_TITLE')}`,
    message: t('SEND_TO_LAB_INFO'),
    buttons: [
      {
        className: 'white pwa-btn',
        text: t('CANCEL'),
        onClick: closeOrderDetailSendToLabPop,
      },
      {
        className: 'pwa-btn',
        text: t('CONTINUE', 'Continue'),
        onClick: () => {
          that.setState({ isShowLoading: true });
          window.logEvent.addPageEvent({
            name: 'Estore_Orders_OrderDetailSendToLabPop_Click_Continue',
          });
          estoreService.sendToLab({ baseUrl, order_number, auth, cookieMap }).then(res => {
            that.setState({ isShowLoading: false });
            if (res.data && res.ret_code === 200000) {
              if (location.host.includes('asovx.com.t')) {
                location.href = 'https://www.zno.com.t/shopping-cart.html?from=saas';
                return;
              }
              if (__isCN__) {
                location.href = `/software/shopping-cart`;
              } else {
                location.href = '/shopping-cart.html?from=saas';
              }
            }
          });
        },
      },
    ],
  };
  showConfirm(data);
};

export const MarkAsPaid = that => {
  const { boundGlobalActions, userInfo = Immutable.Map({}) } = that.props;
  const { baseUrl, detail = {} } = that.state;
  const { order_number } = detail;
  const { hideConfirm, showConfirm } = boundGlobalActions;
  window.logEvent.addPageEvent({
    name: 'Estore_Orders_OrderDetail_Click_MarkAsPaid',
  });
  function closeOrderDetailMarkAdPaid() {
    window.logEvent.addPageEvent({
      name: 'Estore_Orders_OrderDetailMarkAsPaidPop_Cancel',
    });
    hideConfirm();
  }
  const data = {
    className: '',
    close: closeOrderDetailMarkAdPaid,
    // title: `${t('MARK_AS_PAID_TITLE')}`,
    message: t('MARK_AS_PAID_INFO'),
    buttons: [
      {
        className: 'white pwa-btn',
        text: t('CANCEL'),
        onClick: closeOrderDetailMarkAdPaid,
      },
      {
        className: 'pwa-btn',
        text: t('CONFIRM2'),
        onClick: () => {
          that.setState({ isShowLoading: true });
          window.logEvent.addPageEvent({
            name: 'Estore_Orders_OrderDetailMarkAsPaidPop_Confirm',
          });
          estoreService.confirmOrderPay({ baseUrl, order_no: order_number }).then(res => {
            that.setState({ isShowLoading: false });
            if (res.ret_code === 200000) {
              that.getEstoreDetail();
            }
          });
        },
      },
    ],
  };
  showConfirm(data);
};
export const cancelOrder = that => {
  const { boundGlobalActions } = that.props;
  const { hideConfirm, showConfirm } = boundGlobalActions;
  window.logEvent.addPageEvent({
    name: 'Estore_Orders_OrderDetail_Click_CancelOrder',
  });
  const closeOrderDetailCancelOrderPop = () => {
    window.logEvent.addPageEvent({
      name: 'Estore_Orders_OrderDetailCancelOrderPop_Click_Cancel',
    });
    hideConfirm();
  };
  const data = {
    className: 'ai-delete-collection-modal',
    close: closeOrderDetailCancelOrderPop,
    message: t('CANCEL_ORDER_TIPS', 'Are you sure you want to cancel the order? '),
    buttons: [
      {
        className: 'white pwa-btn',
        text: t('CANCEL1'),
        onClick: closeOrderDetailCancelOrderPop,
      },
      {
        className: 'pwa-btn',
        text: t('CONFIRM3'),
        onClick: () => {
          const { baseUrl, detail = {} } = that.state;
          const { order_number } = detail;
          window.logEvent.addPageEvent({
            name: 'Estore_Orders_OrderDetailCancelOrderPop_Click_Confirm',
          });
          estoreService.cancelOrder({ baseUrl, order_no: order_number }).then(res => {
            if (res.ret_code !== 200000) {
              boundGlobalActions.addNotification({
                message: res.ret_msg,
                level: 'error',
                autoDismiss: 2,
              });
            }
            getEstoreDetail(that);
          });
        },
      },
    ],
  };
  showConfirm(data);
};
export const trackPackage = that => {
  const { baseUrl, detail = {}, showTrackPop } = that.state;
  const { boundGlobalActions } = that.props;
  const { order_number } = detail;
  window.logEvent.addPageEvent({
    name: 'Estore_Orders_OrderDetail_Click_TrackPackage',
  });
  estoreService.trackPackage({ baseUrl, order_no: order_number }).then(res => {
    if (res.ret_code === 200000 && res.data) {
      const { track_package_url = '', shipment_number = '', courier } = res.data;
      if (track_package_url) {
        if (courier === 'EDHL') {
          window.open(track_package_url);
          return;
        }
        window.open(track_package_url + shipment_number);
        return;
      }
      that.setState({
        shipment_number,
        courier,
        showTrackPop: !showTrackPop,
      });
    } else {
      that.setState({
        showTrackPop: !showTrackPop,
      });
    }
  });
};
export const getTrackPackage = that => {
  const { baseUrl, detail = {} } = that.state;
  const { order_number } = detail;
  estoreService.trackPackage({ baseUrl, order_no: order_number }).then(res => {
    if (res.ret_code === 200000 && res.data) {
      const { track_package_url = '', shipment_number = '', courier } = res.data;
      that.setState({
        shipment_number,
        courier,
        track_package_url,
      });
    }
  });
};
export const showCostModal = that => {
  const { boundGlobalActions } = that.props;
  const { order_price, currency, payment_detail, mixedExistedAuto } = that.state;
  const { order_shipment = {} } = payment_detail;
  const { ship_method_name } = order_shipment;
  window.logEvent.addPageEvent({
    name: 'Estore_Orders_OrderDetail_Click_COGS',
  });
  boundGlobalActions.showModal(ADD_COST_MODAL, {
    title: t('ESTIMATED_COST', 'Estimated Cost Of Auto Fulfilled Items'),
    order_price,
    mixedExistedAuto,
    currency,
    ship_method_name,
    close: () => {
      boundGlobalActions.hideModal(ADD_COST_MODAL);
    },
    hideBtnList: true,
    onOk: () => {},
  });
};

export const showDiscountModal = (that, items) => {
  const { boundGlobalActions } = that.props;
  const { order_price, currency } = that.state;
  boundGlobalActions.showModal(SHOW_DISCOUNT_MODAL, {
    title: 'Coupon Code Breakdown',
    items,
    currency,
    order_price,
    close: () => {
      boundGlobalActions.hideModal(SHOW_DISCOUNT_MODAL);
    },
    hideBtnList: true,
    onOk: () => {},
  });
};

export const getEstoreDetail = that => {
  const { baseUrl, order_no, detail } = that.state;
  if (![1, 2, 3].includes(detail?.digital_email_status)) {
    that.setState({
      isShowLoading: true,
    });
  }
  estoreService.getOrderDetail({ baseUrl, order_no }).then(res => {
    let orderDetail = {};
    if (res.data && res.ret_code === 200000) {
      orderDetail = res.data;
      that.setState({
        isShowLoading: false,
      });
      const { item_detail = [], detail = {} } = orderDetail;
      const { cstatus, fulfill_type = 1, digital_email_status, fulfill_name } = detail;
      const type = fulfill_name.includes(t('AUTO_PRODUCT'));
      // 如果混合订单存在 autofulfillment，那么该订单所有的流程都按照 autofulfillment 走。
      orderDetail = Object.assign({}, orderDetail, {
        status: cstatus,
        fulfillType: type ? 'Auto' : 'Self',
        mixedExistedAuto: fulfill_name.includes(t('AUTO_PRODUCT')),
      });
      // 不轮询0， 4, -1
      if (![1, 2, 3].includes(digital_email_status)) {
        that.timer && clearInterval(that.timer);
      }
      that.setState(orderDetail, () => {
        that.initItemDetail(item_detail);
      });
    }
  });
};

export const openOrderDetails = that => {
  const { detail } = that.state;
  const { history } = that.props;
  window.logEvent.addPageEvent({
    name: 'Estore_Orders_OrderDetail_Click_RelatedZnoOrder',
  });
  history.push(`/software/designer/order-details?id=${detail.zno_order_number}`);
};

export const ExportOrder = (that, item_id) => {
  window.logEvent.addPageEvent({
    name: 'Estore_Orders_OrderDetail_Click_ExportProject',
  });
  const { boundGlobalActions, userInfo = Immutable.Map({}) } = that.props;
  const { baseUrl, detail = {}, item_detail } = that.state;
  const { order_number } = detail;
  const { uidPk, securityToken, timestamp } = userInfo.toJS();
  const { hideConfirm, showConfirm } = boundGlobalActions;
  const cookieMap = getCookieMap();
  let order_item_id_list = [item_id];
  const auth = {
    customerId: uidPk,
    securityToken,
    timestamp,
  };
  estoreService
    .exportProject({ order_number, auth, baseUrl, order_item_id_list, cookieMap })
    .then(res => {
      if (res.ret_code === 200005) {
        const data = {
          className: 'export_confirm',
          close: hideConfirm,
          style: {
            width: '547px',
          },
          message: t('EXPORTING_TIPS'),
          buttons: [
            {
              className: 'pwa-btn',
              text: t('OK'),
              onClick: () => {
                hideConfirm();
              },
            },
          ],
        };
        showConfirm(data);
      } else if (res.ret_code === 200000) {
        location.href = res.data;
      } else {
        console.log(res, '----');
        boundGlobalActions.addNotification({
          message: res.ret_msg,
          level: 'error',
          autoDismiss: 2,
        });
      }
    });
};

export const ViewOrder = (that, enc_item_id, urls) => {
  window.logEvent.addPageEvent({
    name: 'Estore_Orders_OrderDetail_Click_ViewSelectedPhotos',
  });
  const { boundGlobalActions, userInfo = Immutable.Map({}), sets } = that.props;
  const { baseUrl, detail = {}, item_detail } = that.state;
  // 这里主要需要sets和urls
  boundGlobalActions.showModal('CHOOSE_IMG_MODAL', {
    ...that.props,
    sets,
    enc_item_id,
    urls,
    source: 'B',
    close: () => {
      boundGlobalActions.hideModal('CHOOSE_IMG_MODAL');
    },
  });
};

export const MarkStatus = (that, status) => {
  const { baseUrl, detail = {} } = that.state;
  const { boundGlobalActions } = that.props;
  const { order_number } = detail;
  if (status === 'IN_PRODUCTION') {
    const { addNotification, hideConfirm, showConfirm } = boundGlobalActions;
    const cancelAndLog = () => {
      window.logEvent.addPageEvent({
        name: 'Estore_Orders_OrderDetailMarkAsProcessingPop_Cancel',
      });
      hideConfirm();
    };
    const data = {
      className: 'ai-delete-collection-modal',
      close: cancelAndLog,
      message: t('MARK_PROCESSING'),
      buttons: [
        {
          className: 'white pwa-btn',
          text: t('CANCEL'),
          onClick: cancelAndLog,
        },
        {
          className: 'pwa-btn',
          text: t('CONFIRM'),
          onClick: () => {
            window.logEvent.addPageEvent({
              name: 'Estore_Orders_OrderDetailMarkAsProcessingPop_Confirm',
            });
            estoreService.changeProductOrder({ baseUrl, order_no: order_number }).then(res => {
              if (res.ret_code === 200000) {
                getEstoreDetail(that);
              }
            });
          },
        },
      ],
    };
    showConfirm(data);
    window.logEvent.addPageEvent({
      name: 'Estore_Orders_OrderDetail_Click_MarkAsProcessing',
    });
  } else if (status === 'IN_SHIPPING') {
    window.logEvent.addPageEvent({
      name: 'Estore_Orders_OrderDetail_Click_MarkAsShipped',
    });
    boundGlobalActions.showModal(ADD_SHIPPING_MODAL, {
      data: {
        title: t('UPDATE_SHIPPED_TIPS'),
        order_no: order_number,
      },
      close: () => {
        window.logEvent.addPageEvent({
          name: 'Estore_Orders_OrderDetailMarkAsShippedPop_Cancel',
        });
        boundGlobalActions.hideModal(ADD_SHIPPING_MODAL);
      },
      getEstoreDetail: that.getEstoreDetail,
      onOk: () => {},
      onLogMarkAsShipped: ({ carrier, trackingNumber, noShip }) => {
        window.logEvent.addPageEvent({
          name: 'Estore_Orders_OrderDetailMarkAsShippedPop_Confirm',
          carrier,
        });
      },
    });
  }

  // }else{

  // }
};
export const openProject = (url, canEditProject) => {
  window.logEvent.addPageEvent({
    name: 'Estore_Orders_OrderDetail_Click_ViewProject',
  });
  location.href = url;
};
export const handleDownload = (that, order_item_id) => {
  const { boundGlobalActions, userInfo = Immutable.Map({}), urls } = that.props;
  const { baseUrl, detail = {}, item_detail } = that.state;
  const { showModal, hideModal, hideConfirm, showConfirm } = boundGlobalActions;
  estoreService.getDownloadUid({ baseUrl, order_item_id }).then(res => {
    showModal(DOWNLOADMODAL, {
      downloaduuid: res.data,
      isShown: true,
      onClosed: e => {
        hideModal(DOWNLOADMODAL);
      },
      onOk: () => {},
    });
  });
  window.logEvent.addPageEvent({
    name: 'Estore_Orders_OrderDetail_Click_Download',
  });
};
