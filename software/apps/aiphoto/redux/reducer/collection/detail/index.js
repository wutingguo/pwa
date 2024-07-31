import { fromJS, isImmutable } from 'immutable';
import { get, isEmpty, merge } from 'lodash';

import { convertObjIn } from '@resource/lib/utils/typeConverter';

import { API_SUCCESS, UPLOAD_COMPLETE } from '@resource/lib/constants/actionTypes';
import {
  SAAS_GET_AIPHOTO_COLLECTION_PROGRESS,
  SAAS_GET_AIPHOTO_IMAGE_LIST,
} from '@resource/lib/constants/apiUrl';

import {
  HIDE_IMAGE_VIEWER,
  RESET_COLLECTION_DETAIL,
  SET_DETAIL_CONTENT_LOADING,
  SHOW_IMAGE_VIEWER,
  UPDATE_COLLECTION_NAME_IN_DETAIL,
} from '@apps/gallery/constants/actionTypes';

const detail = (state = fromJS({}), action) => {
  switch (action.type) {
    case RESET_COLLECTION_DETAIL: {
      return fromJS({});
    }
    case API_SUCCESS:
      switch (action.apiPattern.name) {
        case SAAS_GET_AIPHOTO_COLLECTION_PROGRESS: {
          const item = convertObjIn(get(action.response, 'data'));
          return state.merge(item);
        }
        case SAAS_GET_AIPHOTO_IMAGE_LIST: {
          const imageList = convertObjIn(get(action.response, 'data')) || [];

          return state.update('images', imgList => {
            const oldList = imgList ? imgList.toJS() : [];

            if (imageList.length < 1 || imageList.length !== oldList.length) {
              return fromJS(imageList);
            }

            const newList = imageList.map(item => {
              const findIndex = oldList.findIndex(i => i.enc_image_id === item.enc_image_id);
              if (findIndex > -1) {
                return {
                  ...oldList[findIndex],
                  correct_status: item.correct_status,
                };
              }
              return item;
            });

            return fromJS(newList);
          });
        }
      }
    // 切换选中/反选图片
    case 'CHANGE_SELECTION_AIPHOTO':
      const id = get(action, ['payload', 'id']);
      if (!id) {
        return state;
      }
      return state.update('images', imgList =>
        imgList.map(img => {
          const selected = img.get('selected');
          if (id === img.get('enc_image_id')) {
            return img.merge({ selected: !selected });
          }
          return img;
        })
      );
    // 全选图片
    case 'SELECT_ALL_IMG_AIPHOTO':
      return state.update('images', imgList => imgList.map(img => img.merge({ selected: true })));

    // 清除选中图片
    case 'CLEAR_SELECTION_AIPHOTO':
      return state.update('images', imgList => imgList.map(img => img.merge({ selected: false })));

    // 删除图片
    case 'DELETE_IMAGE_AIPHOTO': {
      const imageIdList = get(action, ['payload', 'data'], {});

      return state.update('images', imgList =>
        imgList.filter(img => !imageIdList.includes(img.get('collection_image_id')))
      );
    }
    // 图片预览
    case SHOW_IMAGE_VIEWER:
      return state.updateIn(['photos', 'isShownImageViewer'], () => true);
    // 取消图片预览
    case HIDE_IMAGE_VIEWER:
      return state.updateIn(['photos', 'isShownImageViewer'], () => false);
    case UPDATE_COLLECTION_NAME_IN_DETAIL: {
      const { collection_name = '' } = action.payload;
      return state.update('collection_name', () => collection_name);
    }
    // 进入详情、切换set加载loading
    case SET_DETAIL_CONTENT_LOADING: {
      const data = get(action, ['payload', 'loading']);

      return state.update('isShowContentLoading', () => data.loading);
    }

    case 'UPDATE_COLLECTION_ID': {
      const { collectionId = '' } = action.payload;
      return state.update('collection_id', () => collectionId);
    }
    case 'UPDATE_COLLECTION_BATCH': {
      const { collection_name } = action.payload;
      return state.merge({
        collection_name,
      });
    }
    case 'UPLOAD_COMPLETE_AIPHOTO': {
      const {
        payload: { fields },
      } = action;
      console.log('fields===>', fields);
      const imageObj = fromJS(convertObjIn(fields));
      return state.set('images', state.get('images').push(imageObj));
    }
    case 'UPDATE_COLLECTION_ORIGINAL': {
      const is_original = get(action, ['payload', 'is_original']);
      return state.merge({ is_original });
    }
    case 'UPDATE_COLLECTION_STATUS': {
      const newStatus = get(action, ['payload', 'collection_status']);
      const oldStatus = state.get('collection_status');
      if (typeof oldStatus != 'undefined') {
        return state.update('collection_status', () => newStatus);
      }
      return state;
    }
    case 'UPDATE_COLLECTION_HIDE_RETOUCHER': {
      const hide_retoucher = get(action, ['payload', 'hideRetoucher']);
      return state.merge({ hide_retoucher });
    }
    default:
      return state;
  }
};

export default detail;
