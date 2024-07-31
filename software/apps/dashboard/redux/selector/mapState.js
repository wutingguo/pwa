import { fromJS } from 'immutable';
import { get, merge } from 'lodash';
import { createSelector } from 'reselect';
import * as stateHelper from '@apps/aiphoto/utils/mapStateHelper';

const getDesignStatus = state => {
  return get(state, 'dashboard.designStatus')
}

export default state => {
  const newState = {
    designStatus: getDesignStatus(state)
  };
  return newState;
};
