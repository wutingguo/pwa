import { SAVE_LIVE_ALBUM_LIST } from '@apps/live/constants/actionTypes';
// import { liveSubRoutes } from '@resource/pwa/utils/routes';

const initState = [];

const albumList = (state = initState, action) => {
  switch (action.type) {
    case SAVE_LIVE_ALBUM_LIST: {
      return [...action.data];
    }

    default:
      return state;
  }
};

export default albumList;
