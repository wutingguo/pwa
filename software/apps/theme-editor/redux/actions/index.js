import pageArray from './pageArray';
import elementAction from './elements';
import renderDataAction from './renderData';
import * as paginationAction from './pagination';
import propertyAction from './property';
import undoActions from '@resource/lib/redux-helper/undoable';
import * as projectActions from './project';

export default {
  ...pageArray,
  ...elementAction,
  ...renderDataAction,
  ...propertyAction,
  ...paginationAction,
  ...undoActions,
  ...projectActions
};
