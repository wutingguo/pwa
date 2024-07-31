import { combineReducers } from 'redux';

import status from './status';
import uploading from './uploading';

export default combineReducers({
	status,
	uploading
});