import { combineReducers } from 'redux';
import collection from './collection';
import effects from './effects';
import category from './category';
import images from './images';

export default combineReducers({
  collection,
  effects,
  images,
  category
});
