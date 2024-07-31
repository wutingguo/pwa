import * as localModalTypes from '@apps/gallery-client/constants/modalTypes';

// 支付失败的弹窗
export const showPaymentFailedAlertModal = ({ boundGlobalActions, history }) => {
  boundGlobalActions.showModal(localModalTypes.PAYMENT_FAILED_MODAL, {
    close: () => {
      boundGlobalActions.hideModal(localModalTypes.PAYMENT_FAILED_MODAL);
    },
    onOk: () => {
      boundGlobalActions.hideModal(localModalTypes.PAYMENT_FAILED_MODAL);
      history.replace('/printStore/shopping-cart');
    }
  });
};
// 购物车为空的弹窗
export const showShopCartIsEmptyModal = ({ boundGlobalActions, history }) => {
  boundGlobalActions.showModal(localModalTypes.SHOP_CART_EMPTY_MODAL, {
    close: () => {
      boundGlobalActions.hideModal(localModalTypes.SHOP_CART_EMPTY_MODAL);
    },
    onOk: () => {
      boundGlobalActions.hideModal(localModalTypes.SHOP_CART_EMPTY_MODAL);
      history.replace('/printStore/shopping-cart');
    }
  });
};

// 提示弹窗
export const showOfflinePaymentModal = ({ boundGlobalActions, orderWithOfflinePayment }) => {
  boundGlobalActions.showModal(localModalTypes.TIPS_MODAL, {
    className: 'print-store-offline-payment-modal',
    title: t('ESTORE_OFFLINE_PAYMENT_MODAL_TITLE'),
    tips: t('ESTORE_OFFLINE_PAYMENT_MODAL_TIPS'),
    okButtonText: t('ESTORE_OFFLINE_PAYMENT_MODAL_OK_BUTTON_TEXT'),
    isAsync: true,
    isWithLoginCheck: true,
    close: () => {
      boundGlobalActions.hideModal(localModalTypes.TIPS_MODAL);
    },
    onOk: async () => {
      try {
        await orderWithOfflinePayment();
        boundGlobalActions.hideModal(localModalTypes.TIPS_MODAL);
      } catch (e) {
        console.error(e);
      }
    }
  });
};
