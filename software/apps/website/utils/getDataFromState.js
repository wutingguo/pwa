import { get } from 'lodash';

export default state => {
  const { root, gallery } = state;
  const { system } = root;
  const urls = get(system, 'env.urls');

  return {
    qs: get(system, 'env.qs'),
    urls,
    baseUrl: urls.get('baseUrl'),
    galleryBaseUrl: urls.get('galleryBaseUrl'),
    estoreBaseUrl: urls.get('estoreBaseUrl'),
    userInfo: get(system, 'userInfo'),
    gallery
  };
};
