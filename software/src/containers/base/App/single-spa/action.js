import { get } from 'lodash';
import qs from 'qs';
let timer;

// 定义购物车流程相关的页面.
const shoppingCartPages = [
  'shopping-cart',
  // 'checkout',
  'change-shipping-address',
  // 'billing-review',
  'order-confirm',
  'ds-order-form',
  'ds-billing-review'
  // 'pro-credits-earned'
];

const galleryOrSlideshowPages = [
  'gallery',
  'slide-show'
];

/**
 * 检查是否为购物车流程页面.
 * @param {string} pathname 
 */
const checkIsInPages = (pages, pathname) => {
  // 1）Shopping Cart （/shopping-cart）
  // 2）Check Out （/checkout）
  // 3）Change Shipping Address（/change-shipping-address）
  // 4）Billing Review （/billing-review）
  // 5）Order Confirm / 支付结果页 （/order-confirm）
  // 6）Pro Plan用户获得积分说明页 （/pro-credits-earned ）
  // 7）Design Service Order-form / 支付结果页 （/ds-order-form ）
  // 8）Design Service 支付界面 （/ds-billing-review ）
  // 9）Design Service 订单支付完成后详情页面 （/ds-order-confirm ）
  return !!pages.find(page => {
    // return pathname.indexOf(v) !== -1;
    return pathname.split("/").filter(Boolean).pop() == page
  });
};

const getNavbarData = ({ pathname }) => {
  // 1. 购物车流程涉及相关页面Header只保留Zno LOGO(且不可点)
  // 2. My Stuff在所有SAAS产品露出，Help仅切换至Designer时露出
  // 3. gallery 和slides show 不用显示projects
  const isShoppingCartPage = checkIsInPages(shoppingCartPages, pathname);
  if (isShoppingCartPage) {
    return {
      help: { isShow: false },
      labs: { isShow: false },
      project: { isShow: false },
      stuff: { isShow: false },
      projectToggle: { isShow: true }
    }
  }

  const isGalleryOrSlideshowPage = checkIsInPages(galleryOrSlideshowPages, pathname);
  if (isGalleryOrSlideshowPage) {
    return {
      help: { isShow: false },
      labs: { isShow: false },
      project: { isShow: false },
      stuff: { isShow: true },
      projectToggle: { isShow: true }
    }
  }

  return {
    help: { isShow: true },
    labs: { isShow: true },
    project: { isShow: true },
    stuff: { isShow: true },
    projectToggle: { isShow: true }
  }
};

/**
 * 更新navbar应用中. 显示help和project按钮.
 * @param {*} that 
 */
const updateNavbarItems = that => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    const { dispatch } = get(that.props, '$global.stores.navbar');
    const { location } = window;

    // isStuffShow = this.props.location.
    dispatch({
      type: 'UPDATE_NAVBAR_ITEMS',
      data: getNavbarData(location)
    });
  }, 10);
};

/**
 * 更新navbar应用中. 隐藏help和project按钮.
 * @param {*} that 
 */
const clearNavbarItems = that => {
  const { dispatch } = get(that.props, '$global.stores.navbar');

  dispatch({
    type: 'CLEAR_NAVBAR_ITEMS'
  });
};

/**
 * 把url上的querystring转换成object对象, 并存储到store上.
 */
const parser = (that) => {
  const { dispatch } = get(that.props, '$global.stores.navbar');

  const value = qs.parse(window.location.search.substr(1));
  const hash = window.location.hash.substr(1);
  let currentProjectName = '';

  // 匹配/box?xxx中的box.
  const reg = /\/(\w+)\??/;
  if (reg.test(hash)) {
    currentProjectName = RegExp.$1;
  }

  dispatch({
    type: 'PARSER_QUERYSTRING',
    value: Object.assign({}, value, { currentProjectName })
  });
};

const resetQs = that => {
  const { dispatch } = get(that.props, '$global.stores.navbar');

  dispatch({
    type: 'RESET_QUERYSTRING'
  });
}

export default {
  updateNavbarItems,
  clearNavbarItems,
  parser,
  resetQs
};