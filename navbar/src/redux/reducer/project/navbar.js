import {
  UPDATE_NAVBAR_ITEMS,
  CLEAR_NAVBAR_ITEMS,
  SET_NAVBAR_LABTYPE,
  UPDATE_SUBSCRIPTION,
} from '@src/redux/constants/actionTypes';
import { fromJS } from 'immutable';

const initState = fromJS({
  help: {
    isShow: true
  },
  labs: {
    isShow: false
  },
  project: {
    isShow: false
  },
  stuff: {
    isShow: false
  },
  projectToggle:{
    isShow: true
  },
  isZnoLab: true,
  productCode: '',
  mySubscription: {}
});

const r = (state = initState, action) => {
  switch (action.type) {
    case UPDATE_NAVBAR_ITEMS:{
      return state.merge(fromJS(action.data));
    }
    case CLEAR_NAVBAR_ITEMS:{
      return initState;
    }
    case SET_NAVBAR_LABTYPE: {
      return state.merge(fromJS(action.data));
    }
    case UPDATE_SUBSCRIPTION: {
      const { subscription: mySubscription } = action;
      return state.merge({ mySubscription });
    }
    default:{
      return state;
    }
  }
}

export default r;
