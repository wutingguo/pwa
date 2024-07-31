export const GALLERY_SET_IMGAGES =
  '<%=baseUrl%>cloudapi/gallery/collection/set/image/list_set_images?set_uid=<%=set_uid%>';

export const GET_FACE_IMGS =
  '<%=galleryBaseUrl%>cloudapi/gallery/image_group/list_c_collection_group_details?enc_collection_id=<%=enc_collection_id%>';

export const GALLERY_GET_FAVORITE_IMGAGES =
  '<%=baseUrl%>cloudapi/gallery/collection/list_collection_set_favorite_images?collection_uid=<%=collection_uid%>&guest_uid=<%=guest_uid%>';

export const GALLERY_GET_MINITOKEN = '<%=baseUrl%>web-api/saas/api/get_token?app_id=<%=app_id%>';

export const GALLERY_GET_MINICODE =
  '<%=baseUrl%>QRcode/getQRcode.ep?appId=<%=appId%>&path=<%=path%>&scene=<%=scene%>&width=<%=width%>&version=<%=version%>';
