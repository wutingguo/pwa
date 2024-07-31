import { combineReducers } from 'redux';

import imageArray from './imageArray';
import selectedImages from './selectedImages';

export default combineReducers({
  imageArray,
  selectedImages
});
