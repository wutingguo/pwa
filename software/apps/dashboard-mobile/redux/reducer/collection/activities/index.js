import { combineReducers } from 'redux';

import download from './download';
import favorite from './favorite';

export default combineReducers({
  favorite,
  download,
});
