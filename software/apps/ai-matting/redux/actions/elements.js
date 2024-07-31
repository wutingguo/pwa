import Immutable from "immutable";

import { UPDATE_ELEMENTS } from '../../constants/actionTypes';

export const updateElements = updateElementArray => {
    return (dispatch, getState) => {
        const immutableUpdateArray = Immutable.fromJS(updateElementArray);
        dispatch({
            type: UPDATE_ELEMENTS,
            updateElements: immutableUpdateArray
        })
    }
}

export const updateElement = (updateElement) => {
    return updateElements([updateElement]);
}