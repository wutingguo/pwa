import { combineReducers } from 'redux';
import system from '@resource/pwa-client/redux/reducer';
import collection from './collection';
import guest from './guest';
import store from './store';
import favorite from './favorite';

export default combineReducers({
  root: system,
  collection,
  guest,
  favorite,
  store
});
