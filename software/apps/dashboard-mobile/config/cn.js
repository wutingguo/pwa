import loadable from '@loadable/component';
import React from 'react';

import { guid } from '@resource/lib/utils/math';

import { saasProducts } from '@resource/lib/constants/strings';

/**
 * 国际化产品的路由配置
 */
// const baseRouter = __isCN__ ? '@apps/dashboard-mobile/containers/localization/' : '@apps/dashboard-mobile/containers/international/'

const routes = [
  {
    path: '/software/gallery',
    id: guid(),
    exact: false,
    pageName: 'GALLERY',
    product: saasProducts.gallery,
    component: loadable(() => import('@apps/dashboard-mobile/containers/base/App')),
    routes: [
      // {
      //   path: '/',
      //   id: guid(),
      //   pageName: 'App',
      //   exact: false,
      //   component: loadable(() => import('@apps/dashboard-mobile/containers/localization/App')),
      // },

      {
        path: '/collection',
        id: guid(),
        exact: true,
        pageName: 'HOME',
        component: loadable(() => import('@apps/dashboard-mobile/containers/localization/Home')),
      },
      {
        path: '/creatCollect',
        id: guid(),
        exact: true,
        pageName: 'CreatCollect',
        component: loadable(() =>
          import('@apps/dashboard-mobile/containers/localization/CreatCollect')
        ),
      },
      {
        path: '/download/:id',
        id: guid(),
        exact: true,
        pageName: 'DownLoad',
        component: loadable(() =>
          import('@apps/dashboard-mobile/containers/localization/DownLoadHistory')
        ),
      },
      {
        path: '/favorite-detail/:id/:guestUid',
        id: guid(),
        exact: true,
        pageName: 'FavoriteDetail',
        component: loadable(() =>
          import('@apps/dashboard-mobile/containers/localization/FavoriteDetail')
        ),
      },
      {
        path: '/favorite/:id',
        id: guid(),
        exact: true,
        pageName: 'Favorite',
        component: loadable(() =>
          import('@apps/dashboard-mobile/containers/localization/Favorite')
        ),
      },
      {
        path: '/gallery-detail',
        id: guid(),
        exact: true,
        pageName: 'GalleryDetail',
        component: loadable(() =>
          import('@apps/dashboard-mobile/containers/localization/GalleryDetail')
        ),
      },
      {
        path: '/favorite-setting/:id',
        id: guid(),
        exact: true,
        pageName: 'FavoriteSetting',
        component: loadable(() =>
          import('@apps/dashboard-mobile/containers/localization/FavoriteSetting')
        ),
      },
      {
        path: '/watermark-setting',
        id: guid(),
        exact: true,
        pageName: 'WatermarkSetting',
        component: loadable(() =>
          import('@apps/dashboard-mobile/containers/localization/WatermarkSetting')
        ),
      },
      {
        path: '/watermark-edit',
        id: guid(),
        exact: true,
        pageName: 'WatermarkEdit',
        component: loadable(() =>
          import('@apps/dashboard-mobile/containers/localization/WatermarkEdit')
        ),
      },
      {
        path: '/gallery-setting',
        id: guid(),
        exact: true,
        pageName: 'GallerySetting',
        component: loadable(() =>
          import('@apps/dashboard-mobile/containers/localization/GallerySetting')
        ),
      },
      {
        path: '/download-setting',
        id: guid(),
        exact: true,
        pageName: 'DownloadSetting',
        component: loadable(() =>
          import('@apps/dashboard-mobile/containers/localization/DownloadSetting')
        ),
      },
      {
        path: '/adding-tablets',
        id: guid(),
        exact: true,
        pageName: 'AddingTablets',
        component: loadable(() =>
          import('@apps/dashboard-mobile/containers/localization/AddingTablets')
        ),
      },
      {
        path: '/addition-rule',
        id: guid(),
        exact: true,
        pageName: 'AdditionRule',
        component: loadable(() =>
          import('@apps/dashboard-mobile/containers/localization/AdditionRule')
        ),
      },
    ],
  },
];

export default routes;
