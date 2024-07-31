import { combineReducers } from 'redux';
import pageArray from './pageArray';
import renderData from './renderData';
import property from './property';
import pagination from './pagination';

export default combineReducers({
  pageArray,
  renderData,
  property,
  pagination
});
