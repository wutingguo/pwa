import { combineReducers } from 'redux';
import images from './images';
import property from './property';
import renderData from './renderData';
import page from './page';

export default combineReducers({
    property,
    images,
    renderData,
    page
})