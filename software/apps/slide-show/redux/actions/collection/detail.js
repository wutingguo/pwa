import { fromJS } from 'immutable';
import { get } from 'lodash';
import { wrapPromise } from '@resource/lib/utils/promise';
import { CALL_API } from '@resource/lib/middlewares/api';
import getDataFromState from '@apps/slide-show/utils/getDataFromState';
import request from '@apps/slide-show/utils/request';
import {
  SAAS_SLIDE_GET_PROJECT_DETAIL,
  SAAS_COLLECTION_RENAME_SET,
  SASS_GET_SET_PHOTO_LIST,
  SAAS_SET_COVER,
  SAAS_UPDATE_PHOTO_NAME,
  SAAS_DELETE_PHOTO_NAME,
  SAAS_GET_WATERMARK_LIST,
  SAAS_SAVE_SET_WATERMARK,
  SAAS_GET_COLLECTIONS_SETTINGS,
  SAAS_UPDATE_COLLECTIONS_SETTINGS,
  SAAS_CREATE_SET,
  SAAS_DELETE_SET,
  SAAS_MOVE_TO_SET,
  SAAS_COPY_TO_SET,
  SAAS_SET_ORDERING,
  SAAS_SLIDE_SET_THEME,
  SAAS_SLIDE_SET_COVER_IMAGE,
  GET_MUSIC_WAVEFORM_ARRAYBUFFER,
  SAAS_SLIDE_SET_PROJECT_SETTING
} from '@resource/lib/constants/apiUrl';
import {
  SHOW_IMAGE_NAME,
  CHANGE_SELECTION,
  SELECT_ALL_IMG,
  CLEAR_SELECTION,
  UPDATE_COVER,
  RENAME_IMG_NAME,
  DELETE_IMAGE,
  SHOW_IMAGE_VIEWER,
  HIDE_IMAGE_VIEWER,
  UPDATE_WATERMARK_LIST,
  APPLY_WATERMARK,
  RESET_COLLECTION_DETAIL,
  CHANGE_CURRENT_SET_UID,
  MOVE_IMAGE,
  COPY_IMAGE,
  ORDERING_SET,
  SET_DETAIL_CONTENT_LOADING,
  REPLACE_AUDIO,
  UPDATE_FRAMES,
  SET_THEME,
  DELETE_WAVEFORM,
  CHANGE_TRANSITION,
  UPDATE_AUDIO_REGION
} from '@apps/slide-show/constants/actionTypes';
import { GET_CLCT_DETAIL, DELETE_CLCT_SET_IMG } from '@resource/lib/constants/loadingType';
import getActionKey from '@apps/slide-show/utils/actionKey';
import { withAutoSaving } from '@resource/lib/redux-helper/action';
import { getPostCardDetail, setUsedPostCardDetail } from '../postcard';

/**
 * 获取详细信息
 */
const getCollectionDetail = project_id => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_SLIDE_GET_PROJECT_DETAIL,
            params: {
              galleryBaseUrl,
              project_id
            }
          },
          loadingType: GET_CLCT_DETAIL
        }
      }).then(res => {
        if (res && res.data && res.ret_code === 200000) {
          const visiting_card = get(res, 'data.visiting_card');
          if (visiting_card) {
            dispatch(getPostCardDetail(visiting_card, true));
          } else {
            dispatch(setUsedPostCardDetail({}));
          }
        }
        resolve(res);
      }, reject);
    });
  };
};

// 更新 set name
const renameCollectionSet = bodyParams => {
  return request({
    url: SAAS_COLLECTION_RENAME_SET,
    method: 'POST',
    bodyParams
  });
};

/**
 * 获取 set 图片列表
 */
const getSetPhotoList = (collectionUid, setUid) => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SASS_GET_SET_PHOTO_LIST,
            params: {
              galleryBaseUrl,
              setUid,
              collectionUid
            }
          }
        }
      }).then(resolve, reject);
    });
  };
};

/**
 * 是否显示图片
 * @param {boolean} isShowImgName
 */
const handleShowImgName = isShowImgName => {
  return {
    type: SHOW_IMAGE_NAME,
    payload: { isShowImgName }
  };
};

/**
 * 切换是否选中图片
 * @param {*} id 图片image_uid
 */
const changeSelectedImg = id => {
  return {
    type: getActionKey(CHANGE_SELECTION),
    payload: { id }
  };
};

// 全选图片
function handleSelectAllImg() {
  return {
    type: getActionKey(SELECT_ALL_IMG)
  };
}
// 清空选择的图片
function handleClearSelectImg(params) {
  return {
    type: getActionKey(CLEAR_SELECTION)
  };
}
// 设置封面
function setCover(bodyParams) {
  return request({
    url: SAAS_SET_COVER,
    method: 'POST',
    bodyParams
  });
}

// 更新封面
function updateCover(cover) {
  return withAutoSaving({
    type: UPDATE_COVER,
    cover
  });
}

// 修改图片名称请求
function renameImgName(bodyParams) {
  return request({
    url: SAAS_UPDATE_PHOTO_NAME,
    method: 'POST',
    bodyParams
  });
}
// 更新图片名称
function updateImgName(data) {
  return withAutoSaving({
    type: RENAME_IMG_NAME,
    payload: { data }
  });
}

// 发送删除图片请求
function deletePhotoRequest(bodyParams) {
  return request({
    url: SAAS_DELETE_PHOTO_NAME,
    method: 'POST',
    bodyParams,
    loadingType: DELETE_CLCT_SET_IMG
  });
}

// 删除后更新set中图片列表
function deteleFrames(data) {
  // return withAutoSaving({
  //   type: getActionKey(DELETE_IMAGE)
  // })
  return (dispatch, getState) => {
    dispatch({
      type: getActionKey(DELETE_IMAGE)
    });
    return Promise.resolve();
  };
}

// 预览图片
function showImageViewer(params) {
  return {
    type: SHOW_IMAGE_VIEWER
  };
}
// 隐藏图片
function hideImageViewer(params) {
  return {
    type: HIDE_IMAGE_VIEWER
  };
}
// 获取水印列表
function getWatermarkList() {
  return request({
    url: SAAS_GET_WATERMARK_LIST
  });
}
// 更新redux水印数据
function updateWatermarkList(data) {
  return {
    type: UPDATE_WATERMARK_LIST,
    payload: { data }
  };
}
// 设置水印
function setWatermark({ bodyParams, showLoading, hideLoading }) {
  return request({
    url: SAAS_SAVE_SET_WATERMARK,
    method: 'POST',
    bodyParams,
    showLoading,
    hideLoading
  });
}
// 应用水印
function applyWaterMark(data) {
  return withAutoSaving({
    type: APPLY_WATERMARK,
    payload: { data }
  });
}

// 获取 Settings 配置信息
const getCollectionsSettings = collectionUid => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_GET_COLLECTIONS_SETTINGS,
            params: {
              galleryBaseUrl,
              collectionUid
            }
          }
        }
      }).then(resolve, reject);
    });
  };
};

// 更新 Settings 配置信息
const updateCollectionsSettings = body => {
  return (dispatch, getState) => {
    const { galleryBaseUrl } = getDataFromState(getState());
    return wrapPromise((resolve, reject) => {
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_UPDATE_COLLECTIONS_SETTINGS,
            params: {
              galleryBaseUrl
            }
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(body)
          }
        }
      }).then(resolve, reject);
    });
  };
};

const resetDetail = () => {
  return {
    type: RESET_COLLECTION_DETAIL
  };
};

/**
 * 新增 set
 */
const createSet = (collection_uid, set_name) => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_CREATE_SET,
            params: {
              galleryBaseUrl
            }
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({
              collection_uid,
              set_name
            })
          }
        }
      }).then(resolve, reject);
    });
  };
};

/**
 * 删除 set
 */
const deleteSet = set_uid => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_DELETE_SET,
            params: {
              galleryBaseUrl
            }
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({
              set_uid
            })
          }
        }
      }).then(resolve, reject);
    });
  };
};

/**
 * 切换选中set的set_uid
 * @param {*} id set_uid
 */
const changeSelectedSet = id => {
  return {
    type: CHANGE_CURRENT_SET_UID,
    payload: { id: String(id) }
  };
};

/**
 * 进入详情、切换set加载loading
 * @param {*} loading
 */
const setDetailContentLoading = loading => {
  return {
    type: SET_DETAIL_CONTENT_LOADING,
    payload: { loading }
  };
};

/**
 * 移动图片到set
 */
const moveToSet = (image_uids, set_uid) => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_MOVE_TO_SET,
            params: {
              galleryBaseUrl
            }
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({
              image_uids,
              set_uid
            })
          }
        }
      }).then(resolve, reject);
    });
  };
};

// 移动后更新set中图片列表
function updateImgListAndSetAfterMove(data) {
  return withAutoSaving({
    type: MOVE_IMAGE,
    payload: { data }
  });
}

/**
 * 复制图片到set
 */
const copyToSet = (image_uids, set_uid) => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_COPY_TO_SET,
            params: {
              galleryBaseUrl
            }
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({
              image_uids,
              set_uid
            })
          }
        }
      }).then(resolve, reject);
    });
  };
};

// 复制后更新set中图片列表
function updateImgListAndSetAfterCopy(data) {
  return withAutoSaving({
    type: COPY_IMAGE,
    payload: { data }
  });
}

/**
 * set 排序
 */
function orderingSet(set_uids) {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_SET_ORDERING,
            params: {
              galleryBaseUrl
            }
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({
              set_uids
            })
          }
        }
      }).then(resolve, reject);
    });
  };
}

// 复制后更新set中图片列表
function updateSetListOrder(data) {
  console.log('data: ', data);
  return {
    type: ORDERING_SET,
    payload: { data }
  };
}

/**
 * 替换audio
 * @param {Object} payload
 */
function replaceAudio(payload) {
  // return withAutoSaving({
  //   type: getActionKey(REPLACE_AUDIO),
  //   payload
  // });

  return (dispatch, getState) => {
    dispatch({
      type: getActionKey(REPLACE_AUDIO),
      payload
    });
    return Promise.resolve();
  };
}
/**
 * 排序后替换 frames
 * @param {Object} payload
 */
function updateFrames(payload) {
  // return withAutoSaving({
  //   type: getActionKey(UPDATE_FRAMES),
  //   payload
  // });

  return {
    type: getActionKey(UPDATE_FRAMES),
    payload
  };
}

/**
 * 更新
 * @param {*} payload
 * @returns
 */
function updateWaveformRegions(payload) {
  return {
    type: getActionKey(UPDATE_AUDIO_REGION),
    payload
  };
}

/**
 * 对frames重新排序.
 * @param {string} dragGuid 当前拖拽的frame的id
 * @param {string} dropGuid 目标区域的frame的id.
 */
const resortFrames = payload => {
  return (dispatch, getState) => {
    const { frames, dragGuid, dropGuid } = payload;
    if (!dragGuid || !dropGuid || !frames || !frames.size) {
      return;
    }

    if (dragGuid === dropGuid) {
      return Promise.resolve();
    }

    const dragIndex = frames.findIndex(v => v.get('guid') === dragGuid);
    if (dragIndex === -1) {
      return;
    }

    const isSelected = frames.getIn([String(dragIndex), 'selected']);
    let newFrames = frames;

    // 1. 如果被拖拽的frame不是选中状态, 那么只交换当前选中的frame.
    // 2. 如果被拖拽的frame是选中状态. 那么所有选中的frames都要交换位置.
    if (isSelected) {
      const selectedFrames = newFrames.filter(v => v.get('selected'));

      // 如果目标frame也是选中状态, 那么就跳过.
      const isDropOnSelected = selectedFrames.findIndex(v => v.get('guid') === dropGuid) !== -1;
      if (isDropOnSelected) {
        return;
      }

      // 从未选中的列表中, 找出目标frame的index, 把所有选中的frame插入到当前的位置.
      const unselectedFrames = newFrames.filter(v => !v.get('selected'));
      const dropIndex = unselectedFrames.findIndex(v => v.get('guid') === dropGuid);
      if (dropIndex !== -1) {
        newFrames = unselectedFrames;
        const len = selectedFrames.size;

        if (len === 1) {
          newFrames = newFrames.insert(dropIndex, selectedFrames.get(0));
        } else {
          // 循环插入到列表中.
          for (let i = len - 1; i >= 0; i--) {
            newFrames = newFrames.insert(dropIndex, selectedFrames.get(i));
          }
        }
      }
    } else {
      const dragItem = newFrames.get(dragIndex);
      newFrames = newFrames.delete(dragIndex);

      const dropIndex = newFrames.findIndex(v => v.get('guid') === dropGuid);
      if (dropIndex !== -1) {
        newFrames = newFrames.insert(dropIndex, dragItem);
      }
    }

    dispatch(updateFrames({ frames: newFrames }));

    return Promise.resolve();
  };
};

/**
 * 移动图片到set
 */
const setTheme = payload => {
  // return {
  //   type: getActionKey(SET_THEME),
  //   payload
  // };
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_SLIDE_SET_THEME,
            params: {
              galleryBaseUrl
            }
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({
              project_id: payload.project_id,
              theme_id: payload.theme.id
            })
          }
        }
      }).then(resolve, reject);
    });
  };
};

/**
 * 移动图片到set
 */
const setCoverImage = payload => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_SLIDE_SET_COVER_IMAGE,
            params: {
              galleryBaseUrl
            }
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({
              project_id: payload.project_id,
              image_id: payload.coverImg.get('id')
            })
          }
        }
      }).then(resolve, reject);
    });
  };
};

const deleteWaveform = encId => {
  return withAutoSaving({
    type: getActionKey(DELETE_WAVEFORM),
    payload: { encId }
  });
};

function changeTransition(payload) {
  // return withAutoSaving({
  //   type: getActionKey(CHANGE_TRANSITION),
  //   payload
  // });

  return (dispatch, getState) => {
    dispatch({
      type: getActionKey(CHANGE_TRANSITION),
      payload
    });
    return Promise.resolve();
  };
}

const getMusicWaveformArrayBuffer = musicEncId => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: GET_MUSIC_WAVEFORM_ARRAYBUFFER,
            params: {
              galleryBaseUrl,
              musicEncId
            }
          }
        }
      }).then(resolve, reject);
    });
  };
};

const changeProjectSetting = payload => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_SLIDE_SET_PROJECT_SETTING,
            params: {
              galleryBaseUrl
            }
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(payload)
          }
        }
      }).then(resolve, reject);
    });
  };
};

export default {
  resetDetail,
  getCollectionDetail,
  renameCollectionSet,
  getSetPhotoList,
  handleShowImgName,
  changeSelectedImg,
  handleSelectAllImg,
  handleClearSelectImg,
  setCover,
  updateCover,
  renameImgName,
  updateImgName,
  deletePhotoRequest,
  deteleFrames,
  showImageViewer,
  hideImageViewer,
  getWatermarkList,
  updateWatermarkList,
  setWatermark,
  applyWaterMark,

  getCollectionsSettings,
  updateCollectionsSettings,

  createSet,
  deleteSet,
  changeSelectedSet,
  moveToSet,
  copyToSet,
  updateImgListAndSetAfterMove,
  updateImgListAndSetAfterCopy,
  orderingSet,
  updateSetListOrder,
  setDetailContentLoading,

  replaceAudio,
  updateFrames,
  resortFrames,
  setTheme,
  setCoverImage,

  deleteWaveform,
  changeTransition,
  getMusicWaveformArrayBuffer,
  updateWaveformRegions,
  changeProjectSetting
};
