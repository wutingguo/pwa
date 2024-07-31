import { combineReducers } from 'redux';

import env from './env';
import images from './image';
import productInfo from './productInfo';
import project from './project';

export default combineReducers({
  images,
  env,
  productInfo,
  project
});
