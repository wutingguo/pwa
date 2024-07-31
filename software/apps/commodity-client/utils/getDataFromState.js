import { get } from 'lodash';

export default state => {
  const { root, store, commodity } = state;
  const { system } = root;
  const urls = get(system, 'env.urls');

  return {
    userInfo: store.get('userInfo'),
    qs: get(system, 'env.qs'),
    urls,
    commodity
  };
};
