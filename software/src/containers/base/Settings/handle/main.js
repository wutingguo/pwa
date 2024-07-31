import pathToRegexp from 'path-to-regexp';

export function getCurrentSidebarKey(pathname, settingsConfig) {
  let selectedKeys;
  const l = settingsConfig.length;
  // 根据路径匹配设置 currentTabIndex
  for (let i = 0; i < l; i++) {
    const {key,  path} = settingsConfig[i];
    const match = pathToRegexp(path).exec(pathname);
    if(match) {
      selectedKeys = [key];
      break;
    }
  }
  return {selectedKeys}
}
