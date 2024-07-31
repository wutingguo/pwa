import { liveSubRoutes } from '@resource/pwa/utils/routeConfig/livePhoto';

import { SAVE_LIVE_ALBUM_INFO } from '@apps/live/constants/actionTypes';

const initState = {
  currentAlbumId: null,
};

const albumInfo = (state = initState, action) => {
  switch (action.type) {
    case SAVE_LIVE_ALBUM_INFO: {
      const path = window.location.pathname;
      const routres = liveSubRoutes(__isCN__ ? 'cn' : 'en');
      const albumId = routres.reduce((res, item) => {
        if (path.includes(item.path)) {
          const splitPath = path.split('/');
          const _albumId = splitPath[splitPath.length - 2];
          res = _albumId;
        }
        return res;
      }, '');

      if (albumId) {
        return {
          ...action.data,
          currentAlbumId: albumId,
        };
      }

      return {
        ...state,
        ...action.data,
      };
    }

    default:
      return state;
  }
};

export default albumInfo;
