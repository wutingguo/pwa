export const foilImgSizes = {
  '6X6': { width: 620, height: 620 },
  '8X8': { width: 860, height: 860 },
  '10X10': { width: 1100, height: 1100 },
  '12X12': { width: 1320, height: 1320 },
  '14X4': { width: 1550, height: 400 },
  '14X6': { width: 1550, height: 620 },
  '14X12': { width: 1550, height: 1320 }
};

export const foilCopperOptionMap = {
  '6X6': '60X60',
  '8X8': '80X80',
  '11X11': '120X120',
  '12X12': '120X120',
  '10X10': '100X100',

  // 高级定制
  '14X4': '140X40',
  '14X6': '140X60',
  '14X12': '140X120'
};

export const uploadStatus = {
  PENDING: 'PENDING',
  DONE: 'DONE',
  PROGRESS: 'PROGRESS',
  FAIL: 'FAIL'
};

export const supportedImagesTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/x-png',
  'image/png'
];

export const disableCopyList = [
  'V2_LLGPPOSTCARDS',
  'WA_METALFRAME',
  'WA_SOLIDWOOD',
  'TT_SOLIDWOODFRAMETABIE'
];

export const newSuiteTypes = [
  'V2_LIKEMINDSUIT',
  'V2_CHINESESUIT',
  'V2_MASTERSET',
  'V2_HEAVENMADEMATCHSUIT',
  'V2_LLGPSUIT'
];

export const firstOrderProducts = ['V2_CNPAPERCOVERBOOK'];

// 所有产品类型
export const PRODUCTMAPS = {
  photobook: [
    'V2_HARDCOVERBOOK',
    'V2_PAPERCOVERBOOK',
    'PB_ELEGANTCLOTH',
    'V2_LEATHERETTECOVERBOOK',
    'PB_GENUINELEATHER',
    'V2_ELEGANTALBUM',
    'V2_LIFETIMEBOOK',
    'V2_LOVEFIRSTSIGHTBOOK',
    'V2_PASSIONBOOK',
    'PB_ULTIMATELEATHER',
    'V2_ENVELOPESETBOOK',
    'V2_PIGLETBOOK',
    'V2_CATCLAWSETBOOK',
    'V2_ELEPHANTBOOK',
    'PB_ACARONALBUM',
    'V2_WEDDINGALBUM',
    'V2_SIMPLEBOOK',
    'PB_LINENSERIES',
    'PB_CHINESESTYLEALBUM',
    'PB_CHILDRENEMBROIDERYALBUM'
  ],
  wallarts: [
    'V2_CONTEMPORARYFRAME',
    'WA_MODERNPICTUREFRAME',
    'V2_CLASSICFRAME',
    'WA_VINTAGEFRAME',
    'V2_METALFRAME',
    'V2_CP',
    'WA_PAINTINGFRAME',
    'V2_WARMOUNTED',
    'V2_FC',
    'WA_FRAMEDOILPAINTING',
    'V2_WARMETAL',
    'V2_WARWOOD',
    'V2_WARACRYLIC',
    'V2_LOGFRAME',
    'V2_YX_ACRYLICPLAQUE',
    'TT_ACRYLIC_PLAQUE',
    'TT_METALPRINTINGTABLE',
    'TT_WOODPLAQUE',
    'V2_YX_WOODPLAQUE',
    'V2_YX_METALPLAQUE',
    'TT_SOLIDWOODFRAMETABIE',
    'TT_METALFRAMETABLE',
    'WA_SOLIDWOOD',
    'WA_METALFRAME',
    'WA_LINKFRAME',
    'WA_SOLIDWOODPRINTBOX',
    'WA_METALPRINTFRAME'
  ],
  magneticframe: ['V2_MAGNETICGCANVAS'],
  magneticcanvasdraw: ['V2_MAGNETICGCANVASDRAW'],
  proprints: ['V2_FOLIOBOX', 'FolioGroup'],
  box: ['V2_USBCASE', 'V2_WOODBOX', 'V2_IMAGEBOX'],
  calendar: ['V2_ARTCALENDAR', 'PC_SIMPLEDESKCALENDAR']
};

// 自定义spec配置展示字段
export const customSpecSettingLabel = {
  size: 'CUSTOM_SPEC_SIZE',
  pages: 'CUSTOM_SPEC_PAGES'
};

export const makeParamsMap = {
  product1: ['giftpackprocuct'],
  type: ['bookType'],
  pages: ['combination'],
  leatherColor: ['color'],
  countPages: ['pages']
};

export const transferMakeParams = [
  'category',
  'product',
  'cover',
  'size',
  'product1',
  'color',
  'boxThickness',
  'paper',
  'specProductType',
  'littleboxedprintQuantity',
  'type',
  'bookThickness',
  'decorate',
  'style',
  'canvasBorderSize',
  'metalPrintType',
  'wart-finish',
  'woodprintmerge',
  'folioboxQuantity',
  'packagingOptions',
  'mountOptions',
  'pgcolor',
  'frontCover',
  'backCover',
  'finish',
  'zodiacSigns',
  'hardCoverStyle',
  'capacity',
  'insidepanel',
  'pages',
  'pageCount',
  'flyInterColor',
  'boxinsidepanel',
  'mountedprintmerge',
  'frame-type',
  'frameStyle',
  'metalFrameStyle',
  'frameClassicStyle',
  'framefloatStyle',
  'ffmerge',
  'ffshape',
  'metalPrintmerge',
  'wart-finish',
  'wallsetframe',
  'priceWidget',
  'frameCollageFrame',
  'mergeCollageFrame',
  'shapeCollageFrame',
  'paperCollageFrame',
  'boxcover',
  'box2color',
  'usbcapacity',
  'usbinsidepanel',
  'primeUsbCover',
  'primeUsbColor',
  'primeUsbCapacity',
  'primeUsbinsidePanel',
  'girdleBgColor',
  'coverDesign',
  'boxholdertype',
  'dvdprinted',
  'embroid_type',
  'leatherColor',
  'countPages',
  'wood_frame_style',
  'metal_frame_style',
  'flysheet_type',
  'leatherette_style',
  'genuine_leather_style',
  'linen_style',
  'embroid_design',
  'genuine_leather_style',
  'box_bag_type',
  'wallart_paper',
  'frame_style_type',
  'print_finish',
  'sample_product_type',
  'book_jacket_color',
  'box_depth_option'
];

export const CDN_PREFIX = 'https://static.cunxin.com/';

export const orderStatusMap = {
  UNPAID: 'UNPAID', // 未支付
  PAID: 'PAID', // 支付成功
  IN_SCHEDULE: 'IN_SCHEDULE', // 支付成功
  IN_PREPARE: 'IN_PREPARE', // 支付成功
  IN_PRODUCTION: 'IN_PRODUCTION', // 生产中
  IN_SHIPPING: 'IN_SHIPPING', // 已发货
  CANCELLED: 'CANCELLED', // 已取消
  COMPLETED: 'COMPLETED', // 已完成
  // 增加 design service 订单
  RECEIVED: 'RECEIVED',
  IN_SERVICE: 'IN_SERVICE',
  PROOF: 'PROOF',
  CLOSED: 'CLOSED'
};

// 增加订单类型
export const serviceTypeMap = {
  NORMAL: 0,
  DESIGN_SERVICE: 1
};

export const orderStatusText = {
  UNPAID: '未付款',
  PAID: '支付成功',
  IN_SCHEDULE: '支付成功',
  IN_PREPARE: '支付成功',
  IN_PRODUCTION: '生产中',
  IN_SHIPPING: '已发货',
  CANCELLED: '已取消',
  COMPLETED: '已完成'
};

export const shippingStatusText = ['未发货', '部分发货', '全部发货'];

export const ADDRESS_SELECT_LABELS = [
  {
    key: 'province',
    label: '省'
  },
  {
    key: 'city',
    label: '市'
  },
  {
    key: 'area',
    label: '区'
  },
  {
    key: 'street',
    label: '街道'
  }
];

export const AREA_LEVEL = {
  city: 3,
  area: 4,
  street: 5
};

export const AREA_SUB_MAP = {
  province: 'citys',
  city: 'areas',
  area: 'streets'
};

export const ADDRSS_NEXT_STATE = {
  province: 'city',
  city: 'area',
  area: 'street'
};

export const ADDRSS_PREV_STATE = {
  city: 'province',
  area: 'city',
  street: 'area'
};

export const processStatusClass = ['', 'processing', 'active'];

// 过滤不需要展示的项
export const productCategorysFilter = ['ALL', 'MN', 'HP', 'SMB'];

export const customUnitLabelMap = {
  inch: t('LABS_INCHES'),
  mm: t('LABS_MM'),
  px: t('LABS_PIXEL'),
  cm: t('LABS_CM')
};
export const usCustomUnitLabelMap = {
  inch: t('LABS_INCHES_NEW'),
  mm: t('LABS_MM_NEW'),
  px: t('LABS_PIXEL_NEW'),
  cm: t('LABS_CM_NEW')
};

export const transferAddedKeys = [
  'coverDesign',
  'embroid_type',
  'countPages',
  'girdleBgColor',
  'paper',
  'flyInterColor',
  'flysheet_type',
  'leatherette_style',
  'genuine_leather_style',
  'linen_style',
  'embroid_design',
  'print_finish',
  'book_jacket_color',
  'box_depth_option',
  'eggshell_leatherette_style',
  'pages',
  'china_album_style',
  'wood_frame_style',
  'metal_frame_style',
  'frame_style_type',
  'wallart_paper'
];

// category 下拉部分选项需隐藏
export const hideCategoryCodeMap = ['SS', 'ST', 'S'];

// product 待下线的产品需隐藏
export const hideProductCodeMap = [
  'V2_ALBUMUSBSET',
  'V2_WEDDINGALBUM',
  'V2_LINVILLE_SET',
  'V2_PRIME_USB_SET',
  'V2_LITTLEPRINTSPACK',
  'V2_WOODBOX',
  'PB_PARENT_BOOK'
];

export const hideOptionKeys = ['addpage_type'];

// gallery 使用视频集合
export const designerTutorialVideos = [
  {
    src: '/clientassets-zno-saas/designer/designer-tutorial-videos/ablum-seconds.mp4',
    placeholderImg: '',
    videoTitle: 'How to design an album in seconds'
  },
  {
    src: '/clientassets-zno-saas/designer/designer-tutorial-videos/online-poorf.mp4',
    placeholderImg: '',
    videoTitle: 'How to use online proofing'
  },
  {
    src: '/clientassets-zno-saas/designer/designer-tutorial-videos/custom-spec.mp4',
    placeholderImg: '',
    videoTitle: 'How to create a custom spec'
  },
  {
    src: '/clientassets-zno-saas/designer/designer-tutorial-videos/design-service.mp4',
    placeholderImg: '',
    videoTitle: 'How to use Design Service'
  },
  {
    src: '/clientassets-zno-saas/designer/designer-tutorial-videos/background.mp4',
    placeholderImg: '',
    videoTitle: 'How to change background or sticker color'
  }
];
