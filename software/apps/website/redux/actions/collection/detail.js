import { wrapPromise } from '@resource/lib/utils/promise';
import { CALL_API } from '@resource/lib/middlewares/api';
import getDataFromState from '@apps/gallery/utils/getDataFromState';
import request from '@apps/gallery/utils/request';
import {
  SAAS_GET_COLLECTION_DETAIL,
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
  GET_PFC_TOPIC_EFFECTS,
  SAAS_GALLARY_COLLECTION_UPLOAD_AI,
  SAAS_GALLERY_BATCH_CORRECT_IMAGE,
  SAAS_GALLERY_STATUS_POLLING,
  SAAS_GALLARY_IMAGES_MOVE,
  SAAS_GALLARY_IMAGES_RECOMMEND,
  SAAS_POST_WATERMARK_CREATE,
  SAAS_POST_WATERMARK_UPDATE,
  SAAS_POST_WATERMARK_DELETE
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
  UPDATE_SELECTED_IAMGE,
  RESORT_IMAGES,
  RECOMMEND_IMAGES
} from '@apps/gallery/constants/actionTypes';
import { GET_CLCT_DETAIL, DELETE_CLCT_SET_IMG } from '@resource/lib/constants/loadingType';

/**
 * 获取详细信息
 */
const getCollectionDetail = collection_uid => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_GET_COLLECTION_DETAIL,
            params: {
              galleryBaseUrl,
              collection_uid
            }
          },
          loadingType: GET_CLCT_DETAIL
        }
      }).then(resolve, reject);
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
    type: CHANGE_SELECTION,
    payload: { id }
  };
};

// 全选图片
function handleSelectAllImg() {
  return {
    type: SELECT_ALL_IMG
  };
}
// 清空选择的图片
function handleClearSelectImg(params) {
  return {
    type: CLEAR_SELECTION
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

/**
 * 更新图片状态
 * @param {*} id 图片image_uid
 */
const updateSelectedImgStatus = (selectedIds, correct_status) => {
  return {
    type: UPDATE_SELECTED_IAMGE,
    payload: { selectedIds, correct_status }
  };
};

// 更新封面
function updateCover(cover) {
  return {
    type: UPDATE_COVER,
    cover
  };
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
  return {
    type: RENAME_IMG_NAME,
    payload: { data }
  };
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
function updateImgListAfterDelte(data) {
  return {
    type: DELETE_IMAGE,
    payload: { data }
  };
}
// 预览图片
function showImageViewer(params) {
  return {
    type: SHOW_IMAGE_VIEWER,
    payload: { ...params }
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
    url: SAAS_GET_WATERMARK_LIST,
    isConvert: false
  });
}
// 更新redux水印数据
function updateWatermarkList(data) {
  return {
    type: UPDATE_WATERMARK_LIST,
    payload: { data }
  };
}

//创建水印
const creatWatermark = body => {
  return (dispatch, getState) => {
    const { galleryBaseUrl } = getDataFromState(getState());
    return wrapPromise((resolve, reject) => {
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_POST_WATERMARK_CREATE,
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
const udateWatermark = params => {
  const { watermark_uid: watermark_id, ...req } = params;
  return (dispatch, getState) => {
    const { galleryBaseUrl } = getDataFromState(getState());
    return wrapPromise((resolve, reject) => {
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_POST_WATERMARK_UPDATE,
            params: {
              galleryBaseUrl
            }
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({ watermark_id, ...req })
          }
        }
      }).then(resolve, reject);
    });
  };
};
const deleteWatermark = params => {
  const { watermark_uid: watermark_id } = params;
  return (dispatch, getState) => {
    const { galleryBaseUrl } = getDataFromState(getState());
    return wrapPromise((resolve, reject) => {
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_POST_WATERMARK_DELETE,
            params: {
              galleryBaseUrl
            }
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({ watermark_id })
          }
        }
      }).then(resolve, reject);
    });
  };
};

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
  return {
    type: APPLY_WATERMARK,
    payload: { data }
  };
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
const moveToSet = (image_uids, set_uid, showGlobalLoading, hideGlobalLoading) => {
  return request({
    url: SAAS_MOVE_TO_SET,
    method: 'POST',
    bodyParams: { image_uids, set_uid },
    showLoading: showGlobalLoading,
    hideLoading: hideGlobalLoading
  });
};

// 移动后更新set中图片列表
function updateImgListAndSetAfterMove(data) {
  return {
    type: MOVE_IMAGE,
    payload: { data }
  };
}

/**
 * 复制图片到set
 */
const copyToSet = (image_uids, set_uid, showGlobalLoading, hideGlobalLoading) => {
  return request({
    url: SAAS_COPY_TO_SET,
    method: 'POST',
    bodyParams: { image_uids, set_uid },
    showLoading: showGlobalLoading,
    hideLoading: hideGlobalLoading
  });
};

// 复制后更新set中图片列表
function updateImgListAndSetAfterCopy(data) {
  return {
    type: COPY_IMAGE,
    payload: { data }
  };
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
  return {
    type: ORDERING_SET,
    payload: { data }
  };
}

const getAiPfcTopicEffects = () => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: GET_PFC_TOPIC_EFFECTS,
            params: {
              galleryBaseUrl
            }
          }
        }
      }).then(res => {
        if (res && res.data) {
          resolve(res.data);
        }
      });
    });
  };
};

const postAiCollectionStart = params => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_GALLERY_BATCH_CORRECT_IMAGE,
            params: {
              galleryBaseUrl
            }
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(params)
          }
        }
      }).then(resolve, reject);
    });
  };
};

const postAiCollectionUpload = params => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_GALLARY_COLLECTION_UPLOAD_AI,
            params: {
              galleryBaseUrl
            }
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(params)
          }
        }
      }).then(resolve, reject);
    });
  };
};

// 图片排序
function resortImages(sortImageList) {
  return {
    type: RESORT_IMAGES,
    payload: { sortImageList }
  };
}
const postResortImages = move_image_uids => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_GALLARY_IMAGES_MOVE,
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
              move_image_uids
            })
          }
        }
      }).then(resolve, reject);
    });
  };
};

// 图片加推荐
function recommendImages(uidList, recommend) {
  return {
    type: RECOMMEND_IMAGES,
    payload: { uidList, recommend }
  };
}
const postRecommendImages = (uidList, recommend) => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_GALLARY_IMAGES_RECOMMEND,
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
              image_uids: uidList,
              recommend
            })
          }
        }
      }).then(resolve, reject);
    });
  };
};

const getCollectionStatusPolling = params => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_GALLERY_STATUS_POLLING,
            params: {
              galleryBaseUrl,
              ...params
            }
          }
        }
      }).then(res => {
        if (res && res.data) {
          resolve(res.data);
        }
      });
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
  updateImgListAfterDelte,
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
  getAiPfcTopicEffects,
  postAiCollectionStart,
  postAiCollectionUpload,
  getCollectionStatusPolling,
  updateSelectedImgStatus,
  resortImages,
  postResortImages,
  recommendImages,
  postRecommendImages,
  creatWatermark,
  udateWatermark,
  deleteWatermark
};
