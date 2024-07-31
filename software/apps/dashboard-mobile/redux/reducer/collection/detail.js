import { fromJS, isImmutable } from 'immutable';
import { get, isEmpty, merge } from 'lodash';

import { convertObjIn } from '@resource/lib/utils/typeConverter';

import { API_SUCCESS, UPLOAD_COMPLETE } from '@resource/lib/constants/actionTypes';
import {
  SAAS_COLLECTION_RENAME_SET,
  SAAS_CREATE_SET,
  SAAS_DELETE_SET,
  SAAS_GALLERY_STATUS_POLLING,
  SAAS_GET_COLLECTIONS_SETTINGS,
  SAAS_GET_COLLECTION_DETAIL,
  SAAS_UPDATE_COLLECTION,
  SAAS_UPDATE_COLLECTIONS_SETTINGS,
  SASS_GET_SET_PHOTO_LIST,
} from '@resource/lib/constants/apiUrl';

import {
  APPLY_WATERMARK,
  CHANGE_CURRENT_SET_UID,
  CHANGE_SELECTION,
  CLEAR_SELECTION,
  COPY_IMAGE,
  DELETE_IMAGE,
  HIDE_IMAGE_VIEWER,
  MOVE_IMAGE,
  ORDERING_SET,
  RECOMMEND_IMAGES,
  RENAME_IMG_NAME,
  RESET_COLLECTION_DETAIL,
  RESORT_IMAGES,
  SELECT_ALL_IMG,
  SET_DETAIL_CONTENT_LOADING,
  SHOW_IMAGE_NAME,
  SHOW_IMAGE_VIEWER,
  UPDATE_COLLECTION_NAME_IN_DETAIL,
  UPDATE_COVER,
  UPDATE_IMG_LIST,
  UPDATE_SELECTED_IAMGE,
  UPDATE_WATERMARK_LIST,
  UPDATE_WATERMARK_LOADING,
} from '@apps/gallery/constants/actionTypes';

const detail = (state = fromJS({}), action) => {
  switch (action.type) {
    case RESET_COLLECTION_DETAIL: {
      return fromJS({});
    }
    case API_SUCCESS:
      switch (action.apiPattern.name) {
        case SAAS_GET_COLLECTION_DETAIL: {
          const item = convertObjIn(get(action.response, 'data'));
          item.sets.forEach((it, index) => {
            item.sets[index] = {
              ...item.sets[index],
              watermarkStatus: false,
            };
          });
          const cover = get(item, 'cover', {});
          const newItem = merge(item, {
            watermarkList: [], // 水印列表
            photos: {
              isShowImgName: false,
              isShownImageViewer: false,
            },
            cover: {
              ...cover,
              coverTimestamp: Date.now(),
            },
            images: item.default_image_list || [],
            currentSetUid:
              state.get('currentSetUid') || String(get(item, ['sets', '0', 'set_uid'])),
          });
          delete newItem.default_image_list;

          window.logEvent.setBaseParmas({
            CollectionID: newItem.collection_uid,
          });

          return fromJS(newItem);
        }
        // rename colleciimages
        case SAAS_COLLECTION_RENAME_SET:
          const data = get(action, ['response', 'data'], {});
          if (isEmpty(data)) return state;
          const { set_uid, set_name } = data;
          const defaultSetId = state.getIn(['default_set', 'set_uid']);
          let newState = state.update('sets', sets =>
            sets.map(s => {
              if (+set_uid === +s.get('set_uid')) {
                return s.update('set_name', () => set_name);
              }
              return s;
            })
          );
          if (+set_uid === +defaultSetId) {
            newState = newState.updateIn(['default_set', 'set_name'], () => set_name);
          }
          return newState;
        // rename collection cover
        case SAAS_UPDATE_COLLECTION:
          const collection_name = get(action, ['response', 'data', 'collection_name']);
          return collection_name ? state.update('collection_name', () => collection_name) : state;
        case SASS_GET_SET_PHOTO_LIST:
          const imageList = convertObjIn(get(action.response, 'data'));
          const sets = state.get('sets').toJS();
          const currentSetUid = state.get('currentSetUid');
          let currentImages = imageList;

          sets.forEach((item, index) => {
            if (item.set_uid == currentSetUid && item?.watermarkStatus) {
              currentImages = item?.tabImages;
            }
          });
          return state.merge({
            sets: fromJS(sets),
            images: fromJS(currentImages),
          });
        // 新增set
        case SAAS_CREATE_SET: {
          const setItem = convertObjIn(get(action.response, 'data'));
          const currentSetUid = String(get(setItem, 'set_uid'));
          if (!!currentSetUid && currentSetUid !== 'undefined') {
            const sets = state.get('sets');
            const newSets = !isEmpty(setItem)
              ? sets.push(fromJS({ ...setItem, watermarkStatus: false }))
              : sets;
            const convertState = state.update('sets', () => fromJS(newSets));

            return convertState.update('currentSetUid', () => currentSetUid);
          }
          return state;
        }
        // 删除set
        case SAAS_DELETE_SET: {
          const deleteSetUid = get(convertObjIn(action.response), 'data.set_uid');
          const sets = state.get('sets');

          const deleteIndex = sets.findIndex(item => item.get('set_uid') === deleteSetUid);
          // const convertState = state.update('currentSetUid', () => sets.get(['0', 'set_uid']));
          return deleteIndex !== -1 ? state.deleteIn(['sets', deleteIndex]) : state;
        }
        case SAAS_GALLERY_STATUS_POLLING: {
          const data = convertObjIn(get(action.response, 'data'));
          let statusMap = {};
          if (data && Array.isArray(data)) {
            data.forEach(item => {
              statusMap[item.image_id] = item;
            });
          }
          const newState = state.update('images', images =>
            images.map(s => {
              if (statusMap[s.get('enc_image_uid')]) {
                const { corrected_image_id, enc_corrected_image_id, correct_status } =
                  statusMap[s.get('enc_image_uid')];
                const oldStatus = s.get('correct_status');
                if (oldStatus !== correct_status) {
                  return s.merge({
                    corrected_image_uid: corrected_image_id,
                    enc_corrected_image_uid: enc_corrected_image_id,
                    correct_status,
                  });
                }
              }
              return s;
            })
          );
          return fromJS(newState);
        }
        default:
          return state;
      }
    // 显示图片名称
    case SHOW_IMAGE_NAME:
      const isShowImgName = get(action, ['payload', 'isShowImgName']);
      return state.updateIn(['photos', 'isShowImgName'], () => isShowImgName);
    // 切换选中/反选图片
    case CHANGE_SELECTION:
      const id = get(action, ['payload', 'id']);
      if (!id) {
        return state;
      }
      return state.update('images', imgList =>
        imgList.map(img => {
          const selected = img.get('selected');
          if (id === img.get('enc_image_uid')) {
            return img.merge({ selected: !selected });
          }
          return img;
        })
      );
    // 全选图片
    case SELECT_ALL_IMG:
      return state.update('images', imgList => imgList.map(img => img.merge({ selected: true })));

    // 更新图片list
    case UPDATE_IMG_LIST:
      const { ids, type, set_uid } = get(action, ['payload']);
      const sets = state.get('sets')?.toJS();
      const images = state.get('images')?.toJS();
      images.forEach((s, index) => {
        if (ids.includes(s.enc_image_uid)) {
          images[index].loading = type;
        }
      });
      sets.forEach((item, index) => {
        if (item.set_uid == set_uid) {
          sets[index].tabImages = images;
          sets[index].watermarkStatus = type;
        }
      });
      return state.merge({
        sets: fromJS(sets),
        images: fromJS(images),
      });
    // return state.update('images', images =>
    //   images.map(s => {
    //     const enc_image_uid = s.get('enc_image_uid');
    //     if (ids.includes(enc_image_uid)) {
    //       return s.merge({ loading: type });
    //     }
    //     return s;
    //   })
    // );

    // 更新图片状态
    case UPDATE_SELECTED_IAMGE:
      const { selectedIds, correct_status } = get(action, ['payload']);
      return state.update('images', images =>
        images.map(s => {
          if (selectedIds.includes(s.get('image_uid'))) {
            return s.merge({ correct_status });
          }
          return s;
        })
      );

    case RESORT_IMAGES:
      const { sortImageList } = get(action, ['payload']);
      return state.update('images', images => sortImageList);

    case RECOMMEND_IMAGES:
      const { uidList, recommend } = get(action, ['payload']);
      return state.update('images', images =>
        images.map(s => {
          if (uidList.includes(s.get('enc_image_uid'))) {
            return s.merge({ recommend: Number(recommend) });
          }
          return s;
        })
      );

    // 清除选中图片
    case CLEAR_SELECTION:
      return state.update('images', imgList => imgList.map(img => img.merge({ selected: false })));

    // 更新封面
    case UPDATE_COVER: {
      const obj = action.cover || {};
      console.log('obj:************** ', obj);
      return state.merge({
        cover: fromJS({ coverTimestamp: Date.now(), ...obj }),
      });
    }

    // 单个图片重命名
    case RENAME_IMG_NAME:
      const { enc_image_uid, image_name } = get(action, ['payload', 'data'], {});
      return state.update('images', imgList =>
        imgList.map(img => {
          if (img && img.get('enc_image_uid') === enc_image_uid) {
            return img.update('image_name', () => image_name);
          }
          return img;
        })
      );

    // set上传图片
    case UPLOAD_COMPLETE: {
      const {
        payload: { fields },
      } = action;
      const imageObj = fromJS(convertObjIn(fields));

      const convertState = state.update('sets', sets =>
        sets.map(set =>
          +set.get('set_uid') === +imageObj.get('set_uid')
            ? set.update('photo_count', () => +set.get('photo_count') + 1)
            : set
        )
      );

      return convertState.set('images', state.get('images').push(imageObj));
    }

    // 删除图片
    case DELETE_IMAGE: {
      const { image_uids = [], set_uid } = get(action, ['payload', 'data'], {});
      const sets = state.get('sets');

      let newState = state.update('images', imgList =>
        imgList.filter(img => !image_uids.includes(img.get('enc_image_uid')))
      );

      return newState.update('sets', () =>
        sets.map(set =>
          set.update('photo_count', () =>
            +set.get('set_uid') === +set_uid
              ? set.get('photo_count') - image_uids.length
              : set.get('photo_count')
          )
        )
      );
    }

    // 移动图片
    case MOVE_IMAGE: {
      const { currentSetUid, image_uids = [], set_uid } = get(action, ['payload', 'data'], {});
      let newState = state.update('images', imgList =>
        imgList.filter(img => !image_uids.includes(img.get('enc_image_uid')))
      );

      const convertState = newState.update('sets', sets =>
        sets.map(set => {
          if (+set.get('set_uid') === +currentSetUid) {
            return set.update('photo_count', () => +set.get('photo_count') - image_uids.length);
          } else if (+set.get('set_uid') === +set_uid) {
            return set.update('photo_count', () => +set.get('photo_count') + image_uids.length);
          }
          return set;
        })
      );

      return convertState;
    }

    // 复制图片
    case COPY_IMAGE: {
      const { new_image_uids = [], set_uid } = get(action, ['payload', 'data'], {});

      return state.update('sets', sets =>
        sets.map(set =>
          +set.get('set_uid') === +set_uid
            ? set.update('photo_count', () => +set.get('photo_count') + new_image_uids.length)
            : set
        )
      );
    }

    // 图片预览
    case SHOW_IMAGE_VIEWER:
      const imageViewerDefaultId = get(action, ['payload', 'imageViewerDefaultId'], '');
      return state.update('photos', photos =>
        photos.merge({ imageViewerDefaultId, isShownImageViewer: true })
      );
    // 取消图片预览
    case HIDE_IMAGE_VIEWER:
      return state.updateIn(['photos', 'isShownImageViewer'], () => false);
    // 更新水印列表
    case UPDATE_WATERMARK_LIST: {
      const data = get(action, ['payload', 'data'], []);
      const watermarkList = data.map(item => ({
        ...item,
        value: item.watermark_uid,
        label: item.watermark_name,
      }));
      return state.update('watermarkList', () => fromJS(watermarkList));
    }

    // 更新水印完成状态
    case UPDATE_WATERMARK_LOADING: {
      const data = action.payload.data;
      return state.update('watermarkLoading', () => fromJS(data));
    }
    // 应用水印
    case APPLY_WATERMARK: {
      const { data = {} } = action.payload;
      // 全部应用水印
      if (data.apply_all) {
        return state.update('images', imgList =>
          imgList.map(img => img.merge({ imgTimestamp: Date.now() }))
        );
      }
      // 选中图片应用水印
      if (data.image_uids && data.image_uids.length) {
        return state.update('images', imgList =>
          imgList.map(img => {
            if (data.image_uids.includes(img.get('enc_image_uid'))) {
              return img.merge({ imgTimestamp: Date.now() });
            }
            return img;
          })
        );
      }
      console.log('reducer-APPLY_WATERMARK', state.image);
      return state;
    }
    case UPDATE_COLLECTION_NAME_IN_DETAIL: {
      const { collection_name = '' } = action.payload;
      return state.update('collection_name', () => collection_name);
    }
    // 更新选中set_uid
    case CHANGE_CURRENT_SET_UID: {
      const id = get(action, ['payload', 'id']);
      return state.update('currentSetUid', () => id);
    }
    // setlist拖拽排序
    case ORDERING_SET: {
      const convertSets = get(action, ['payload', 'data']);
      return state.update('sets', () => convertSets);
    }
    // 进入详情、切换set加载loading
    case SET_DETAIL_CONTENT_LOADING: {
      const data = get(action, ['payload', 'loading']);

      return state.update('isShowContentLoading', () => data.loading);
    }
    default:
      return state;
  }
};

export default detail;
