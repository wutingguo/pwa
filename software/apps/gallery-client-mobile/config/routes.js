import loadable from '@loadable/component';
import React from 'react';

import { guid } from '@resource/lib/utils/math';

const printStoreRoute = {
  path: '/printStore',
  id: guid(),
  exact: false,
  pageName: 'PRINYSTORE',
  component: loadable(() => import('@apps/gallery-client-mobile/containers/PrintStore')),
  redirectTo: '/printStore/categories',
  routes: [
    {
      path: '/products',
      id: guid(),
      exact: true,
      pageName: 'PRINYSTORE_PRODUCTS',
      component: loadable(() =>
        import('@apps/gallery-client-mobile/containers/PrintStore/Product')
      ),
    },
    {
      path: '/categories',
      id: guid(),
      exact: true,
      pageName: 'PRINYSTORE_CATEGORIES',
      options: {
        backLink: '/home',
      },
      component: loadable(() =>
        import('@apps/gallery-client-mobile/containers/PrintStore/Categories')
      ),
    },
    {
      path: '/shopping-cart',
      id: guid(),
      exact: true,
      options: {
        needLogin: true,
        headerTitle: 'Cart',
        hideRightButton: true,
        backLink: '/printStore/categories',
      },
      pageName: 'PRINYSTORE_SHOPCART',
      component: loadable(() =>
        import('@apps/gallery-client-mobile/containers/PrintStore/ShopCart')
      ),
    },
    {
      path: '/shopping-cart/shipping',
      id: guid(),
      exact: true,
      options: {
        needLogin: true,
        headerTitle: 'Shipping',
        hideRightButton: true,
      },
      pageName: 'PRINYSTORE_SHIPPING',
      component: loadable(() =>
        import('@apps/gallery-client-mobile/containers/PrintStore/Shipping')
      ),
    },
    {
      path: '/shopping-cart/shipping/billing',
      id: guid(),
      exact: true,
      options: {
        needLogin: true,
        headerTitle: 'Order',
        hideRightButton: true,
      },
      pageName: 'PRINYSTORE_SHIPPING',
      component: loadable(() => import('@apps/gallery-client-mobile/containers/PrintStore/Order')),
    },
    {
      path: '/order-success',
      id: guid(),
      exact: true,
      options: {
        noHeader: true,
      },
      pageName: 'PRINYSTORE_ORDER_SUCCESS',
      component: loadable(() =>
        import('@apps/gallery-client-mobile/containers/PrintStore/OrderSuccess')
      ),
    },
    {
      path: '/orders/:orderNum',
      id: guid(),
      exact: true,
      options: {
        noHeader: false,
      },
      pageName: 'PRINYSTORE_ORDERS',
      component: loadable(() => import('@apps/gallery-client-mobile/containers/PrintStore/Orders')),
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
    component: loadable(() => import('@apps/gallery-client-mobile/containers/App')),
  },
  {
    path: '/expiry',
    id: guid(),
    exact: true,
    pageName: 'EXPIRY',
    component: loadable(() => import('@apps/gallery-client/containers/Expiry')),
  },
  {
    path: '/',
    id: guid(),
    exact: true,
    pageName: 'HOME',
    component: loadable(() => import('@apps/gallery-client-mobile/containers/Home')),
  },
  {
    path: '/home',
    id: guid(),
    exact: true,
    pageName: 'HOME',
    component: loadable(() => import('@apps/gallery-client-mobile/containers/Home')),
  },
  {
    path: '/editor',
    id: guid(),
    exact: true,
    pageName: 'EDITOR',
    component: loadable(() => import('@apps/gallery-client-mobile/containers/Editor')),
  },
  printStoreRoute,
  // {
  //   path: '/portfolio',
  //   id: guid(),
  //   exact: true,
  //   pageName: 'PORTFOLIO',
  //   component: loadable(() => import('@apps/gallery-client-mobile/containers/Home'))
  // },
];
export { printStoreRoute };

export default routes;
