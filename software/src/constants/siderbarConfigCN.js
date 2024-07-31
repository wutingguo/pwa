import React from 'react';

// import liveNew from '../components/XSiderbar/image/live_new.png';
import liveHot from '../components/XSiderbar/image/live_hot.png';

export const siderbarConfigCN = [
  {
    displayName: '工作台',
    icon: 'home',
    path: '/software/dashboard/',
    logEventName: 'SaaSCN_PC_Home_Click_Enterworkspace',
    userId: 'userId',
  },
  {
    displayName: '设计软件',
    icon: 'cloud_design',
    subMenu: [
      {
        displayName: '全部作品',
        path: '/software/designer/projects',
        logEventName: 'Designer_Click_DesignerProjectList',
      },
      {
        displayName: '素材管理',
        path: '/software/designer/my-materials',
        logEventName: 'Designer_Click_Material',
      },
      {
        displayName: '影像订单',
        path: '/software/designer/my-orders',
        logEventName: 'Designer_Click_YXTab',
      },
    ],
  },
  {
    displayName: '选片软件',
    icon: 'cloud_gallery',
    subMenu: [
      {
        displayName: t('选片库'),
        path: '/software/gallery/collection',
        logEventName: '',
      },
      {
        displayName: t('GALLERY_SETTINGS'),
        path: '/software/gallery/settings',
        logEventName: '',
      },
      // {
      //   displayName: t('GALLERY_TOOLS'),
      //   path: '/software/gallery/tools',
      //   logEventName: ''
      // },
      {
        displayName: t('ESTORE'),
        path: '/software/e-store/orders',
        logEventName: 'Estore_Click_Estore',
      },
    ],
  },
  {
    displayName: (
      <span>
        <span>{t('LP_INSTANT')}</span>
        {/* <img src={liveHot} style={{ width: 40, marginLeft: '8px', verticalAlign: 'bottom' }} /> */}
      </span>
    ),
    icon: 'cloud_live',
    subMenu: [
      {
        displayName: t('LP_ALBUMS'),
        path: '/software/live/photo',
        logEventName: '',
      },
      {
        displayName: t('LP_RECYCLE_BIN'),
        path: '/software/live/recycle-album',
        logEventName: '',
      },
    ],
  },
  {
    displayName: '智能修图',
    icon: 'cloud_aiphoto',
    subMenu: [
      {
        displayName: t('批量修图'),
        path: '/software/aiphoto/collection',
        logEventName: '',
      },
    ],
  },
  {
    displayName: t('动感MV'),
    icon: 'cloud_slide_show',
    subMenu: [
      {
        displayName: t('MV列表'),
        path: '/software/slide-show/collection',
        logEventName: 'Slideshow_Click_Slideshow',
      },
    ],
  },

  // {
  //   displayName: '在线选品',
  //   icon: 'cloud_selection',
  //   subMenu: [
  //     {
  //       displayName: '商品库',
  //       path: '/software/selection/collect',
  //       logEventName: ''
  //     },
  //     {
  //       displayName: '客户选品',
  //       path: '/software/selection/user-selection',
  //       logEventName: ''
  //     }
  //   ]
  // }
];
