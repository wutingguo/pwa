import { SAVE_LIVE_ALBUM_INFO, SAVE_LIVE_ALBUM_LIST } from '@apps/live/constants/actionTypes';

const saveLiveAlbumInfo = albumInfo => {
  return {
    type: SAVE_LIVE_ALBUM_INFO,
    data: albumInfo
  };
};

const saveLiveAlbumList = list => {
  return {
    type: SAVE_LIVE_ALBUM_LIST,
    data: list
  };
};

export default {
  saveLiveAlbumInfo,
  saveLiveAlbumList
};
