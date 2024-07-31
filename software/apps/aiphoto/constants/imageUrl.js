console.log('__isCN__: ', __isCN__);

export const COLLECTION_COVER_URL = '/cloudapi/gallery/collection/set/view?image_uid=<%=coverUid%>';
export const SET_IMAGE_URL = '/cloudapi/gallery/collection/set/view?image_uid=<%=imageUid%>';
export const DEFAULT_COVER_URL_LARGE = `<%=saasBaseUrl%>${
  __isCN__ ? 'clientassets-cunxin-saas' : 'clientassets-zno-saas'
}/gallery/default-cover/default-cover-large.png`;
export const DEFAULT_COVER_URL_SMALL = `<%=saasBaseUrl%>${
  __isCN__ ? 'clientassets-cunxin-saas' : 'clientassets-zno-saas'
}/gallery/default-cover/default-cover-small.png`;
export const DEFAULT_COVER_URL_XS = `<%=saasBaseUrl%>${
  __isCN__ ? 'clientassets-cunxin-saas' : 'clientassets-zno-saas'
}/gallery/default-cover/default-cover-xs.png`;
export const COLLECTION_COVER_TEMPLATE_URL = `<%=saasBaseUrl%>${
  __isCN__ ? 'clientassets-cunxin-saas' : 'clientassets-zno-saas'
}/gallery/cover-templates/<%=templateId%>.jpg`;
export const COLLECTION_GALLERY_STYLE_URL_PC = `<%=saasBaseUrl%>${
  __isCN__ ? 'clientassets-cunxin-saas' : 'clientassets-zno-saas'
}/gallery/gallery-style/pc-<%=galleryPhotoName%>.jpg`;
export const COLLECTION_GALLERY_STYLE_URL_M = `<%=saasBaseUrl%>${
  __isCN__ ? 'clientassets-cunxin-saas' : 'clientassets-zno-saas'
}/gallery/gallery-style/m-<%=galleryPhotoName%>.jpg`;
