export const photoListKeys = {
  photos: 'photos',
  settings: 'settings',
  activities: 'activities',
};

export const settingFavoriteKey = 'favorite';

export const settingStoreKey = 'store';

const tabPhoto = {
  name: t('GALLERY_TAB_PHOTOS'),
  icon: 'photo',
  key: photoListKeys.photos,
  path: '/software/gallery/collection/:id/photos',
};

const tabActivitie = {
  name: t('ACTIVITIES'),
  icon: 'activitie',
  key: photoListKeys.activities,
  path: '/software/gallery/collection/:id/activities/favorite',
  items: __isCN__
    ? [
        {
          key: 'favorite',
          text: t('FAVORITE_ACTIVITIES'),
          path: '/software/gallery/collection/:id/activities/favorite',
          subPath: [
            {
              key: 'activitiesFavoriteDetail',
              path: '/software/gallery/collection/:id/activities/favorite/:favoriteId',
            },
            {
              key: 'activitiesFavoriteOrderDetail',
              path: '/software/gallery/collection/:id/activities/favorite/order-detail/:favoriteId',
            },
          ],
        },
        {
          key: 'download',
          text: t('DOWNLOAD_ACTIVITIES'),
          path: '/software/gallery/collection/:id/activities/download',
        },
      ]
    : [
        {
          key: 'favorite',
          text: t('FAVORITE_ACTIVITIES'),
          path: '/software/gallery/collection/:id/activities/favorite',
          subPath: [
            {
              key: 'activitiesFavoriteDetail',
              path: '/software/gallery/collection/:id/activities/favorite/:favoriteId',
            },
          ],
        },
        {
          key: 'download',
          text: t('DOWNLOAD_ACTIVITIES'),
          path: '/software/gallery/collection/:id/activities/download',
          subPath: [
            {
              key: 'activitiesDownLoadDetail',
              path: '/software/gallery/collection/:id/activities/download/:emailId',
            },
          ],
        },
      ],
};

const tabSettings = {
  name: t('GALLERY_SETTINGS'),
  icon: 'settings',
  key: photoListKeys.settings,
  path: '/software/gallery/collection/:id/settings/collection',
  items: __isCN__
    ? [
        {
          key: 'collection',
          text: t('COLLECTION_SETTINGS'),
          path: '/software/gallery/collection/:id/settings/collection',
        },
        {
          key: 'favorite1',
          text: t('FAVORITE'),
          favoriteEnabled: '',
          path: '/software/gallery/collection/:id/settings/favorite',
        },
        {
          key: 'download1',
          text: t('DOWNLOAD_SETTINGS'),
          path: '/software/gallery/collection/:id/settings/download',
        },
        {
          key: 'selection',
          text: t('SELECTION_SETTINGS'),
          path: '/software/gallery/collection/:id/settings/selection',
        },
        {
          key: settingStoreKey,
          text: t('STORE_SETTINGS'),
          path: '/software/gallery/collection/:id/settings/store',
          logEventName: 'GallerySetting_Click_Store',
        },
      ]
    : [
        {
          key: 'collection',
          text: t('COLLECTION_SETTINGS'),
          path: '/software/gallery/collection/:id/settings/collection',
        },
        {
          key: 'download',
          text: t('DOWNLOAD'),
          path: '/software/gallery/collection/:id/settings/download',
        },
        {
          key: 'design',
          text: t('DESIGN'),
          path: '/software/gallery/collection/:id/settings/design',
          logEventName: 'GallerySetting_Click_Design',
        },
        {
          key: settingFavoriteKey,
          text: t('FAVORITE'),
          favoriteEnabled: '',
          path: '/software/gallery/collection/:id/settings/favorite',
        },
        {
          key: settingStoreKey,
          text: t('STORE'),
          path: '/software/gallery/collection/:id/settings/store',
          logEventName: 'GallerySetting_Click_Store',
        },
      ],
};

// 左侧菜单配置(每个key都不能相同)
export const tabsConfig = __isCN__
  ? [tabPhoto, tabActivitie, tabSettings]
  : [tabPhoto, tabSettings, tabActivitie];

function getFlattenTabsConfig() {
  let flattenData = [];
  tabsConfig.forEach((tabInfo, tabIndex) => {
    const { key, path, items, logEventName } = tabInfo;
    flattenData.push({ key, tabIndex, path, logEventName });
    if (items && items.length) {
      items.forEach(item => {
        const { path, key, subPath, logEventName } = item;
        let isPathExist;
        flattenData = flattenData.map(ele => {
          if (ele.path === path) {
            isPathExist = true;
            return {
              ...ele,
              key,
            };
          }
          return ele;
        });
        if (!isPathExist) {
          flattenData.push({ key, tabIndex, path, logEventName });
        }
        if (subPath && subPath.length) {
          subPath.forEach(({ key, path, logEventName }) =>
            flattenData.push({ key, tabIndex, path, logEventName })
          );
        }
      });
    }
  });
  return flattenData;
}

export const flattenTabsConfig = getFlattenTabsConfig();
