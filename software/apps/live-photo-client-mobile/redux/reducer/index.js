import { combineReducers } from 'redux';

import system from '@resource/pwa-client/redux/reducer';

import activityInfo from './activityInfo';
import logoInfo from './logoInfo';
import userInfo from './userInfo';

export default combineReducers({
  root: system,
  activityInfo,
  userInfo,
  logo: logoInfo,
});
