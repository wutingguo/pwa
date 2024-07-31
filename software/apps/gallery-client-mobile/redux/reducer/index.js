import { combineReducers } from 'redux';

import system from '@resource/pwa-client/redux/reducer';

import collection from './collection';
import favorite from './favorite';
import guest from './guest';
import editor from './editor';
import store from './store';

export default combineReducers({
  root: system,
  collection,
  guest,
  favorite,
  store,
  editor,
});
