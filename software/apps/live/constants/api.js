// 图片显示路径
export const ALBUM_LIVE_IMAGE_URL = `<%=baseUrl%>cloudapi/album_live/image/view?enc_image_uid=<%=enc_image_id%>&thumbnail_size=<%=size%>`;

// 直播图片显示路径
export const LIVE_ALBUM_LIVE_IMAGE_URL = `<%=baseUrl%>cloudapi/album_live/image/view?enc_content_id=<%=enc_content_id%>`;

// save_album
export const ALBUM_LIVE_SAVE_ALBUM = `<%=baseUrl%>cloudapi/album_live/album/save_album`;

// query_album
export const ALBUM_LIVE_QUERY_ALBUM = `<%=baseUrl%>cloudapi/album_live/album/get_album_broadcast_by_id?album_id=<%=album_id%>`;
export const ALBUM_LIVE_SAVE_AIRETOUCH_IMPORT =
  '<%=baseUrl%>cloudapi/imageprocess/effects/topic/custom/add';
export const ALBUM_LIVE_REMOVE_AIRETOUCH_IMPORT =
  '<%=baseUrl%>cloudapi/imageprocess/effects/topic/custom/remove';
// 获取相册菜单接口
export const ALBUM_LIVE_QUERY_MENU_INFO = `<%=baseUrl%>cloudapi/album_live/activity/get_menu?broadcast_id=<%=broadcast_id%>`;
// 保存相册菜单接口
export const ALBUM_LIVE_UPDATE_MENU_INFO = `<%=baseUrl%>cloudapi/album_live/activity/save_menu`;

// 保存活动介绍接口
export const ALBUM_LIVE_UPDATE_ACTIVITY_INFO = `<%=baseUrl%>cloudapi/album_live/activity/save_activity_desc`;
// 获取活动介绍接口
export const ALBUM_LIVE_QUERY_ACTIVITY_INFO = `<%=baseUrl%>cloudapi/album_live/activity/get_activity_desc?broadcast_id=<%=broadcast_id%>`;
// 获取国家城市信息
export const ALBUM_LIVE_QUERY_COUNTRY_INFO = `<%=baseUrl%>cloudapi/constants/geo/districts`;
// 获取文件上传的token
export const ALBUM_LIVE_GET_UPLOAD_URL = `<%=baseUrl%>cloudapi/album_live/get_sign`;
export const ALBUM_LIVE_GET_UPLOAD_COMPLETE = `<%=baseUrl%>cloudapi/album_live/upload_complete`;

// 相册列表
export const ALBUM_LIVE_GET_ALBUM_LIST = `<%=baseUrl%>cloudapi/album_live/album/get_paginated_album_list`;
export const ALBUM_LIVE_RETRIEVE_ALBUM =
  '<%=baseUrl%>cloudapi/album_live/album/retrieve_album?enc_album_ids=<%=enc_album_ids%>';
export const ALBUM_LIVE_SAVE_START_PAGE =
  '<%=baseUrl%>cloudapi/album_live/activity/save_start_page';
export const ALBUM_LIVE_GET_START_PAGE =
  '<%=baseUrl%>cloudapi/album_live/activity/get_start_page?broadcast_id=<%=broadcast_id%>';

// 获取banner信息接口
export const ALBUM_LIVE_GET_ALBUM_BANNER = `<%=baseUrl%>cloudapi/album_live/activity/get_banner?broadcast_id=<%=broadcast_id%>`;
// 保存banner链接
export const ALBUM_LIVE_SAVE_BANNER_URL = `<%=baseUrl%>cloudapi/album_live/activity/save_banner_external_url`;

// 保存banner信息接口
export const ALBUM_LIVE_UPDATE_ALBUM_BANNER = `<%=baseUrl%>cloudapi/album_live/activity/save_banner`;

// 获取分享信息接口
export const ALBUM_LIVE_GET_ALBUM_SHARE = `<%=baseUrl%>cloudapi/album_live/activity/get_share?broadcast_id=<%=broadcast_id%>`;

// 保存分享信息接口
export const ALBUM_LIVE_UPDATE_ALBUM_SHARE = `<%=baseUrl%>cloudapi/album_live/activity/save_share`;
// 获取广告信息接口
export const ALBUM_LIVE_GET_ALBUM_ADVER = `<%=baseUrl%>cloudapi/album_live/ending_advertise?enc_album_id=<%=enc_album_id%>`;

// 修改广告信息接口
export const ALBUM_LIVE_UPDATE_ALBUM_ADVER = `<%=baseUrl%>cloudapi/album_live/ending_advertise`;

// 发起新的打包下载
export const ALBUM_LIVE_PROPOSE_DOWNLOAD_PACKAGE = `<%=baseUrl%>cloudapi/album_live/album_package/propose_download_package`;
// 生成下载链接-CN
export const ALBUM_LIVE_PACKAGE = `<%=baseUrl%>cloudapi/album_live/album_package/download_album_package`;
// 查询相册是否存在正在打包下载的任务-CN
export const ALBUM_LIVE_HAS_DOWNLOAD_PACKAGE_JOB = `<%=baseUrl%>cloudapi/album_live/album_package/has_download_package_job?enc_album_id=<%=enc_album_id%>`;
// 获取打包下载列表
export const ALBUM_LIVE_QUERY_PACKAGE_LIST = `<%=baseUrl%>cloudapi/album_live/album_package/get_album_package_list?enc_album_id=<%=id%>`;
// 获取打包下载链接
export const ALBUM_LIVE_QUERY_DOWNLOAD_LINK = `<%=baseUrl%>cloudapi/album_live/album_package/get_download_link?request_uuid=<%=id%>`;
// 删除打包下载链接
export const ALBUM_LIVE_Delete_DOWNLOAD_LINK = `<%=baseUrl%>cloudapi/album_live/album_package/delete_download_link?request_uuid=<%=id%>`;

// 获取回收站相册列表
export const ALBUM_LIVE_QUERY_ALBUM_LIST = `<%=baseUrl%>cloudapi/album_live/album/get_album_list`;

// 删除相册（回收站中）
export const ALBUM_LIVE_DELETE_ALBUM = `<%=baseUrl%>cloudapi/album_live/album/del_album?enc_album_ids=<%=id%>`;

// 还原相册（回收站中）
export const ALBUM_LIVE_ROLLBACK_ALBUM = `<%=baseUrl%>cloudapi/album_live/album/rollback_album?enc_album_ids=<%=id%>`;

// AI 修图师 接口
export const ALBUM_LIVE_AIRETOUCH_SWITCH =
  '<%=baseUrl%>cloudapi/album_live/album/update_correct_enable';
export const ALBUM_LIVE_GET_AIRETOUCH_PRESET =
  '<%=baseUrl%>cloudapi/album_live/album/get_correct_preset?enc_album_id=<%=enc_album_id%>';
export const ALBUM_LIVE_GET_AIRETOUCH_PRESET_PROVIDER =
  '<%=baseUrl%>cloudapi/album_live/album/get_correct_preset?enc_album_id=<%=enc_album_id%>&provider=<%=provider%>';
export const ALBUM_LIVE_SAVE_AIRETOUCH_PRESET =
  '<%=baseUrl%>cloudapi/album_live/album/save_correct_preset';

// 获取优惠劵
export const ALBUM_LIVE_GET_COUPON =
  '<%=baseUrl%>cloudapi/prestore/account/init_account?moduleCode=<%=moduleCode%>';

// 权限验证
export const ALBUM_LIVE_VERIFY_AUTH =
  '<%=baseUrl%>cloudapi/album_live/album/verify_permission?customer_id=<%=id%>&scene=<%=scene%>';
// 权限验证2
export const ALBUM_LIVE_VERIFY_AUTH_2 =
  '<%=baseUrl%>cloudapi/album_live/album/verify_permission?customer_id=<%=id%>&scene=<%=scene%>&enc_album_id=<%=enc_album_id%>';

// 保存直播间皮肤
export const ALBUM_LIVE_SAVE_SKIN = '<%=baseUrl%>cloudapi/album_live/album_skin/save_album_skin';

// 删除直播间皮肤
export const ALBUM_LIVE_DEL_SKIN =
  '<%=baseUrl%>cloudapi/album_live/album_skin/del_album_skin?album_skin_id=<%=id%>';

// 获取用户所有的直播间皮肤
export const ALBUM_LIVE_GET_SKIN_LIST =
  '<%=baseUrl%>cloudapi/album_live/album_skin/get_album_skin_list?album_skin_type=<%=type%>&skin_category_id=<%=skin_category_id%>';

// 获取用户自定义皮肤数量
export const ALBUM_LIVE_GET_CUSTOMER_SKIN_COUNT =
  '<%=baseUrl%>cloudapi/album_live/album_skin/get_customer_album_skin_count';

// 皮肤分类列表
export const ALBUM_LIVE_GET_SKIN_CATEGORY_LIST =
  '<%=baseUrl%>cloudapi/album_live/skin_category/list';

// 水印开关
export const ALBUM_LIVE_UPDATE_WATERMARK_ENABLE =
  '<%=baseUrl%>cloudapi/album_live/album/update_watermark_enable';

// 水印列表
export const ALBUM_LIVE_GET_WATERMARK_LIST =
  '<%=baseUrl%>cloudapi/album_live/watermark/list_watermark?enc_album_id=<%=id%>';

// 水印设置新增/修改
export const ALBUM_LIVE_SAVE_WATERMARK = '<%=baseUrl%>cloudapi/album_live/watermark/save_watermark';
// 水印图删除
export const ALBUM_LIVE_REMOVE_WATERMARK =
  '<%=baseUrl%>cloudapi/album_live/watermark/remove_watermark?watermark_id=<%=id%>';
// 创建重新打水印任务
export const ALBUM_LIVE_CREATE_REWATERMARK_TASK =
  '<%=baseUrl%>cloudapi/album_live/watermark/task/create_task';
// 查询重新打水印任务状态
export const ALBUM_LIVE_QUERY_REWATERMARK_TASK =
  '<%=baseUrl%>cloudapi/album_live/watermark/task/query_task_status?enc_album_id=<%=enc_album_id%>';
// 取消重新打水印任务
export const ALBUM_LIVE_CANCEL_REWATERMARK_TASK =
  '<%=baseUrl%>cloudapi/album_live/watermark/task/cancel_task?enc_album_id=<%=enc_album_id%>';

// 获取摄影师列表
export const ALBUM_LIVE_GET_CAMERAMAN_LIST =
  '<%=baseUrl%>cloudapi/album_live/album_pho_role/get_pho_role_list?album_id=<%=id%>';

// 获取摄影师列表
export const ALBUM_LIVE_GET_CAMERAMAN_INFO =
  '<%=baseUrl%>cloudapi/album_live/album_pho_role/get_customer_info?phone=<%=phone%>';

// 新增摄影师
export const ALBUM_LIVE_ADD_CAMERAMAN =
  '<%=baseUrl%>cloudapi/album_live/album_pho_role/add_pho_role';
// 删除摄影师
export const ALBUM_LIVE_DEL_CAMERAMAN =
  '<%=baseUrl%>cloudapi/album_live/album_pho_role/del_pho_role?album_id=<%=id%>&customer_id=<%=customer_id%>';

// 相册中添加图片（上传完成后，参数同上）
export const ALBUM_LIVE_ADD_ALBUM_CONTENT =
  '<%=baseUrl%>cloudapi/album_live/album_content/add_album_content';

// 相册中替换图片（上传完成后，参数同上）
export const ALBUM_LIVE_REPLACE_ALBUM_CONTENT =
  '<%=baseUrl%>cloudapi/album_live/album_content/replace_album_content';

// b端照片列表
export const ALBUM_LIVE_lIST_CONTENTS =
  '<%=baseUrl%>cloudapi/album_live/album_content/list_contents?current_page=<%=current_page%>&page_size=<%=page_size%>&customer_ids=<%=customer_ids%>&album_id=<%=album_id%>&is_client_show=<%=is_client_show%>&replace=<%=replace%>&start_time=<%=startTime%>&end_time=<%=endTime%>&image_name=<%=imageName%>&sort=<%=sort%>&category_id=<%=category_id%>&select_status=<%=select_status%>';

// 列表图片是否显示
export const UPDATE_CLIENT_SHOW =
  '<%=baseUrl%>cloudapi/album_live/album_content/update_client_show';

// 摄影师列表
export const ALBUM_LIVE_GET_PHO_ROLE_LIST =
  '<%=baseUrl%>cloudapi/album_live/album_pho_role/get_pho_role_content_count_list?album_id=<%=album_id%>';

export const ALBUM_LIVE_GET_RETOUCHING_POINTS =
  '<%=baseUrl%>cloudapi/album_live/album/correct_img_amount_left?customer_id=<%=customer_id%>';

// 查询用户修图剩余点数，剩余场数以及当前album修图计费方式
export const ALBUM_LIVE_CORRECT_STATICS =
  '<%=baseUrl%>cloudapi/album_live/album/correct/statics?customer_id=<%=customer_id%>&album_id=<%=album_id%>';

// 打开修图接口需要修改
export const ALBUM_LIVE_UPDATE_CORRECT_ENABLE =
  '<%=baseUrl%>cloudapi/album_live/album/update_correct_enable';

// 图片删除
export const ALBUM_LIVE_DELETE_IMAGE =
  '<%=baseUrl%>cloudapi/album_live/album_content/del_album_content';

// 图片置顶
export const ALBUM_LIVE_PINNED_IMAGE =
  '<%=baseUrl%>cloudapi/album_live/album_content/pin_album_content?enc_album_content_id=<%=enc_album_content_id%>&is_pinned=<%=is_pinned%>';

// 获取相册的分类别表
export const ALBUM_LIVE_GET_ALBUM_CATEGORY = `<%=baseUrl%>cloudapi/album_live/album_category/list?enc_album_id=<%=enc_album_id%>&is_show_hide=<%=is_show_hide%>`;

// 新增|编辑相册分类
export const ALBUM_LIVE_SAVE_ALBUM_CATEGORY = `<%=baseUrl%>cloudapi/album_live/album_category/save`;

// 删除分类
export const ALBUM_LIVE_DELETE_ALBUM_CATEGORY = `<%=baseUrl%>cloudapi/album_live/album_category/delete?category_id=<%=category_id%>`;

// 分类排序
export const ALBUM_LIVE_SORT_ALBUM_CATEGORY = `<%=baseUrl%>cloudapi/album_live/album_category/sort`;

// 分类显示隐藏切换
export const ALBUM_LIVE_SWITCH_ALBUM_CATEGORY = `<%=baseUrl%>cloudapi/album_live/album_category/switch_visible_status`;

// 批量移动照片到某个相册分类下
export const ALBUM_LIVE_CHANGE_CONTENT_GROUP =
  '<%=baseUrl%>cloudapi/album_live/album_category/change_content_group';

//保存相册曝光量配置
export const ALBUM_LIVE_SAVE_PV_CONFIG = `<%=baseUrl%>cloudapi/album_live/broadcast/market/save_config`;

//获取相册曝光量配置
export const ALBUM_LIVE_GET_PV_CONFIG = `<%=baseUrl%>cloudapi/album_live/broadcast/market/get_config?enc_album_id=<%=enc_album_id%>`;

// 获取B端访问设置信息
export const ALBUM_LIVE_GET_ACCESS = `<%=baseUrl%>cloudapi/album_live/activity/get_access?enc_broadcast_id=<%=enc_broadcast_id%>`;
// 保存访问设置
export const ALBUM_LIVE_SAVE_ACCESS = `<%=baseUrl%>cloudapi/album_live/activity/save_access`;

// 精修免费版
export const ALBUM_LIVE_GIFT_FREE =
  '<%=baseUrl%>cloudapi/prestore/account/gift_free?moduleCode=<%=moduleCode%>&policyCode=<%=policyCode%>';

// AI识别B端配置接口
export const ALBUM_LIVE_GET_AI_CONFIG = `<%=baseUrl%>cloudapi/album_live/activity/config_ai_face`;

// B端获取AI人脸识别配置
export const ALBUM_LIVE_GET_AI_FACE_CONFIG = `<%=baseUrl%>cloudapi/album_live/activity/get_ai_face_config?enc_broadcast_id=<%=enc_broadcast_id%>`;

// B端查询自定义广告列表
export const ALBUM_LIVE_GET_AD_LIST = `<%=baseUrl%>cloudapi/album_live/customized_ad?enc_album_id=<%=enc_album_id%>`;

// B端保存修改自定义广告设置
export const ALBUM_LIVE_SAVE_AD = `<%=baseUrl%>cloudapi/album_live/customized_ad`;
// 检验图片名称重复
export const ALBUM_LIVE_CHECK_IMG_REPEAT = `<%=baseUrl%>cloudapi/album_live/album_content/check_img_repeat`;

/* --------------------------------[CN-登记表单]------------------------------- */

// B端获取登记表单配置
export const ALBUM_LIVE_GET_REGISTER_CONFIG = `<%=baseUrl%>cloudapi/album_live/broadcast/form/get_config?enc_album_id=<%=enc_album_id%>`;

// B端保存登记表单配置
export const ALBUM_LIVE_SAVE_REGISTER_CONFIG = `<%=baseUrl%>cloudapi/album_live/broadcast/form/save_config`;

// B端获取登记表单查看客资名单信息列表(分页)
export const ALBUM_LIVE_GET_REGISTER_FORM_INFO = `<%=baseUrl%>cloudapi/album_live/broadcast/form/get_form_info?enc_album_id=<%=enc_album_id%>&page_num=<%=page_num%>&page_size=<%=page_size%>`;

// B端导出信息到Excel
export const ALBUM_LIVE_EXPORT_REGISTER_FORM_INFO = `<%=baseUrl%>cloudapi/album_live/broadcast/form/export_info?enc_album_id=<%=enc_album_id%>`;

// 登记表单收集项删除
export const ALBUM_LIVE_DEL_FORM_FIELD = `<%=baseUrl%>cloudapi/album_live/broadcast/form/del_form_field`;

/* --------------------------------[CN-登记表单]------------------------------- */

// 文件直传接口
export const ALBUM_LIVE_UPLOAD_FILE = `<%=baseUrl%>cloudapi/album_live/upload_file`;

// 文件错误提示文案
export const ALBUM_LIVE_UPLOAD_FILE_ERROR_TIP = `<%=baseUrl%>cloudapi/storage/resource/upload_error`;
/* --------------------------------[CN-挑图师]------------------------------- */

// B端查询AI挑图设置信息
export const ALBUM_LIVE_GET_PICKER_CONFIG = `<%=baseUrl%>cloudapi/album_live/ai_select_setting/get?enc_album_id=<%=enc_album_id%>`;

// B端保存AI挑图设置信息
export const ALBUM_LIVE_SAVE_PICKER_CONFIG = `<%=baseUrl%>cloudapi/album_live/ai_select_setting/save`;

// 验证是否可以打开开关
export const ALBUM_LIVE_VALIDATE_SWITCH = `<%=baseUrl%>cloudapi/album_live/ai_select_setting/check_re_open?id=<%=id%>`;

/* --------------------------------[CN-挑图师]------------------------------- */

// 批量设置图片挑图通过/未通过
export const ALBUM_LIVE_BATCH_SET_PASS = `<%=baseUrl%>cloudapi/album_live/album_ai_select/selection-status/batch`;

// B端获取人脸列表以及图片接口
export const ALBUM_LIVE_GET_FACE_LIST = `<%=baseUrl%>cloudapi/album_live/ai_privacy/get_image_detail_list?enc_album_id=<%=enc_album_id%>`;
// 添加人脸分组接口
export const ALBUM_LIVE_ADD_FACE_GROUP = `<%=baseUrl%>cloudapi/album_live/ai_privacy/add_group`;

// 修改图片的分组信息接口
export const ALBUM_LIVE_UPDATE_FACE_GROUP = `<%=baseUrl%>cloudapi/album_live/ai_privacy/modify_image_group`;
// B端修改新增full name,email,phone number
export const ALBUM_LIVE_UPDATE_CUSTOMER_INFO = `<%=baseUrl%>cloudapi/album_live/ai_privacy/save_face_info`;
