import loadable from '@loadable/component';
import React from 'react';

import { guid } from '@resource/lib/utils/math';

/**
 * 影像商品库路由配置
 */
const routes = [
  {
    path: '/',
    id: guid(),
    pageName: 'App',

    exact: false,
    component: loadable(() => import('@apps/commodity-client/containers/App')),
  },
  {
    path: '/home',
    id: guid(),
    exact: true,
    pageName: 'HOME',
    component: loadable(() => import('@apps/commodity-client/containers/Home')),
  },
  {
    path: '/expiry',
    id: guid(),
    exact: true,
    pageName: 'EXPIRY',
    component: loadable(() => import('@apps/commodity-client/containers/Expiry')),
  },
];

export default routes;
