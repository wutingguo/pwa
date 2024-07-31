import Immutable from 'immutable';
import { get } from 'lodash';
import {
  UPLOAD_COMPLETE,
  API_SUCCESS,
  SET_IMAGE_ARRAY,
  DELETE_PROJECT_IMAGE,
  ADD_PROJECT_IMAGTES
} from '@resource/lib/constants/actionTypes';
import { MY_PHOTOS, SASS_GET_SET_PHOTO_LIST } from '@resource/lib/constants/apiUrl';
import { convertObjIn } from '@resource/lib/utils/typeConverter';
import { unique } from '@resource/lib/utils/immutableHelper';
import getActionKey from '@apps/slide-show/utils/actionKey';

const imageArray = (state = Immutable.List([]), action) => {
  switch (action.type) {
    case API_SUCCESS: {
      switch (action.apiPattern.name) {
        case MY_PHOTOS: {
          const str = get(action, 'response.data');
          if (!str || !str.trim()) {
            return state;
          }

          const data = JSON.parse(str);
          if (data && data.length) {
            const newData = data.filter((m) => m.id);
            const newImageArray = state.concat(
              Immutable.fromJS(convertObjIn(newData))
            );

            // 去除id为空的images.
            return newImageArray;
          }

          return state;
        }  
        case SASS_GET_SET_PHOTO_LIST:
          const photoList = convertObjIn(get(action.response, 'data'));
          return Immutable.fromJS(photoList);
        default:
          return state;
      }
    }
    // case UPLOAD_COMPLETE: {
    //   const {
    //     payload: { fields }
    //   } = action;
    //   const imageObj = Immutable.Map(
    //     convertObjIn({
    //       id: fields.imageId,
    //       imageid: fields.imageId,
    //       guid: fields.guid,
    //       encImgId: fields.encImgId,
    //       name: fields.name,
    //       height: fields.height,
    //       width: fields.width,
    //       uploadTime: fields.uploadTime,
    //       orientation: fields.orientation,
    //       order: state.size || 0,
    //       shotTime: fields.shotTime
    //     })
    //   );

    //   return state.push(imageObj);
    // }
    case getActionKey(SET_IMAGE_ARRAY): {
      // 项目初始话时使用
      const { imageArray } = action;
      if (Immutable.List.isList(imageArray)) {
        let newState = state.concat(imageArray);
        // 给所有图片加一个orientation字段如果没有的话.
        newState = newState.map((m) => {
          if (!m.get('orientation')) {
            return m.set('orientation', 0);
          }
          return m;
        });
        // 去重.
        return unique(
          newState,
          (m, n) => m.get('encImgId') === n.get('encImgId')
        );
      }
      return state;
    }
    case getActionKey(DELETE_PROJECT_IMAGE): {
      const { encImgId } = action;
      return state.filter((image) => {
        return image.get('encImgId') !== encImgId;
      });
    }
    case getActionKey(ADD_PROJECT_IMAGTES): {
      const { images } = action;
      const newImages = Immutable.fromJS(images);
      return state.concat(newImages);
    }
    default:
      return state;
  }
};

export default imageArray;
