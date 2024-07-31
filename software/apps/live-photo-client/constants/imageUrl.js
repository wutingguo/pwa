//图片链接地址
export const IMAGE_URL =
  '<%=baseUrl%>cloudapi/album_live/image/view?enc_image_uid=<%=enc_image_uid%>&thumbnail_size=<%=thumbnail_size%>';

//获取旋转图片链接地址
export const CROP_IMAGE_URL =
  '<%=baseUrl%>imgservice/op/crop?encImgId=<%=encImgId%>&px=0&py=0&pw=1&ph=1&width=<%=width%>&height=<%=height%>&rotation=<%=rotation%>&contrast=0&exifOrientation=<%=exifOrientation%>';

//图片下载链接地址
export const DOWN_URL =
  '<%=baseUrl%>cloudapi/album_live/image/download?enc_image_uid=<%=enc_image_uid%>&thumbnail_size=<%=size%>';

//视频下载链接地址
export const VIDEO_DOWN_URL =
  '<%=baseUrl%>cloudapi/album_live/video/download?enc_media_id=<%=enc_media_id%>';

// 获取相册的分类别表
export const ALBUM_LIVE_GET_ALBUM_CATEGORY = `<%=baseUrl%>cloudapi/album_live/album_category/list?enc_album_id=<%=enc_album_id%>&is_show_hide=<%=is_show_hide%>`;

// 获取C端访问设置
export const ALBUM_LIVE_GET_ACCESS =
  '<%=baseUrl%>cloudapi/album_live/activity/get_c_access?enc_broadcast_id=<%=enc_broadcast_id%>';
// 校验访问密码
export const ALBUM_LIVE_CHECK_ACCESS = '<%=baseUrl%>cloudapi/album_live/activity/validate_password';
