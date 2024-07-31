import { combineReducers } from 'redux';
import images from './images';
import collection from './collection';
import share from './share';
import musics from './musics';
import transitionModes from './transitionModes';
import postcard from './postcard';

export default combineReducers({
  images,
  collection,
  share,
  musics,
  transitionModes,
  postcard
});