import React from 'react';
import loadable from '@loadable/component';
import { guid } from '@resource/lib/utils/math';

/**
 * 国际化产品的路由配置
 */
const routes = [
  {
    path: '/',
    id: guid(),
    exact: true,
    pageName: 'SELECTION_CLIENT', 
    component: loadable(() => import('@apps/selection-client-mobile/containers/App'))
  },
  {
    path: '/products-list',
    id: guid(),
    exact: true,
    pageName: 'SELECTION_CLIENT_LIST',
    component: loadable(() => import('@apps/selection-client-mobile/containers/List'))
  },
  {
    path: '/products-details',
    id: guid(),
    exact: true,
    pageName: 'SELECTION_CLIENT_PRODUCTS',
    component: loadable(() => import('@apps/selection-client-mobile/containers/Products'))
  },
];

export default routes;
