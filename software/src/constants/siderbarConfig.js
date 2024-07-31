import React from 'react';

import { saasProducts, websiteRoleEnum } from '@resource/lib/constants/strings';

import liveHot from '../components/XSiderbar/image/live_hot.png';
import liveNew from '../components/XSiderbar/image/live_new.png';

export const siderbarConfig = [
  {
    displayName: (
      <span>
        <span>{t('GALLERY')}</span>
        <img src={liveHot} style={{ width: 40, marginLeft: '8px', verticalAlign: 'baseline' }} />
      </span>
    ),
    icon: 'cloud_gallery',
    product: saasProducts.gallery,
    subMenu: [
      {
        displayName: t('GALLERY_COLLECTION'),
        path: '/software/gallery/collection',
        logEventName: 'Gallery_Click_Collections',
      },
      {
        displayName: t('GALLERY_SETTINGS'),
        path: '/software/gallery/settings',
        logEventName: 'Gallery_Click_Settings',
      },
      {
        displayName: t('ESTORE'),
        path: '/software/e-store',
        logEventName: 'Estore_Click_Estore',
      },
      // {
      //   displayName: t('GALLERY_TOOLS'),
      //   path: '/software/gallery/tools',
      //   logEventName: 'Gallery_Click_Tools'
      // }
    ],
  },
  {
    displayName: t('WEBSITE'),
    icon: 'website',
    product: saasProducts.website,
    hidden: location.host.startsWith('www'),
    subMenu: [
      {
        displayName: t('WEBSITE'),
        path: '/software/website/projects',
        logEventName: 'Website_Click_Website',
        websiteRole: [websiteRoleEnum.admin, websiteRoleEnum.user],
      },
      {
        displayName: t('WEBSITE_DESIGNER'),
        path: '/software/website/designer',
        logEventName: 'Website_Click_WebsiteDesigner',
        // 角色白名单
        websiteRole: [websiteRoleEnum.admin, websiteRoleEnum.designer],
      },
    ],
  },
  {
    displayName: t('SLIDE_SHOW'),
    icon: 'cloud_slide_show',
    product: saasProducts.slideshow,
    subMenu: [
      {
        displayName: t('SLIDE_SHOW'),
        path: '/software/slide-show/collection',
        logEventName: 'Slideshow_Click_Slideshow',
      },
      {
        displayName: t('GALLERY_SETTINGS'),
        path: '/software/slide-show/settings',
        logEventName: 'Slideshow_Click_Settings',
      },
    ],
  },
  {
    displayName: (
      <span>
        <span>{t('LP_INSTANT')}</span>
        <img src={liveNew} style={{ width: 40, marginLeft: '8px', verticalAlign: 'baseline' }} />
      </span>
    ),
    icon: 'cloud_live',
    product: saasProducts.live,
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
  // {
  //   displayName: t('ESTORE'),
  //   icon: 'cloud_gallery',
  //   subMenu: [
  //     {
  //       displayName: t('DASHBOARD'),
  //       path: '/software/e-store',
  //       logEventName: ''
  //     }
  //   ]
  // },
  {
    displayName: t('RETOUCHER'),
    icon: 'cloud_aiphoto',
    product: saasProducts.retoucher,
    subMenu: [
      {
        displayName: t('COLLECTIONS'),
        path: '/software/retoucher/collection',
        logEventName: '',
      },
    ],
  },
  {
    displayName: t('DESIGNER'),
    icon: 'cloud_design',
    product: saasProducts.designer,
    subMenu: [
      {
        displayName: t('PROJECTS'),
        path: '/software/designer/projects',
        logEventName: 'Designer_Click_DesignerProject',
      },
      {
        displayName: t('MY_ORDERS'),
        path: '/software/designer/my-orders',
        logEventName: 'Designer_Click_MyOrders',
      },
    ],
  },
];
