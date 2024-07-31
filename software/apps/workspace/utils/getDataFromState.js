import { get } from 'lodash';

export default state => {
  const { root, workspace } = state;
  const { system } = root;
  const urls = get(system, 'env.urls');

  return {
    qs: get(system, 'env.qs'),
    urls,
    baseUrl: urls.get('baseUrl'),
    workspaceBaseUrl: urls.get('workspaceBaseUrl'),
    userInfo: get(system, 'userInfo'),
    workspace
  };
};
