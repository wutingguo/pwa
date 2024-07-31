import { combineReducers } from 'redux';
import clock from './clock';
import labs from './labs';
import globalSettings from './globalSettings';
import designer from './designer';

export default combineReducers({
  clock,
  labs,
  globalSettings,
  designer
});