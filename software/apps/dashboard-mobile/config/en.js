import loadable from '@loadable/component';
import React from 'react';

import { guid } from '@resource/lib/utils/math';

/**
 * 国际化产品的路由配置
 */
// const baseRouter = __isCN__ ? '@apps/dashboard-mobile/containers/localization/' : '@apps/dashboard-mobile/containers/international/'
const routes = [
  // {
  //     path: '/',
  //     id: guid(),
  //     pageName: 'App',
  //     exact: false,
  //     component: loadable(() => import('@apps/dashboard-mobile/containers/international/App'))
  // },
  // {
  //     path: '/home',
  //     id: guid(),
  //     exact: true,
  //     pageName: 'HOME',
  //     component: loadable(() => import('@apps/dashboard-mobile/containers/international/Home'))
  // },
];
export default routes;
