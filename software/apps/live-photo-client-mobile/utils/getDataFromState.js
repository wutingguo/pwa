import { get } from 'lodash';

export default state => {
  const { root } = state;
  const { system } = root;
  const urls = get(system, 'env.urls');

  return {
    qs: get(system, 'env.qs'),    
    urls,
  };
};
