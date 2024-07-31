export const LIVE_PHOTO_VERIFY_KEY =
  '<%=baseUrl%>cloudapi/album_live/activity/verify_key?key=<%=key%>';

export const PAY_WECHAT_AREACODELIST = '<%=baseUrl%>cloudapi/alis/merchant/list_wechat_areas';

export const PAY_WECHAT_UPLOADIMG = '<%=baseUrl%>cloudapi/alis/merchant/upload_merchant_image';

//获取支付配置列表
export const PAY_SETTINGS_LIST =
  '<%=baseUrl%>cloudapi/alis/payment/list_payment_settings?customer_id=<%=customer_id%>';
//更新支付配置
export const PAY_SETTINGS_UPDATE = '<%=baseUrl%>cloudapi/alis/payment/update_payment_setting';

// 提交申请单
export const PAY_WECHAT_SUBMIT = '<%=baseUrl%>cloudapi/alis/merchant/submit_merchant_info';
// 查询特约商户申请单信息
export const PAY_WECHAT_APPLY_FORM = '<%=baseUrl%>cloudapi/alis/merchant/get_wechat_apply_form';
// 查询申请状态
export const PAY_WECHAT_APPLY = '<%=baseUrl%>cloudapi/alis/merchant/query_merchant_apply_result';

// 查询支付订单列表

export const PAY_WECHAT_ORDER_LIST =
  '<%=baseUrl%>cloudapi/gallery/favorite_order/list_favorite_orders?favorite_id=<%=favorite_id%>';

export const APPLY_COUPON_IN_CLIENT =
  '<%=baseUrl%>cloudapi/estore/store/coupon/apply?coupon_code=<%=coupon_code%>';
