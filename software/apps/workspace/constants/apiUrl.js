export const GET_MATERIAL_LIST = '/web-api/getMaterialDebossingList.ep';
export const GET_COMMON_MATERIAL_LIST = '/web-api/getCommonMaterialDebossingList.ep';
export const IMAGE_SRC =
  '<%=uploadBaseUrl%>/upload/UploadServer/ImgRender?qaulityLevel=0&puid=<%=encImgId%>&rendersize=fit250';
export const DELETE_MATERIAL = '/web-api/deleteMaterialDebossing.ep';

export const UPLOAD_IMG =
  '<%=uploadBaseUrl%>/upload/UploadServer/uploadImg?isCheckDpi=<%=isCheckDpi%>&isNeedResize=<%=isNeedResize%>&size=<%=size%>';

export const ADD_STICKER = '/web-api/material/addMaterial.ep';
export const GET_GROUP_LIST = '/web-api/material/getMaterialGroupList.ep';
export const GET_STICKER_LIST = '/web-api/material/getMaterialList.ep';
export const UPDATE_STICKER = '/web-api/material/updaterMaterial.ep';
export const DELETE_STICKER = '/web-api/material/deleteMaterialBatch.ep';
export const ADD_STICKER_GROUP = '/web-api/material/addMaterialGroup.ep';
export const CHANGE_STICKER_GROUP = '/web-api/material/moveMaterialGroupBatch.ep';
export const DELETE_STICKER_GROUP = '/web-api/material/deleteMaterialGroup.ep';
export const UPDATE_ELEMENT_GROUP = '/web-api/material/updateMaterialGroup.ep';

export const GET_ALBUM_ID =
  '<%=baseUrl%>/userid/<%=userid%>/addOrUpdateAlbum?albumName=<%=albumName%>&webClientId=1&autoRandomNum=<%=random%>';

export const STAMPING_PREFIX = 'clientassets/portal/v2/images/pc/stamping/';
export const ADD_MATERIAL = '/web-api/addMaterialDebossing.ep';

export const ADD_TO_CART2 =
  '<%=baseUrl%>/saas-web/commonProduct/addShoppingCart.html?productSkuCode=<%=productSkuCode%>&materialId=<%=materialId%>&foil_copper_option=<%=foil_copper_option%>';

export const GET_PRICE =
  '<%=baseUrl%>/clientH5/product/book/price?product=<%=product%>&options=<%=options%>';

export const DEFAULT_COVER_IMAGE_URL = '<%=baseUrl%>template-resources/images/noimage_pc_cn.png';
//美国区My Projects页面中project的默认缩略图
export const DEFAULT_COVER_IMAGE_URL_US =
  '/clientassets/portal/template-resources/images/noimage_pc.png';
//日本My Projects页面中project的默认缩略图
export const DEFAULT_COVER_IMAGE_URL_JA =
  '/clientassets/portal/template-resources/images/noimage_pcja.png';
//德国My Projects页面中project的默认缩略图
export const DEFAULT_COVER_IMAGE_URL_DE =
  '/clientassets/portal/template-resources/images/noimage_pcde.png';

// 获取项目列表的接口
export const GET_PROJECT_LIST = '<%=baseUrl%>web-api/myproject/V2/list';
export const GET_PROJECT_FILTERS = '<%=baseUrl%>web-api/myproject/V2/conditions';
// 删除项目的接口
export const DELETE_PROJECT = '<%=baseUrl%>frontPages/deleteMyProjectJson.ep';
// 获取分享链接的 接口
export const GET_SHARE_URLS =
  '<%=baseUrl%>clientH5/getShareUrls?initGuid=<%=projectid%>&product=<%=projectType%>';
// 获取分享链接的 接口
export const GET_US_PACKAGE_SHARE_URLS = '<%=baseUrl%>web-api/new-package/getShareUrls';
export const SAVE_PROJECT_TITLE =
  '<%=baseUrl%>web-api/customerId/<%=userId%>/updateProjectAndAlbumTitle?projectId=<%=projectId%>&projectName=<%=projectName%>';
// 我的作品列表中克隆项目的接口
export const CLONE_PROJECT_BY_ID = '<%=baseUrl%>web-api/package/copy';
export const GET_VIRTUAL_PROJECT_PROJECT = '<%=baseUrl%>web-api/new-package/project';

// Create New Project 相关接口
export const GET_CATEGORY_PRODUCT =
  '<%=baseUrl%>cloudapi/product/get_category_product?autoRandomNum=<%=autoRandomNum%>&lab_type=<%=lab_type%>';

export const OPEN_DESIGNER_APP =
  '/prod-assets/app/cxeditor/index.html?from=saas&packageType=<%=packageType%>&languageCode=<%=languageCode%>&title=<%=title%>&skuCode=<%=skuCode%>';
export const OPEN_DESIGNER_APP_US =
  '/prod-assets/app/cxeditor/index.html?from=saas&packageType=<%=packageType%>&languageCode=<%=languageCode%>&title=<%=title%>&skuCode=<%=skuCode%>';

// 获取 Labs 下拉接口
export const GET_LABS = '<%=baseUrl%>cloudapi/designer/labs/get_labs_option';

export const CREATE_NEW_PROJECT_IMAGE_URL =
  '<%=baseUrl%>clientassets/portal/v2/images/pc/products-saas/<%=imagePath%>.jpg';

export const CREATE_NEW_PROJECT_CATEGORY_IMAGE_URL =
  '<%=baseUrl%>clientassets/portal/v2/images/pc/products-saas<%=imagePath%>';
export const CREATE_NEW_PROJECT_PRODUCT_IMAGE_URL =
  '<%=baseUrl%>clientassets/portal/v2/images/pc/products-saas<%=imagePath%>';

export const GET_VIRTUAL_TYPE =
  '<%=baseUrl%>cloudapi/product/sku/get_virtual_type?sku_code=<%=sku_code%>';

export const GET_CHILD_ACOUNNTS = '<%=baseUrl%>web-api/myaccount/getChildCustomerList.ep';
export const GET_ORDER_LIST_CN =
  '<%=baseUrl%>web-api/order/myOrders.ep?page=<%=page%>&subCustomerList=<%=subCustomerList%>&limit=10';
export const GET_ORDER_LIST =
  '<%=baseUrl%>web-api/order/myOrders.ep?page=<%=page%>&subCustomerList=<%=subCustomerList%>&limit=20';

export const NO_IMAGE_SRC = '/template-resources/images/noimage_pc_cn.png';
export const DELETE_ORDER = '<%=baseUrl%>web-api/order/deleteOrder.ep';
export const CANCEL_ORDER = '<%=baseUrl%>web-api/order/cancelOrder.ep?orderUid=<%=orderUid%>';

export const GET_COUNTRY_DISTRICTS = '/cloudapi/constants/geo/districts';
export const GET_NORMAL_ADDRESS = '/cloudapi/address/get?address_id=<%=addressId%>';
export const GET_ORDER_ADDRESS =
  '/cloudapi/order_address/get_shipping_address?order_number=<%=order_number%>';
export const SAVE_ORDER_ADDRESS = '/cloudapi/order_address/save_shipping_address';

// 根据locale获取可送达国家及其下省份的接口
export const GET_COUNTRY_AND_PROVINCE = '/web-api/app/area/getCountryAndProvince';
// 根据父层级获取子地址
export const GET_SUBAERA_LIST = '/web-api/app/area/getSubAreaListByUidpkAndLevel';

export const GET_BASE_ORDER_DETAIL =
  '<%=baseUrl%>web-api/order/baseOrderDetail.ep?orderNumber=<%=orderNumber%>';
export const GET_ORDER_PROCESS_DETAIL =
  '<%=baseUrl%>web-api/order/orderProcessDetail.ep?orderNumber=<%=orderNumber%>';
export const GET_ORDER_ITEM_DETAIL =
  '<%=baseUrl%>web-api/order/orderItemDetail.ep?orderNumber=<%=orderNumber%>';
export const GET_ORDER_PROCESS_DETAIL_EN =
  '<%=baseUrl%>web-api/order/orderProcessDetail.ep?orderNumber=<%=orderNumber%>&serviceTypeNum=<%=serviceTypeNum%>';
export const GET_ORDER_ITEM_DETAIL_EN =
  '<%=baseUrl%>web-api/order/orderItemDetail.ep?orderNumber=<%=orderNumber%>&serviceTypeNum=<%=serviceTypeNum%>';
export const GET_BASE_ORDER_DETAIL_EN =
  '<%=baseUrl%>web-api/order/baseOrderDetail.ep?orderNumber=<%=orderNumber%>&serviceTypeNum=<%=serviceTypeNum%>';
export const ORDER_PROCESS_STTAUS_IMG_PREFIX =
  '/clientassets/portal/v2/images/order-process-status/pc/';

export const GET_CN_PRODUCT_CATEGORY_V3 =
  '<%=baseUrl%>productIndex/productCategoryV3.ep?projectType=PG&source=pc';

export const GET_CATEGORY_DETAIL =
  '<%=baseUrl%>productIndex/listProduct.ep?projectType=<%=category%>&source=pc&autoRandomNum=<%=autoRandomNum%>';

export const GET_PRODUCT_CATEGORY =
  '<%=baseUrl%>productIndex/productCategory.ep?projectType=PG&source=pc';

// 厂商接口
export const NEW_CUSTOME_FACTORY_LIST =
  '<%=baseUrl%>cloudapi/designer/thirdPartLab/listThirdPartLabs';
// 厂商分类接口
export const NEW_CUSTOME_CATEGORY_LIST =
  '<%=baseUrl%>cloudapi/designer/thirdPartyCategory/listThirdPartyCategory?labId=<%=labId%>';
// 厂商分类接口
export const NEW_CUSTOME_PRODUCT_LIST =
  '<%=baseUrl%>cloudapi/designer/labs/listThirdPartProducts?labId=<%=labId%>&categoryId=<%=categoryId%>&customerId=<%=customerId%>';
// 分类接口
export const NEW_CUSTOME_PRODUCT_MAP =
  '<%=baseUrl%>cloudapi/designer/labs/listCustomizeProducts?labId=<%=labId%>&customerId=<%=customerId%>';

// 获取活动信息
export const GET_ACTIVITY_DETAILS = `<%=baseUrl%>cloudapi/album_live/activity/get_activity_details?enc_broadcast_id=<%=enc_broadcast_id%>`;
// 获取图片列表
export const GET_CONTENT_LIST_BY_BROADCAST = `<%=baseUrl%>cloudapi/album_live/broadcast/get_content_list_by_broadcast`;
// 获取相册下小时分段信息
export const GET_TIME_SEGMENT_GROUP = `<%=baseUrl%>cloudapi/album_live/broadcast/get_time_segment_group?enc_broadcast_id=<%=enc_broadcast_id%>`;
// 根据时间段获取图片列表
export const GET_CONTENT_LIST_BY_TIME_SEGMENT = `<%=baseUrl%>cloudapi/album_live/broadcast/get_content_list_by_time_segment`;
//获取热门的图片列表
export const GET_HOT_CONTENT = `<%=baseUrl%>cloudapi/album_live/broadcast/get_hot_content`;
//是否有更新
export const HAS_UPDATED = `<%=baseUrl%>cloudapi/album_live/broadcast/has_updated`;
//点赞或查看记录接口
export const LOG_TARGET_OPERATION = `<%=baseUrl%>cloudapi/album_live/broadcast/log_target_operation`;
//获取操作的统计
export const GET_TARGET_OPERATION_COUNT = `<%=baseUrl%>cloudapi/album_live/broadcast/get_target_operation_count`;
//获取微信基础数据
export const GET_JS_SDK_PARAM = `<%=baseUrl%>cloudapi/album_live/broadcast/share/wechat/js_sdk_param?url=<%=url%>`;
//获取企业微信基础数据
export const GET_QWECHAR_JS_SDK_PARAM = `<%=baseUrl%>cloudapi/album_live/broadcast/share/qywechat/js_sdk_param?url=<%=url%>`;
