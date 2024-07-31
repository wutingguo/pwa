import { combineReducers } from 'redux';

import list from './list';
import detail from './detail';
import activites from './activities';
import settings from './settings';

export default combineReducers({
  list,
  detail,
  activites,
  settings,
});

