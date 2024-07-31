import loadable from '@loadable/component';
import React from 'react';

import { guid } from '@resource/lib/utils/math';

/**
 * 国际化产品的路由配置
 */
const routes = [
  {
    path: '/',
    id: guid(),
    pageName: 'App',
    exact: false,
    component: loadable(() => import('@apps/live-photo-client-mobile/containers/App')),
  },
  {
    path: '/home',
    id: guid(),
    exact: true,
    pageName: 'HOME',
    component: loadable(() => import('@apps/live-photo-client-mobile/containers/Home')),
  },
  {
    path: '/login',
    id: guid(),
    exact: true,
    pageName: 'HOME',
    component: loadable(() => import('@apps/live-photo-client-mobile/containers/Login')),
  },
];

export default routes;
