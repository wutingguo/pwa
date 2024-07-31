import { combineReducers } from 'redux';
import albumInfo from './albumInfo';
import albumList from './albumList';

export default combineReducers({
  albumInfo,
  albumList
});
