import { combineReducers } from 'redux';
import system from '@resource/pwa-client/redux/reducer';
import collection from './collection';
import postcard from './postcard';
import guest from './guest';

export default combineReducers({
  root: system,
  collection,
  postcard,
  guest
});
