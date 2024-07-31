//图片链接地址
export const IMAGE_URL =
  '<%=baseUrl%>cloudapi/album_live/image/view?enc_image_uid=<%=enc_image_uid%>&thumbnail_size=<%=thumbnail_size%>';

//自带旋转图片链接地址
export const ROTATE_IMAGE_URL =
  '<%=baseUrl%>cloudapi/album_live/image/download?enc_image_uid=<%=enc_image_uid%>&thumbnail_size=<%=thumbnail_size%>';

//获取旋转图片链接地址
export const CROP_IMAGE_URL =
  '<%=baseUrl%>imgservice/op/crop?encImgId=<%=encImgId%>&px=0&py=0&pw=1&ph=1&width=<%=width%>&height=<%=height%>&rotation=<%=rotation%>&contrast=0&exifOrientation=<%=exifOrientation%>';

//图片下载链接地址
export const DOWN_URL =
  '<%=baseUrl%>cloudapi/album_live/image/download?enc_image_uid=<%=enc_image_uid%>&thumbnail_size=<%=size%>';
