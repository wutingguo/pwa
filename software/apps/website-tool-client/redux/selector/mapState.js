import Immutable, { fromJS } from 'immutable';
import { get, merge } from 'lodash';
import { createSelector } from 'reselect';

const emptyMap = fromJS({});
const emptyList = fromJS([]);

const rootNode = state => get(state, 'root');
const collectionNode = state => get(state, 'collection');
const guestNode = state => get(state, 'guest');
const favoriteNode = state => get(state, 'favorite.detail');
const storeNode = state => get(state, 'store');
const getEnv = createSelector(rootNode, data => get(data, 'system.env'));

const getUrls = createSelector(getEnv, data => data.urls);

export default state => ({});
