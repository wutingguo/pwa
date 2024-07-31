import { fromJS, isImmutable } from 'immutable';
import { get, merge } from 'lodash';
import { API_SUCCESS } from '@resource/lib/constants/actionTypes';
import {
  SAAS_EMAIL_SHARE_GET_DIRECT_LINK,
  SAAS_EMAIL_SHARE_GET_EMAIL_THEME,
  SAAS_EMAIL_SHARE_SEND_INVITE,
} from '@resource/lib/constants/apiUrl';
import { convertObjIn } from '@resource/lib/utils/typeConverter';

const share = (state = fromJS({}), action) => {
  switch (action.type) {
    case API_SUCCESS:
      switch (action.apiPattern.name) {
        // 获取邮箱分享直白链接
        case SAAS_EMAIL_SHARE_GET_DIRECT_LINK:
          const directLink = convertObjIn(get(action.response, 'data'));
          return state.set('directLink', directLink);
        
        // 获取邮箱分享邮箱主题
        case SAAS_EMAIL_SHARE_GET_EMAIL_THEME:
          const emailTheme = convertObjIn(get(action.response, 'data'));
          return state.set('emailTheme', emailTheme);
        
        // 发送邮件邀请
        case SAAS_EMAIL_SHARE_SEND_INVITE:
          const sendInvite = convertObjIn(get(action.response, 'data'));
          return state.update(() => sendInvite);
        
        default:
          return state;
      }
    default:
      return state;
  }
};

export default share;
