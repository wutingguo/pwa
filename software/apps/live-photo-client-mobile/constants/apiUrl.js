export const GET_LOADING_INFO =
  '<%=baseUrl%>cloudapi/album_live/activity/get_loading?enc_broadcast_id=<%=enc_broadcast_id%>';

// 获取C端访问设置
export const ALBUM_LIVE_GET_ACCESS =
  '<%=baseUrl%>cloudapi/album_live/activity/get_c_access?enc_broadcast_id=<%=enc_broadcast_id%>';
// 校验访问密码
export const ALBUM_LIVE_CHECK_ACCESS = '<%=baseUrl%>cloudapi/album_live/activity/validate_password';

// 根据当前album获取所属用户的token信息接口
export const GET_TOKEN_INFO =
  '<%=baseUrl%>cloudapi/album_live/activity/token/get_by_broadcast?enc_broadcast_id=<%=enc_broadcast_id%>';
// 获取图片人脸信息
export const GET_FACE_INFO =
  '<%=baseUrl%>cloudapi/album_live/ai_face/detect/for_compare?enc_image_id=<%=enc_image_id%>';

// 根据人脸信息查询相似图片
export const GET_FACE_SIMILAR_IMAGE =
  '<%=baseUrl%>cloudapi/album_live/ai_face/search_by_face_token?enc_broadcast_id=<%=enc_broadcast_id%>&face_token=<%=face_token%>';

// 获取文件上传的token
export const ALBUM_LIVE_GET_UPLOAD_URL = `<%=baseUrl%>cloudapi/album_live/get_sign`;

// 上传图片同步到后台
export const ALBUM_LIVE_GET_UPLOAD_COMPLETE = `<%=baseUrl%>cloudapi/album_live/upload_complete`;

// 查询直播中指定图片的人脸信息-大图展示
export const ALBUM_LIVE_GET_AI_FACE_INFO = `<%=baseUrl%>cloudapi/album_live/ai_face/get_face_by_image_ids?enc_broadcast_id=<%=enc_broadcast_id%>&enc_image_id=<%=enc_image_id%>`;

// C端提交表单信息
export const ALBUM_LIVE_SUBMIT_FORM_INFO = `<%=baseUrl%>cloudapi/album_live/broadcast/form/submit_form_info`;

// C端提交人脸上传表单信息
export const ALBUM_LIVE_SUBMIT_FACE_INFO = `<%=baseUrl%>cloudapi/album_live/ai_privacy/add_group`;

// C端开启隐私模式，检测人脸接口信息
export const ALBUM_LIVE_GET_FACE_DETECT = `<%=baseUrl%>cloudapi/album_live/ai_privacy/get_face_by_image_ids?enc_broadcast_id=<%=enc_broadcast_id%>&enc_image_id=<%=enc_image_id%>`;

// C端开启隐私模式，提交选中的人脸接口
export const ALBUM_LIVE_SUBMIT_FACE_DETECT = `<%=baseUrl%>cloudapi/album_live/ai_privacy/submit_face`;

// C端开启隐私模式，根据人头查询图片接口
export const ALBUM_LIVE_GET_FACE_IMAGE = `<%=baseUrl%>cloudapi/album_live/ai_privacy/search_by_face_token?enc_broadcast_id=<%=enc_broadcast_id%>&face_token=<%=face_token%>`;
