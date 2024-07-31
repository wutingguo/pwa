import { saasProducts } from '@resource/lib/constants/strings';
import { guid } from '@resource/lib/utils/math';
import aiphotoPNG from '@resource/static/icons/aiphoto.png';
import designerPNG from '@resource/static/icons/designer.png';
import galleryPNG from '@resource/static/icons/gallery.png';
import dashboardPNG from '@resource/static/icons/home.png';
import livePNG from '@resource/static/icons/live.png';
import selectionPNG from '@resource/static/icons/selection.png';
import slideShowPNG from '@resource/static/icons/slideshow_HD.png';

const cnLink = [
  {
    id: guid(),
    pageName: 'DASHBOARD',
    product: saasProducts.dashboard,
    path: '/software/dashboard/',
    icon: dashboardPNG,
  },
  {
    id: guid(),
    pageName: 'DESIGNER',
    product: saasProducts.designer,
    path: '/software/designer/projects',
    icon: designerPNG,
  },
  {
    id: guid(),
    pageName: 'GALLERY',
    product: saasProducts.gallery,
    path: '/software/gallery/collection',
    icon: galleryPNG,
  },
  {
    id: guid(),
    pageName: 'SAAS_LIVE',
    product: saasProducts.live,
    path: '/software/live/photo',
    icon: livePNG,
  },
  {
    id: guid(),
    pageName: 'AIPHOTO_CN',
    product: saasProducts.aiphoto,
    path: '/software/aiphoto/collection',
    icon: aiphotoPNG,
  },
  {
    id: guid(),
    pageName: 'SLIDE_SHOW',
    product: saasProducts.slideshow,
    path: '/software/slide-show/collection',
    icon: slideShowPNG,
  },
  // {
  //   id: guid(),
  //   pageName: 'SELECTION_CN',
  //   product: saasProducts.selection,
  //   path: '/software/selection/collect',
  //   icon: selectionPNG
  // }
];

const enLink = [
  {
    id: guid(),
    pageName: 'GALLERY',
    product: saasProducts.gallery,
    path: '/software/gallery/collection',
    // icon: galleryPNG
  },
  {
    id: guid(),
    pageName: 'WEBSITE',
    product: saasProducts.website,
    path: '/software/website/projects',
  },
  {
    id: guid(),
    pageName: 'SLIDE_SHOW',
    product: saasProducts.slideshow,
    path: '/software/slide-show/collection',
  },
  {
    id: guid(),
    pageName: 'Instant',
    product: saasProducts.live,
    path: '/software/live/photo',
  },
  {
    id: guid(),
    pageName: 'RETOUCHER',
    product: saasProducts.retoucher,
    path: '/software/retoucher/collection',
  },
  {
    id: guid(),
    pageName: 'DESIGNER',
    product: saasProducts.designer,
    path: '/software/designer/projects',
    // icon: designerPNG
  },
  // {
  //   id: guid(),
  //   pageName: 'ESTORE',
  //   product: saasProducts.retoucher,
  //   path: '/software/e-store/orders'
  // }
];

export default [].concat(__isCN__ ? cnLink : enLink);
