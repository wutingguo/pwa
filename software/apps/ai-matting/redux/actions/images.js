import { SET_IMAGES } from '../../constants/actionTypes'

export const setImages = images => {
    return dispatch => {
        return dispatch({
            type: SET_IMAGES,
            images
        });
    };
};