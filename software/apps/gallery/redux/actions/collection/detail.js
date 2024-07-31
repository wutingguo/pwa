import { template } from 'lodash';

import { wrapPromise } from '@resource/lib/utils/promise';

import {
  COUNT_FRESH_IMAGES,
  DELETE_PRESET,
  DELETE_SET_VIDEO_BY_ID,
  GET_COLLECTION_GROUP_INFO,
  GET_OLD_PACKAGE_URL,
  GET_PFC_TOPIC_EFFECTS,
  GET_PORTFOLIO_CONFIG,
  GET_PRESET_LIST,
  GET_SET_SLIDESHOW_LIST,
  GET_SET_VIDEO_BY_SET,
  PRESET_SETTING_UPDATE,
  RENAME_PRESET,
  SAAS_CLIENT_SLIDESHOW_PREVIEW_GET_DETAIL,
  SAAS_COLLECTION_RENAME_SET,
  SAAS_COPY_TO_SET,
  SAAS_CREATE_SET,
  SAAS_DELETE_PHOTO_NAME,
  SAAS_DELETE_SET,
  SAAS_GALLARY_COLLECTION_UPLOAD_AI,
  SAAS_GALLARY_COLLECTION_UPLOAD_LIVE,
  SAAS_GALLARY_IMAGES_MOVE,
  SAAS_GALLARY_IMAGES_RECOMMEND,
  SAAS_GALLERY_BATCH_CORRECT_IMAGE,
  SAAS_GALLERY_STATUS_POLLING,
  SAAS_GET_COLLECTIONS_SETTINGS,
  SAAS_GET_COLLECTION_DETAIL,
  SAAS_GET_WATERMARK_LIST,
  SAAS_MOVE_TO_SET,
  SAAS_POST_WATERMARK_CREATE,
  SAAS_POST_WATERMARK_DELETE,
  SAAS_POST_WATERMARK_UPDATE,
  SAAS_SAVE_SET_WATERMARK,
  SAAS_SET_COVER,
  SAAS_SET_ORDERING,
  SAAS_SLIDE_GET_SHARE_URL,
  SAAS_UPDATE_COLLECTIONS_SETTINGS,
  SAAS_UPDATE_PHOTO_NAME,
  SASS_GET_SET_PHOTO_LIST,
  SAVE_PORTFOLIO_CONFIG,
  SAVE_SET_SLIDESHOW_VIDEO,
  START_IMAGE_GROUP,
} from '@resource/lib/constants/apiUrl';
import { DELETE_CLCT_SET_IMG, GET_CLCT_DETAIL } from '@resource/lib/constants/loadingType';

import { CALL_API } from '@resource/lib/middlewares/api';

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
  SELECTION_VIDEO,
  SELECT_ALL_IMG,
  SET_DETAIL_CONTENT_LOADING,
  SHOW_IMAGE_NAME,
  SHOW_IMAGE_VIEWER,
  UPDATE_COVER,
  UPDATE_IMG_LIST,
  UPDATE_SELECTED_IAMGE,
  UPDATE_WATERMARK_LIST,
  UPDATE_WATERMARK_LOADING,
} from '@apps/gallery/constants/actionTypes';
import getDataFromState from '@apps/gallery/utils/getDataFromState';
import request from '@apps/gallery/utils/request';

// gallery 导出前的校验
const getOldPackageUrl = ({ collection_id, galleryBaseUrl, collection_favorite_id }) => {
  const url = template(GET_OLD_PACKAGE_URL)({
    collection_favorite_id,
    collection_id,
    galleryBaseUrl,
  });
  return request({
    url,
  });
};

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
              collection_uid,
            },
          },
          loadingType: GET_CLCT_DETAIL,
        },
      }).then(resolve, reject);
    });
  };
};

// 更新 set name
const renameCollectionSet = bodyParams => {
  return request({
    url: SAAS_COLLECTION_RENAME_SET,
    method: 'POST',
    bodyParams,
  });
};

const getPresetList = ({ customer_id, galleryBaseUrl }) => {
  const url = template(GET_PRESET_LIST)({
    customer_id,
    galleryBaseUrl,
  });
  return request({
    url,
  });
};

const deletePreset = ({ template_id, galleryBaseUrl }) => {
  const url = template(DELETE_PRESET)({
    template_id,
    galleryBaseUrl,
  });
  return request({
    url,
  });
};

const renamePreset = ({ bodyParams, galleryBaseUrl }) => {
  const url = template(RENAME_PRESET)({
    galleryBaseUrl,
  });
  return request({
    url,
    method: 'POST',
    bodyParams,
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
              collectionUid,
            },
          },
        },
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
    payload: { isShowImgName },
  };
};

/**
 * 切换是否选中图片
 * @param {*} id 图片image_uid
 */
const changeSelectedImg = id => {
  return {
    type: CHANGE_SELECTION,
    payload: { id },
  };
};

// 全选图片
function handleSelectAllImg() {
  return {
    type: SELECT_ALL_IMG,
  };
}
// 清空选择的图片
function handleClearSelectImg(params) {
  return {
    type: CLEAR_SELECTION,
  };
}
// 设置封面
function setCover(bodyParams) {
  return request({
    url: SAAS_SET_COVER,
    method: 'POST',
    bodyParams,
  });
}

/**
 * 更新图片状态
 * @param {*} id 图片image_uid
 */
const updateSelectedImgStatus = (selectedIds, correct_status) => {
  return {
    type: UPDATE_SELECTED_IAMGE,
    payload: { selectedIds, correct_status },
  };
};

// 更新封面
function updateCover(cover) {
  return {
    type: UPDATE_COVER,
    cover,
  };
}

// 修改图片名称请求
function renameImgName(bodyParams) {
  return request({
    url: SAAS_UPDATE_PHOTO_NAME,
    method: 'POST',
    bodyParams,
  });
}
// 更新图片名称
function updateImgName(data) {
  return {
    type: RENAME_IMG_NAME,
    payload: { data },
  };
}

// 发送删除图片请求
function deletePhotoRequest(bodyParams) {
  return request({
    url: SAAS_DELETE_PHOTO_NAME,
    method: 'POST',
    bodyParams,
    loadingType: DELETE_CLCT_SET_IMG,
  });
}

// 删除后更新set中图片列表
function updateImgListAfterDelte(data) {
  return {
    type: DELETE_IMAGE,
    payload: { data },
  };
}

// 更新set中图片列表
function updateImgList(selectedIds, type, set_uid) {
  return {
    type: UPDATE_IMG_LIST,
    payload: { ids: selectedIds, type, set_uid },
  };
}
// 预览图片
function showImageViewer(params) {
  return {
    type: SHOW_IMAGE_VIEWER,
    payload: { ...params },
  };
}
// 隐藏图片
function hideImageViewer(params) {
  return {
    type: HIDE_IMAGE_VIEWER,
  };
}
// 获取水印列表
function getWatermarkList() {
  return request({
    url: SAAS_GET_WATERMARK_LIST,
    isConvert: false,
  });
}
// 更新redux水印数据
function updateWatermarkList(data) {
  return {
    type: UPDATE_WATERMARK_LIST,
    payload: { data },
  };
}

// 更新redux水印数据
function updateWatermarkLoading(data) {
  return {
    type: UPDATE_WATERMARK_LOADING,
    payload: { data },
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
              galleryBaseUrl,
            },
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(body),
          },
        },
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
              galleryBaseUrl,
            },
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({ watermark_id, ...req }),
          },
        },
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
              galleryBaseUrl,
            },
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({ watermark_id }),
          },
        },
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
    // showLoading,
    // hideLoading
  });
}
// 应用水印
function applyWaterMark(data) {
  return {
    type: APPLY_WATERMARK,
    payload: { data },
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
              collectionUid,
            },
          },
        },
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
              galleryBaseUrl,
            },
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(body),
          },
        },
      }).then(resolve, reject);
    });
  };
};

const resetDetail = () => {
  return {
    type: RESET_COLLECTION_DETAIL,
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
              galleryBaseUrl,
            },
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
              collection_uid,
              set_name,
            }),
          },
        },
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
              galleryBaseUrl,
            },
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
              set_uid,
            }),
          },
        },
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
    payload: { id: String(id) },
  };
};

/**
 * 进入详情、切换set加载loading
 * @param {*} loading
 */
const setDetailContentLoading = loading => {
  return {
    type: SET_DETAIL_CONTENT_LOADING,
    payload: { loading },
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
    hideLoading: hideGlobalLoading,
  });
};

// 移动后更新set中图片列表
function updateImgListAndSetAfterMove(data) {
  return {
    type: MOVE_IMAGE,
    payload: { data },
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
    hideLoading: hideGlobalLoading,
  });
};

// 复制后更新set中图片列表
function updateImgListAndSetAfterCopy(data) {
  return {
    type: COPY_IMAGE,
    payload: { data },
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
              galleryBaseUrl,
            },
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
              set_uids,
            }),
          },
        },
      }).then(resolve, reject);
    });
  };
}

// 复制后更新set中图片列表
function updateSetListOrder(data) {
  return {
    type: ORDERING_SET,
    payload: { data },
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
              galleryBaseUrl,
            },
          },
        },
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
              galleryBaseUrl,
            },
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(params),
          },
        },
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
              galleryBaseUrl,
            },
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(params),
          },
        },
      }).then(resolve, reject);
    });
  };
};
const postLiveCollectionUpload = params => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_GALLARY_COLLECTION_UPLOAD_LIVE,
            params: {
              galleryBaseUrl,
            },
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(params),
          },
        },
      }).then(resolve, reject);
    });
  };
};

// 图片排序
function resortImages(sortImageList) {
  return {
    type: RESORT_IMAGES,
    payload: { sortImageList },
  };
}
const postResortImages = image_uids => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_GALLARY_IMAGES_MOVE,
            params: {
              galleryBaseUrl,
            },
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
              image_uids,
            }),
          },
        },
      }).then(resolve, reject);
    });
  };
};

// 图片加推荐
function recommendImages(uidList, recommend) {
  return {
    type: RECOMMEND_IMAGES,
    payload: { uidList, recommend },
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
              galleryBaseUrl,
            },
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
              image_uids: uidList,
              recommend,
            }),
          },
        },
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
              ...params,
            },
          },
        },
      }).then(res => {
        if (res && res.data) {
          resolve(res.data);
        }
      });
    });
  };
};

const getSmartShardingStatus = enc_collection_id => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: GET_COLLECTION_GROUP_INFO,
            params: {
              galleryBaseUrl,
              enc_collection_id,
            },
          },
        },
      })
        .then(res => {
          resolve(res);
        })
        .catch(res => {
          reject(res);
        });
    });
  };
};
const getCountFreshImages = enc_collection_id => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: COUNT_FRESH_IMAGES,
            params: {
              galleryBaseUrl,
              enc_collection_id,
            },
          },
        },
      })
        .then(res => {
          if (res && res.data) {
            resolve(res.data);
          }
        })
        .catch(res => {
          reject(res);
        });
    });
  };
};
const startSmartSharding = enc_collection_id => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: START_IMAGE_GROUP,
            params: {
              galleryBaseUrl,
            },
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
              enc_collection_id,
            }),
          },
        },
      })
        .then(res => {
          resolve(res);
        })
        .catch(res => {
          reject(res);
        });
    });
  };
};
const handleSelectionVideo = () => {
  return {
    type: SELECTION_VIDEO,
  };
};

// 获取portfolioConfig信息;
const getPortfolioConfig = ({ customer_id, galleryBaseUrl }) => {
  const url = template(GET_PORTFOLIO_CONFIG)({
    customer_id,
    galleryBaseUrl,
  });
  return request({
    url,
  });
};

const savePortfolioConfig = ({ bodyParams, galleryBaseUrl }) => {
  const url = template(SAVE_PORTFOLIO_CONFIG)({
    galleryBaseUrl,
  });
  return request({
    url,
    method: 'POST',
    bodyParams,
  });
};
const getSetVideoInfo = ({ collection_set_id }) => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: GET_SET_VIDEO_BY_SET,
            params: {
              galleryBaseUrl,
              collection_set_id,
            },
          },
        },
      }).then(res => {
        if (res && res.data) {
          resolve(res.data);
        }
      });
    });
  };
};
const deleteSetVideoInfo = body => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: DELETE_SET_VIDEO_BY_ID,
            params: {
              galleryBaseUrl,
            },
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(body),
          },
        },
      }).then(res => {
        resolve(res);
      });
    });
  };
};
const getSetSlideshowList = () => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { baseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: GET_SET_SLIDESHOW_LIST,
            params: {
              baseUrl,
              project_status: 2,
            },
          },
        },
      }).then(res => {
        if (res && res.data) {
          resolve(res.data);
        }
      });
    });
  };
};
const saveSetSlideshowVideo = body => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { baseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAVE_SET_SLIDESHOW_VIDEO,
            params: {
              baseUrl,
            },
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(body),
          },
        },
      }).then(res => {
        resolve(res);
      });
    });
  };
};
/**
 * 获取slideshow分享链接
 * @param {*} slideshowUid
 */
const getSlideshowShareUrl = slideshowUid => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      // console.log("galleryBaseUrl...",galleryBaseUrl)
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_SLIDE_GET_SHARE_URL,
            params: {
              galleryBaseUrl,
              project_id: slideshowUid,
            },
          },
        },
      })
        .then(res => {
          const { ret_code, data } = res;
          if (ret_code === 200000) {
            resolve(res);
          } else {
            reject(res);
          }
        })
        .catch(err => reject(err));
    });
  };
};
const getSlideshowInfo = video_id => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl, qs } = getDataFromState(getState());
      const project_id = video_id;

      if (!project_id) {
        return reject('project_id is required');
      }

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_CLIENT_SLIDESHOW_PREVIEW_GET_DETAIL,
            params: {
              galleryBaseUrl,
              project_id,
              customer_uid: '',
              share_uid: '',
              autoRandomNum: Date.now(),
            },
          },
        },
      }).then(res => {
        if (res && res.data && res.ret_code === 200000) {
          resolve(res);
        }
      }, reject);
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
  updateWatermarkLoading,
  updateImgList,
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
  postLiveCollectionUpload,
  getCollectionStatusPolling,
  updateSelectedImgStatus,
  resortImages,
  postResortImages,
  recommendImages,
  postRecommendImages,
  creatWatermark,
  udateWatermark,
  deleteWatermark,
  getOldPackageUrl,
  getPresetList,
  deletePreset,
  renamePreset,
  getSmartShardingStatus,
  startSmartSharding,
  getCountFreshImages,
  handleSelectionVideo,
  getPortfolioConfig,
  savePortfolioConfig,
  getSetVideoInfo,
  deleteSetVideoInfo,
  getSetSlideshowList,
  saveSetSlideshowVideo,
  getSlideshowShareUrl,
  getSlideshowInfo,
};
