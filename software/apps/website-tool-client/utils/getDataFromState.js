import { get } from 'lodash';

export default state => {
  const { root, guest, favorite, collection } = state;
  const { system } = root;
  const urls = get(system, 'env.urls');

  return {
    qs: get(system, 'env.qs'),
    userInfo: get(system, 'userInfo'),
    guest,
    urls,
    galleryBaseUrl: urls.get('galleryBaseUrl'),
    favorite: get(favorite, 'detail'),
    detail: collection.detail
  };
};
