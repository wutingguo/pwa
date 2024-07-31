import { fromJS, isImmutable } from 'immutable';
import { get, merge } from 'lodash';
import { API_SUCCESS } from '@resource/lib/constants/actionTypes';
import {
  ADD_POST_CARD,
  EDIT_POST_CARD,
  GET_DETAIL_POST_CARD,
  DELETE_POST_CARD,
  GET_POST_CARD_LIST,
  SAAS_SLIDE_SHOW_UPLOAD_POST_CARD
} from '@resource/lib/constants/apiUrl';
import { CHANGE_POST_CARD_DETAIL, SET_POST_CARD_DETAIL, SET_USED_POST_CARD_DETAIL } from '@resource/lib/constants/actionTypes';
import { convertObjIn } from '@resource/lib/utils/typeConverter';
import {getSlideShowImageUrl} from '@resource/lib/saas/image';
import getActionKey from '@apps/slide-show/utils/actionKey';

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
        case SAAS_SLIDE_SHOW_UPLOAD_POST_CARD:
          const { apiPattern, response = {}} = action;
          const { data = {} } = response;
          const { params = {} } = apiPattern;
          const { galleryBaseUrl, name } = params;
          const { enc_image_uid } = data;
          const imageUrl = getSlideShowImageUrl({
            galleryBaseUrl,
            enc_image_uid,
            isWaterMark: false,
          });
          return state.setIn(['detail', name], enc_image_uid);
        case GET_DETAIL_POST_CARD:
          const isUsed = get(action, 'apiPattern.params.isUsed');
          if(isUsed) {
            return state.set('usedDetail', fromJS(action.response.data));
          }
          return state.set('detail', fromJS(action.response.data));
        case GET_POST_CARD_LIST:
          const list = action.response.data || [];
          return state.set('list', fromJS(list));
        default:
          return state;
      }
    case CHANGE_POST_CARD_DETAIL:
      const { field } = action;
      return state.setIn(['detail', field.name], field.value);
    case SET_POST_CARD_DETAIL:
      const { data } = action;
      return state.set('detail', data);
    case SET_USED_POST_CARD_DETAIL:
      return state.set('usedDetail', fromJS(action.data));
    default:
      return state;
  }
};

export default postcard;
