import { combineReducers } from 'redux';

import favorite from './favorite';
import download from './download';

export default combineReducers({
  favorite,
  download
});
