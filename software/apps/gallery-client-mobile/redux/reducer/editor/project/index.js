
import Immutable from 'immutable';
import {
	ESTORE_CREATE
} from '@resource/lib/constants/apiUrl';
import { API_SUCCESS, CLEAR_PROJECT_FOR_EDITOR } from '../../../../constants/actionTypes';
import { fromJS } from 'immutable';
const initValues = Immutable.Map({});
const project = (state = initValues, action) => {
	switch (action.type) {
		case API_SUCCESS: {
			if (action.apiPattern.name === ESTORE_CREATE) {
				const { data } = action.response
				return state.merge(data);
			}
			return state;
		}
        case CLEAR_PROJECT_FOR_EDITOR: {
            return fromJS({});
          }
		default: {
			return state;
		}
	}
};

export default project;
