import { get } from 'lodash';
import { CALL_API } from '@resource/lib/middlewares/api';

import {
  SAAS_SLIDE_GET_PROJECT_LIST,
  SAAS_SLIDE_CREATE_PROJECT,
  SAAS_SLIDE_SAVE_PROJECT,
  SAAS_SLIDE_MODIFY_PROJECT,
  SAAS_SLIDE_DELETE_PROJECT,
  SAAS_SLIDE_COPY_PROJECT,
  SAAS_SLIDE_GET_SHARE_URL,
  SAAS_SLIDE_GET_RESOLUTION_OPTIONS,
  SAAS_SLIDE_PUBLISH,
  SAAS_SLIDE_REVERT,
  SAAS_SLIDE_GET_DOWNLOAD_URL,
  SAAS_SLIDE_GET_VIDEO_STATUS
} from '@resource/lib/constants/apiUrl';

import { wrapPromise } from '@resource/lib/utils/promise';
import getDataFromState from '@apps/slide-show/utils/getDataFromState';

/**
 * 获取 slideshow 列表
 */
const getSlideshowList = () => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_SLIDE_GET_PROJECT_LIST,
            params: {
              galleryBaseUrl
            }
          }
        }
      }).then(resolve, reject);
    });
  };
};

/**
 * 创建 slideshow
 */
const createSlideshow = slideshowName => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_SLIDE_CREATE_PROJECT,
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
              slides_name: slideshowName
            })
          }
        }
      }).then(resolve, reject);
    });
  };
};

/**
 * 将项目格式化成可以保存的数据结构.
 * @param {*} project
 */
const formatSlidshowBody = project => {
  const detail = get(project, 'collection.detail');
  if (!detail) {
    return {};
  }

  return detail.toJS();
};

/**
 * 创建 slideshow
 */
export const saveSlideshow = () => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl, slideshow } = getDataFromState(getState());

      const body = formatSlidshowBody(slideshow);
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_SLIDE_SAVE_PROJECT,
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

/**
 * 发布 slideshow
 */
export const publishSlideshow = project_id => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_SLIDE_PUBLISH,
            params: {
              galleryBaseUrl
            }
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({ project_id })
          }
        }
      }).then(resolve, reject);
    });
  };
};

/**
 * 回滚 slideshow
 */
export const revertSlideshow = project_id => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_SLIDE_REVERT,
            params: {
              galleryBaseUrl
            }
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({ project_id })
          }
        }
      }).then(resolve, reject);
    });
  };
};

/**
 * 更新 collection
 */
const updateSlideshow = (slideshowUid, slideshowName) => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_SLIDE_MODIFY_PROJECT,
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
              project_id: slideshowUid,
              slides_name: slideshowName
            })
          }
        }
      }).then(resolve, reject);
    });
  };
};

/**
 * 删除 slideshow
 */
const deleteSlideshow = slideshowUid => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_SLIDE_DELETE_PROJECT,
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
              project_id: slideshowUid
            })
          }
        }
      }).then(resolve, reject);
    });
  };
};

/**
 * 复制 slideshow
 */
const copySlideshow = (slideshowUid, slideshowName) => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_SLIDE_COPY_PROJECT,
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
              project_id: slideshowUid,
              slides_name: slideshowName
            })
          }
        }
      }).then(resolve, reject);
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
              project_id: slideshowUid
            }
          }
        }
      }).then(res => {
        const { ret_code, data } = res;
        if (ret_code === 200000) {
          resolve(res);
        } else {
          reject(res)
        }
      }).catch(err => reject(err))
    });
  };
};

/**
 * 获取视频清晰度
 */
const getResolutionOptions = () => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_SLIDE_GET_RESOLUTION_OPTIONS,
            params: {
              galleryBaseUrl
            }
          }
        }
      }).then(resolve, reject);
    });
  };
};

// 获取project所有视频清晰度对应的生成状态， 0：待生成、1：生成中、2：已生成、4：生成失败(新增状态)
const getResolutionStatus = data => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_SLIDE_GET_VIDEO_STATUS,
            params: {
              galleryBaseUrl,
              ...data
            }
          }
        }
      }).then(resolve, reject);
    });
  };
};

/**
 * 获取视频下载链接
 * @param {*} projectId
 * @param {*} definition
 */
const getSlideshowDownloadUrl = (projectId, definition, regenerate = false) => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_SLIDE_GET_DOWNLOAD_URL,
            params: {
              galleryBaseUrl,
              projectId,
              definition,
              regenerate
            }
          }
        }
      }).then(resolve, reject);
    });
  };
};

export default {
  getSlideshowList,
  createSlideshow,
  saveSlideshow,
  publishSlideshow,
  revertSlideshow,
  updateSlideshow,
  deleteSlideshow,
  copySlideshow,
  getSlideshowShareUrl,
  getResolutionOptions,
  getSlideshowDownloadUrl,
  getResolutionStatus
};
