import Immutable, { get } from 'immutable';
import {
    CREATE_ELEMENT,
    CREATE_ELEMENTS,
    DELETE_ELEMENTS,
    UPDATE_ELEMENT,
    UPDATE_ELEMENTS,
    SET_PAGE,
    UPDATE_PAGE
} from '../../constants/actionTypes';
import getSettedElements from '@apps/ai-matting/redux/redux-helper/elements';
import undoable from '@apps/ai-matting/utils/undoable';

const initialState = Immutable.fromJS({});

const undoableActionTypes = [
    CREATE_ELEMENT,
    CREATE_ELEMENTS,
    DELETE_ELEMENTS,
    UPDATE_ELEMENT,
    UPDATE_ELEMENTS
];

const pageReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_PAGE: {
            if (action.page) {
                return Immutable.fromJS(action.page);
            }
            return state;
        }
        case UPDATE_PAGE: {
            if (action.page) {
                return state.merge(action.page);
            }
            return state;
        }

        case CREATE_ELEMENT:
        case CREATE_ELEMENTS:
        case DELETE_ELEMENTS:
        case UPDATE_ELEMENT:
        case UPDATE_ELEMENTS: {
            const oldElements = state.get('elements');
            const newElements = getSettedElements(oldElements, action, action.updateElements);
            return state.set('elements', newElements);
        }
        default:
            return state;
    }
};

export default undoable(initialState, pageReducer, {
    filter: undoableActionTypes,
    limit: 10
});