import { combineReducers } from 'redux';
import images from './images';
import collection from './collection';
import share from './share';

export default combineReducers({
  images,
  collection,
  share,
});