/* billing-review 页面接口 */
export const GET_BILLING_DETIAL = '<%=baseUrl%>cloudapi/checkout/billing';
export const GET_CREDIT_CARD_LIST =
  '<%=baseUrl%>cloudapi/credit_card/list?autoRandomNum=<%=autoRandomNum%>';

// 账号管理
export const GET_ACCOUNT_INFO = '<%=baseUrl%>frontPages/getCustomerInfo.ep';
export const EDIT_ACCOUNT_INFO = '<%=baseUrl%>frontPages/updatePropertyH5.ep';
export const GET_ACTIVITY_INFO = '<%=baseUrl%>cloudapi/recommend/get_activity_info';
export const LIST_REC_RECORD_BY_ACTIVITY =
  '<%=baseUrl%>cloudapi/recommend/list_rec_record_by_activity?activity_id=<%=activity_id%>';
export const CHECK_EXCHANGE_AWARD =
  '<%=baseUrl%>cloudapi/recommend/check_exchange_award?activity_id=<%=activity_id%>';

// export const GET_CATEGORY_DETAIL =
//   '/productIndex/listProduct.ep?projectType=<%=category%>&source=pc&autoRandomNum=<%=autoRandomNum%>';

// /* 根据sku获取cover, 用于面包屑渲染*/
// export const GET_SPU_COVERS = '/web-api/coverDesign/getSpuCovers?spuCode=<%=spuCode%>';

// export const GET_PRODUCT_CATEGORY = '/productIndex/productCategory.ep?projectType=PG&source=pc';
export const ADD_CHILD_ACCOUNT = '<%=baseUrl%>sec/login/customer/addChildCustomer.ep';
export const EDIT_CHILD_ACCOUNT = '<%=baseUrl%>sec/login/customer/updateChildCustomer.ep';
export const GET_CHILD_ACOUNNTS = '<%=baseUrl%>web-api/myaccount/getChildCustomerList.ep';
