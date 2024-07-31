import { combineReducers } from 'redux';

import categories from './categories';
import favorites from './favorites';
import musics from './musics';
import tags from './tags';

export default combineReducers({
  categories,
  favorites,
	musics,
  tags
});