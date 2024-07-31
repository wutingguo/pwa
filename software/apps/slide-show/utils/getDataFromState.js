import { get } from 'lodash';
import * as stateHelper from '@apps/slide-show/utils/mapStateHelper';

export default state => {
  const { root, slideshow } = state;
  const { system } = root;
  const urls = stateHelper.getUrlsHelper(get(system, 'env.urls'));
  const studioInfo = get(system, 'studioInfo');
  const studioList = studioInfo.get('studioList') || [];
  const studio = studioList.length > 0 ? studioList[0] : {};

  return {
    qs: get(system, 'env.qs'),
    urls,
    baseUrl: urls.get('baseUrl'),
    galleryBaseUrl: urls.get('galleryBaseUrl'),
    uploadBaseUrl: urls.get('uploadBaseUrl'),
    userInfo: get(system, 'userInfo'),
    studio,
    slideshow
  };
};
