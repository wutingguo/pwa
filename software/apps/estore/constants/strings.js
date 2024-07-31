export const orderStatusType = {
  PAID: 'PAID',
  IN_PRODUCTION: 'IN_PRODUCTION',
  PROCESSED: 'PROCESSED',
  IN_SHIPPING: 'IN_SHIPPING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  CREATED: 'CREATED',
  UNPAID: 'UNPAID',
};
export const canEditProjectStatus = [orderStatusType.PAID, orderStatusType.CREATED];
export const orderPayName = {
  PAYPAL: 'PayPal',
  OFFLINE: t('ESTORE_OFFLINE_PAYMENT_MODAL_TITLE', 'Offline Payment'),
  STRIPE: 'Credit or Debit Card (processed by Stripe)',
};

// estore 使用视频集合
export const tutorialVideos = [
  {
    src: '/clientassets/portal/v2/videos/saas/estore/setting_up_price_sheets_in_zno_estore.mp4',
    placeholderImg: '',
    videoTitle: 'Setting Up Price Sheets in Zno Estore',
  },
];
export const cnEstoreTutorialVideos = [
  {
    src: '/clientassets-cunxin-saas/portal/groupVideos/estore/摄影师如何开通在线商店.mp4',
    placeholderImg:
      '/clientassets-cunxin-saas/portal/groupVideos/placeholderImgs/estore/摄影师如何开通在线商店.jpg',
    videoTitle: '摄影师如何开通在线商店',
  },
  {
    src: '/clientassets-cunxin-saas/portal/groupVideos/estore/客户如何在线选购产品下单.mp4',
    placeholderImg:
      '/clientassets-cunxin-saas/portal/groupVideos/placeholderImgs/estore/客户如何在线选购产品下单.jpg',
    videoTitle: '客户如何在线选购产品下单',
  },
  {
    src: '/clientassets-cunxin-saas/portal/groupVideos/estore/摄影师如何管理在线商店订单.mp4',
    placeholderImg:
      '/clientassets-cunxin-saas/portal/groupVideos/placeholderImgs/estore/摄影师如何管理在线商店订单.jpg',
    videoTitle: '摄影师如何管理在线商店订单',
  },
];

export const appActionStorageKey = 'estore-app-actions';

export const appActionNamesEnum = {
  SAVE_DATA: 'save-data',
};

export const appActionModuleNamesEnum = {
  PRODUCTS_PRICING: 'price-sheet-pricing',
};
