import { combineReducers } from 'redux';

import activites from './activities';
import detail from './detail';
import list from './list';
import settings from './settings';

export default combineReducers({
  list,
  detail,
  settings,
  activites,
});
