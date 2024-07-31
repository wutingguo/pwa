export const photoListKeys = {
  photos: 'photos',
  publish: 'configPublish'
};

// 左侧菜单配置(每个key都不能相同)
export const tabsConfig = [
  {
    name: t('SLIDE_SHOW'),
    icon: 'photo',
    key: photoListKeys.photos,
    tabIndex: 0,
    path: '/software/slide-show/collection/:id/photos'
  },
  {
    name: t('SLIDESHOW_CONFIG_PUBLISH'),
    icon: 'settings',
    key: photoListKeys.publish,
    tabIndex: 1,
    path: '/software/slide-show/collection/:id/publish',
    items: [
      {
        key: 'designPublish',
        text: 'Design & Publish',
        path: '/software/slide-show/collection/:id/publish'
      },
      !__isCN__ && {
        key: 'slideshowSettings',
        text: 'Slideshow Settings',
        path: '/software/slide-show/collection/:id/slide-show-settings'
      },
      {
        key: 'downloadSetting',
        text: 'Download Settings',
        path: '/software/slide-show/collection/:id/setting'
      }
    ].filter(a => a)
  }
];

function getFlattenTabsConfig() {
  let flattenData = [];
  tabsConfig.forEach(tabInfo => {
    const { key, tabIndex, path, items } = tabInfo;
    flattenData.push({ key, tabIndex, path });
    if (items && items.length) {
      items.forEach(item => {
        const { path, key, subPath } = item;
        let isPathExist;
        flattenData = flattenData.map(ele => {
          if (ele.path === path) {
            isPathExist = true;
            return {
              ...ele,
              key
            };
          }
          return ele;
        });
        if (!isPathExist) {
          flattenData.push({ key, tabIndex, path });
        }
        if (subPath && subPath.length) {
          subPath.forEach(({ key, path }) => flattenData.push({ key, tabIndex, path }));
        }
      });
    }
  });
  return flattenData;
}

export const flattenTabsConfig = getFlattenTabsConfig();
