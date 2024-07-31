import {fromJS} from 'immutable';
import _ from 'lodash';
import {
  UPDATE_ALL_FAVORITE_LIST,
  UPDATE_GUEST_FAVORITE_LIST,
  UPDATE_GUEST_LIST_AFTER_DELETE
} from '@apps/gallery/constants/actionTypes';

const initState = fromJS({
  allFavoriteList: [],
  guestFavoriteInfo: {}
});

export default (state=initState, {type, payload}) => {
  switch(type) {
    // 更新 Favorite Setting 列表
    case UPDATE_ALL_FAVORITE_LIST: {
      let list = _.get(payload, ['data', 'records'], []);
      list = list.map((item={}) => {
        const {image_names=[], ...res} = item;
        const reg = /(.+)\.\w+$/;
        const newNames = image_names.map(name => String(name).replace(reg, "$1"));
        return {
          ...res,
          image_names: newNames
        }
      })
      return state.update('allFavoriteList', () => fromJS(list));
    }
    // 更新客户 favorite 图片列表
    case UPDATE_GUEST_FAVORITE_LIST: {
      const {data} = payload;
      return state.update('guestFavoriteInfo', () => fromJS(data));
    }
    // 删除图片后更新客户 favorite 图片列表 
    case UPDATE_GUEST_LIST_AFTER_DELETE: {
      const {data} = payload;
      const newState = state.updateIn(
        ['guestFavoriteInfo', 'favorite_image_list', 'records'],
        imgList => imgList.filter(item => item.get('enc_image_uid') != data.enc_image_uid)
      );
      const total = newState.getIn(['guestFavoriteInfo', 'favorite_image_list', 'records']).size;
      return newState.updateIn(['guestFavoriteInfo', 'favorite_image_list', 'total'], () => total);
    }
    default:
      return state;
  }
}