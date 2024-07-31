import { combineReducers } from 'redux';

import music from './music';
import selectedMusics from './selectedMusics';

export default combineReducers({
  music,
  selectedMusics
});
