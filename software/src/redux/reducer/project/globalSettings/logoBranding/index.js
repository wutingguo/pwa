import { fromJS } from 'immutable';
import { get } from 'lodash';

import { convertObjIn } from '@resource/lib/utils/typeConverter';

import {
  API_SUCCESS,
  GLOBAL_SETTINGS_BEFORE_UPLOAD_LOGO,
  GLOBAL_SETTINGS_DELETE_LOGO,
} from '@resource/lib/constants/actionTypes';
import {
  GLOBAL_SETTINGS_GET_DEFAULT_BRAND,
  GLOBAL_SETTINGS_LOGO_BRANDING_GET_DETAIL,
  GLOBAL_SETTINGS_LOGO_BRANDING_SAVE,
  GLOBAL_SETTINGS_UPLOAG_LOGO,
} from '@resource/lib/constants/apiUrl';

const logoBranding = (state = fromJS({}), action) => {
  switch (action.type) {
    case API_SUCCESS:
      switch (action.apiPattern.name) {
        case GLOBAL_SETTINGS_UPLOAG_LOGO:
          const logo = convertObjIn(get(action.response, 'data'));
          return state.set('logo', logo);

        case GLOBAL_SETTINGS_LOGO_BRANDING_SAVE:
          const result = convertObjIn(get(action.response, 'data'));
          return state.update('logoBranding', () => result);

        case GLOBAL_SETTINGS_LOGO_BRANDING_GET_DETAIL:
          const detail = convertObjIn(get(action.response, 'data'));
          return fromJS(detail || {});

        case GLOBAL_SETTINGS_GET_DEFAULT_BRAND:
          const data = convertObjIn(get(action.response, 'data'));
          const { sub_domain_prefix } = data;
          return state.set('sub_domain_prefix', sub_domain_prefix);

        default:
          return state;
      }
    case GLOBAL_SETTINGS_BEFORE_UPLOAD_LOGO:
      // 再次上传图片之前，做相关操作
      return state.updateIn(['logo', 'image_uid'], () => 0);
    case GLOBAL_SETTINGS_DELETE_LOGO:
      return state.set('logo', fromJS({}));
    default:
      return state;
  }
};

export default logoBranding;
