import { combineReducers } from 'redux';
import system from '@resource/pwa-client/redux/reducer';
import store from './store';
import commodity from './commodity';

export default combineReducers({
  root: system,
  store,
  commodity
});
