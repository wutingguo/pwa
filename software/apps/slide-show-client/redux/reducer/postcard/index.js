import { fromJS, isImmutable } from 'immutable';
import { API_SUCCESS } from '@resource/lib/constants/actionTypes';
import {
  GET_DETAIL_POST_CARD,
  GET_POST_CARD_LIST,
} from '@resource/lib/constants/apiUrl';

const defaultState = {
  list: [],
  detail: {
    card_name: '',
    studio_name: '',
    studio_introduction: '',
    studio_address: '',
    weibo_account: '',
    weichat_account: '',
    official_website: '',
    official_logo_image: '',
    official_qr_code: '',
    is_default: true
  },
  usedDetail: {}
};

const postcard = (state = fromJS(defaultState), action) => {
  switch (action.type) {
    case API_SUCCESS:
      switch (action.apiPattern.name) {
        case GET_DETAIL_POST_CARD:
          return state.set('usedDetail', fromJS(action.response.data));
        case GET_POST_CARD_LIST:
          const list = action.response.data || [];
          return state.set('list', fromJS(list));
        default:
          return state;
      }
    default:
      return state;
  }
};

export default postcard;
