import { fromJS, isImmutable } from 'immutable';
import { get, merge } from 'lodash';
import { API_SUCCESS } from '@resource/lib/constants/actionTypes';
import {
  SAAS_CLIENT_GALLERY_MARK_TO_FAVORITE,
  SAAS_CLIENT_GALLERY_UNMARK_FROM_FAVORITE,
  SAAS_CLIENT_GALLERY_GET_GUEST_FAVORITES,
  SAAS_CLIENT_GALLERY_ADD_COMMENT,
  SAAS_CLIENT_GALLERY_LIST_LABEL_COUNT,
  SAAS_CLIENT_GALLERY_LIST_LABEL_IMAGES
} from '@resource/lib/constants/apiUrl';
import { CURRENT_SET_FAVORITE_IMAGE_COUNT } from '@apps/gallery-client/constants/actionTypes';

import { convertObjIn } from '@resource/lib/utils/typeConverter';

const detail = (state = fromJS({}), action) => {
  switch (action.type) {
    case API_SUCCESS: {
      switch (action.apiPattern.name) {
        case SAAS_CLIENT_GALLERY_GET_GUEST_FAVORITES: {
          const item = convertObjIn(get(action.response, 'data'));
          return state.merge(fromJS(item));
          // return fromJS(item);
        }
        case SAAS_CLIENT_GALLERY_MARK_TO_FAVORITE: {
          const { enc_image_uid, favorite_uid, set_id } = convertObjIn(
            get(action.response, 'data')
          );
          const favorite_image_list = state.getIn(['favorite_image_list', 'records']) || fromJS([]);

          return state.setIn(
            ['favorite_image_list', 'records'],
            favorite_image_list.push(fromJS({ enc_image_uid, favorite_uid, set_uid: set_id }))
          );
        }

        case SAAS_CLIENT_GALLERY_UNMARK_FROM_FAVORITE: {
          const { enc_image_uid } = convertObjIn(
            get(action.response, 'data') || get(action, 'apiPattern.params')
          );
          const favorite_image_list = state.getIn(['favorite_image_list', 'records']);
          const index = favorite_image_list.findIndex(
            m => m.get('enc_image_uid') === enc_image_uid
          );

          if (index !== -1) {
            return state.setIn(
              ['favorite_image_list', 'records'],
              favorite_image_list.splice(index, 1)
            );
          }

          return state;
        }
        case SAAS_CLIENT_GALLERY_ADD_COMMENT: {
          const { enc_image_uid, favorite_note } = convertObjIn(get(action.response, 'data'));

          const favorite_image_list = state.getIn(['favorite_image_list', 'records']);
          const index = favorite_image_list.findIndex(
            m => m.get('enc_image_uid') === enc_image_uid
          );

          if (index !== -1) {
            const item = favorite_image_list.get(index);

            return state.setIn(
              ['favorite_image_list', 'records', String(index)],
              item.merge({
                comment: favorite_note
              })
            );
          }

          return state;
        }
        case SAAS_CLIENT_GALLERY_LIST_LABEL_COUNT: {
          const list_label_count = convertObjIn(get(action.response, 'data'));
          return state.setIn(
            ['list_label_count'],
            fromJS(list_label_count.filter(i => i.label_enable !== false))
          );
        }
        case SAAS_CLIENT_GALLERY_LIST_LABEL_IMAGES: {
          const label_img_list = convertObjIn(get(action.response, 'data'));
          return state.setIn(
            ['label_img_list', `${action.apiPattern.params.label_id}`],
            fromJS(label_img_list)
          );
        }

        default: {
          return state;
        }
      }
    }
    case CURRENT_SET_FAVORITE_IMAGE_COUNT: {
      const currentSet = get(action, ['payload', 'currentSet']);
      const favoriteImageList = get(action, ['payload', 'favoriteImageList']);
      const images = currentSet;
      const currentFavoriteImageList = favoriteImageList
        .map(m => {
          const item = images.find(k => k.get('enc_image_uid') === m.get('enc_image_uid'));

          if (!item) {
            return item;
          }

          return item.merge(
            fromJS({
              favorite: m
            })
          );
        })
        .filter(v => !!v);
      return state.update('currentSetFavoriteImageCount', () =>
        currentFavoriteImageList ? currentFavoriteImageList.size : 0
      );
    }
    default: {
      return state;
    }
  }
};

export default detail;
