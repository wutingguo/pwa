import { fromJS, isImmutable } from 'immutable';
import { get, isEmpty } from 'lodash';
import { API_SUCCESS } from '@resource/lib/constants/actionTypes';
import { guid } from '@resource/lib/utils/math';
import {
  SAAS_CLIENT_SLIDESHOW_PREVIEW_GET_DETAIL,
  SAAS_CLIENT_SLIDESHOW_LICENSE_LEVEL,
  SAAS_CLIENT_SLIDESHOW_LICENSE_LEVEL_WITH_GIVE_AWAY,
  SAAS_SLIDE_GET_DOWNLOAD_SETTING_CLIENT,
  SAAS_SLIDE_GET_DOWNLOAD_URL_CLIENT,
  EGT_STUDIO_INFO_CLIENT
} from '@resource/lib/constants/apiUrl';
import { licenseLevel } from '@resource/lib/constants/strings';
import codes from '@resource/lib/constants/responseCode';

import { convertObjIn } from '@resource/lib/utils/typeConverter';

const defaultState = fromJS({ isLoadCompleted: false });

const defaultSegment = {
  guid: guid(),
  music: {
    duration: 60,
    audios: [
      {
        enc_id: '',
        start: 0,
        end: 60,
        offset: 0
      }
    ]
  },
  frames: [],
  setting: {
    transition_mode: 1,
    transition_duration: 1
  },
  license: '', // Project 对应用户的订阅等级
  selected: true,
  downloadSetting: {},
  downloadUrl: {}
};

const detail = (state = defaultState, action) => {
  switch (action.type) {
    case API_SUCCESS:
      switch (action.apiPattern.name) {
        case SAAS_CLIENT_SLIDESHOW_PREVIEW_GET_DETAIL: {
          const ret_code = get(action.response, 'ret_code');

          // 选片集已经过期
          if (ret_code === codes.C_420301) {
            return state.merge({
              isExpired: true,
              isLoadCompleted: true
            });
          }

          // collections 删除查询不到数据
          if (ret_code === codes.C_404300) {
            return state.merge({
              isNoData: true,
              isLoadCompleted: true
            });
          }

          const item = convertObjIn(get(action.response, 'data'));
          const segments = get(item, 'segments', []);
          if (!segments.length) {
            segments.push(defaultSegment);
          }

          segments[0].selected = true;
          return state.merge(fromJS(item), {
            isLoadCompleted: true,
            cover: fromJS(item['cover_img'])
          });
        }
        case SAAS_CLIENT_SLIDESHOW_LICENSE_LEVEL: {
          const ret_code = get(action.response, 'ret_code');
          if (ret_code === codes.C_200000) {
            const data = get(action.response, 'data');
            return state.merge({
              license: licenseLevel[data]
            });
          }
          return state;
        }
        case SAAS_CLIENT_SLIDESHOW_LICENSE_LEVEL_WITH_GIVE_AWAY: {
          const ret_code = get(action.response, 'ret_code');
          if (ret_code === codes.C_200000) {
            const data = get(action.response, 'data');
            if (data && !isEmpty(data)) {
              return state.merge({
                license: {
                  level: licenseLevel[data.plan_level],
                  trial_plan_level: data.trial_plan_level
                }
              });
            }
            return state;
          }
          return state;
        }
        case SAAS_SLIDE_GET_DOWNLOAD_SETTING_CLIENT: {
          const ret_code = get(action.response, 'ret_code');
          if (ret_code === codes.C_200000) {
            const data = get(action.response, 'data');
            // console.log("-----------data......",data)
            return state.merge({
              downloadSetting: data
            });
          }
          return state;
        }
        case SAAS_SLIDE_GET_DOWNLOAD_URL_CLIENT: {
          const ret_code = get(action.response, 'ret_code');
          if (ret_code === codes.C_200000) {
            const data = get(action.response, 'data');
            // console.log("-----------data......",data)
            return state.merge({
              downloadUrl: data
            });
          }
          return state;
        }
        case EGT_STUDIO_INFO_CLIENT: {
          const ret_code = get(action.response, 'ret_code');
          if (ret_code === codes.C_200000) {
            const data = get(action.response, 'data');
            const studioInfo = data && data[0];
            return state.merge({
              logo: fromJS({
                orientation: 3,
                enc_image_uid: studioInfo.studio_logo
              })
            });
          }
          return state;
        }

        default: {
          return state;
        }
      }
    default: {
      return state;
    }
  }
};

export default detail;
