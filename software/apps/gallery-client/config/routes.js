import loadable from '@loadable/component';
import React from 'react';

import { guid } from '@resource/lib/utils/math';

const printStoreRoute = {
  path: '/printStore',
  id: guid(),
  exact: false,
  pageName: 'PRINYSTORE',
  component: loadable(() => import('@apps/gallery-client/containers/PrintStore')),
  redirectTo: '/printStore/categories',
  routes: [
    {
      path: '/products',
      id: guid(),
      exact: true,
      pageName: 'PRINYSTORE_PRODUCTS',
      component: loadable(() => import('@apps/gallery-client/containers/PrintStore/Product')),
    },
    {
      path: '/categories',
      id: guid(),
      exact: true,
      pageName: 'PRINYSTORE_CATEGORIES',
      component: loadable(() => import('@apps/gallery-client/containers/PrintStore/Categories')),
    },
    {
      path: '/shopping-cart',
      id: guid(),
      exact: true,
      options: {
        needLogin: true,
      },
      pageName: 'PRINYSTORE_SHOPCART',
      component: loadable(() => import('@apps/gallery-client/containers/PrintStore/ShopCart')),
    },
    {
      path: '/shopping-cart/shipping',
      id: guid(),
      exact: true,
      options: {
        noHeader: true,
        needLogin: true,
      },
      pageName: 'PRINYSTORE_SHIPPING',
      component: loadable(() => import('@apps/gallery-client/containers/PrintStore/Shipping')),
    },
    {
      path: '/shopping-cart/shipping/billing',
      id: guid(),
      exact: true,
      options: {
        noHeader: true,
        needLogin: true,
      },
      pageName: 'PRINYSTORE_SHIPPING',
      component: loadable(() => import('@apps/gallery-client/containers/PrintStore/Order')),
    },
    {
      path: '/order-success',
      id: guid(),
      exact: true,
      options: {
        noHeader: true,
      },
      pageName: 'PRINYSTORE_ORDER_SUCCESS',
      component: loadable(() => import('@apps/gallery-client/containers/PrintStore/OrderSuccess')),
    },
    {
      path: '/orders/:orderNum',
      id: guid(),
      exact: true,
      options: {
        noHeader: true,
      },
      pageName: 'PRINYSTORE_ORDERS',
      component: loadable(() => import('@apps/gallery-client/containers/PrintStore/Orders')),
    },
  ],
};

/**
 * 国际化产品的路由配置
 */
const routes = [
  {
    path: '/',
    id: guid(),
    pageName: 'App',
    exact: false,
    component: loadable(() => import('@apps/gallery-client/containers/App')),
    // component: loadable(() => import('@apps/gallery-client/containers/Home')),
  },
  {
    path: '/expiry',
    id: guid(),
    exact: true,
    pageName: 'EXPIRY',
    component: loadable(() => import('@apps/gallery-client/containers/Expiry')),
  },
  {
    path: '/payment/:status',
    exact: true,
    id: guid(),
    pageName: 'ESTORE_PAYMENT',
    component: loadable(() => import('@apps/gallery-client/containers/EstorePayment')),
  },
  {
    path: '/',
    id: guid(),
    exact: true,
    pageName: 'HOME',
    component: loadable(() => import('@apps/gallery-client/containers/Home')),
  },
  {
    path: '/home',
    id: guid(),
    exact: true,
    pageName: 'HOME',
    component: loadable(() => import('@apps/gallery-client/containers/Home')),
  },
  {
    path: '/other-help',
    id: guid(),
    exact: true,
    pageName: 'AIPHOTO',
    component: loadable(() => import('@apps/gallery-client/containers/Aiphoto')),
  },
  printStoreRoute,
];

export { printStoreRoute };

export default routes;
