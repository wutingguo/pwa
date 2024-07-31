import { fromJS, isImmutable } from 'immutable';
import { get, merge } from 'lodash';

import { convertObjIn } from '@resource/lib/utils/typeConverter';

import { API_SUCCESS } from '@resource/lib/constants/actionTypes';
import {
  CREATE_GALLERY_PRESET,
  PRESET_SETTING_UPDATE,
  QUERY_PRESET,
  SAAS_GET_COLLECTIONS_SETTINGS,
  SAAS_PIN_RESET,
  SAAS_UPDATE_COLLECTIONS_SETTINGS,
  GET_MY_SUBSCRIPITON_INFO
} from '@resource/lib/constants/apiUrl';

import {
  UPDATE_COLLRCTION_SETTING_NAME,
  UPDATE_COLLECTIONS_SETTINGS,
  SETTING_TYPES
} from '@apps/gallery/constants/actionTypes';
import { saasProducts } from '@resource/lib/constants/strings';

const settings = (state = fromJS({}), action) => {
  switch (action.type) {
    case API_SUCCESS:
      switch (action.apiPattern.name) {
        case QUERY_PRESET:
        case PRESET_SETTING_UPDATE:
        case CREATE_GALLERY_PRESET: {
          const data = get(action.response, 'data');
          if (!data) {
            return state;
          }
          const presetSettings = convertObjIn(data);
          return state.merge(fromJS({ presetSettings }));
        }
        // 获取 Settings 配置信息
        case SAAS_GET_COLLECTIONS_SETTINGS:
          const collectionsSettings = convertObjIn(get(action.response, 'data'));

          return state.merge(
            fromJS({
              ...collectionsSettings,
              design_setting: {
                ...collectionsSettings.design_setting,
                cover: collectionsSettings.design_setting.cover || {},
                gallery: collectionsSettings.design_setting.gallery || {}
              },
              collection_rule_setting: collectionsSettings.collection_rule_setting || {}
            })
          );

        // 更新 Settings 配置信息
        case SAAS_UPDATE_COLLECTIONS_SETTINGS:
          const setting = fromJS(convertObjIn(get(action.response, 'data')));
          const covertSetting = setting.filter(item => item !== null);
          if (covertSetting.has('cover')) {
            const cover = covertSetting.get('cover');
            const key = cover
              .filter(item => item !== null)
              .keySeq()
              .get(0);
            const val = cover
              .filter(item => item !== null)
              .valueSeq()
              .get(0);
            console.log('key: ', key);
            console.log('val: ', val);
            return state.setIn(['design_setting', 'cover', `${key}`], val);
          } else if (covertSetting.has('gallery')) {
            const gallery = covertSetting.get('gallery');
            const key = gallery
              .filter(item => item !== null)
              .keySeq()
              .get(0);
            const val = gallery
              .filter(item => item !== null)
              .valueSeq()
              .get(0);
            // console.log('key: ', key);
            // console.log('val: ', val);
            return state.setIn(['design_setting', 'gallery', `${key}`], val);
          }
          return state.update(settings => {
            return settings.map(setting => {
              if (
                isImmutable(setting) &&
                +setting.get('setting_type') === +covertSetting.get('setting_type')
              ) {
                return setting.merge(covertSetting);
              }
              return setting;
            });
          });
        case SAAS_PIN_RESET:
          const pinData = convertObjIn(get(action.response, 'data'));
          return state.setIn(['download_setting', 'pin'], pinData.pin);
        case GET_MY_SUBSCRIPITON_INFO:
          const data = get(action.response, 'data');

          if (!data) {
            return state;
          }

          let isGalleryFree = false;
          if (data && data.items && data.items.length) {
            const curInfo = data.items.find(i => i.product_id === saasProducts.gallery);
            if (curInfo) {
              const { plan_level, trial_plan_level } = curInfo;
              isGalleryFree = plan_level === 10 && trial_plan_level <= 10;
            }
          }

          const mySubscription = convertObjIn(data);
          return state.merge({
            isGalleryFree,
            mySubscription
          });
        default:
          return state;
      }
    // setting设置后同步更新状态
    case UPDATE_COLLECTIONS_SETTINGS:
      const { setting_type, collection_uid } = action.payload;
      const key = SETTING_TYPES[setting_type];
      return state.merge({
        [key]: {
          ...state.toJS()[key],
          ...action.payload[key]
        }
      });
    // return state.update('guestFavoriteInfo', () => fromJS(data));

    case UPDATE_COLLRCTION_SETTING_NAME:
      const { collectionName } = action.payload;
      return state.setIn(['collection_setting', 'collection_name'], collectionName);
    default:
      return state;
  }
};

export default settings;
