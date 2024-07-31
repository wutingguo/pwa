import { combineReducers } from 'redux';
import system from '@resource/pwa/redux/reducer';
import project from './project';

export default combineReducers({
  root: system,
  project,
});
