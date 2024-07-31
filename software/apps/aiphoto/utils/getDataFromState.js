import { get } from 'lodash';

export default state => {
  const { root, aiphoto } = state;
  const { system } = root;
  const urls = get(system, 'env.urls');

  return {
    qs: get(system, 'env.qs'),
    urls,
    baseUrl: urls.get('baseUrl'),
    galleryBaseUrl: urls.get('galleryBaseUrl'),
    userInfo: get(system, 'userInfo'),
    aiphoto
  };
};
