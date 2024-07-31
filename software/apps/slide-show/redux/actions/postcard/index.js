import { wrapPromise } from '@resource/lib/utils/promise';
import { CALL_API } from '@resource/lib/middlewares/api';
import getDataFromState from '@apps/slide-show/utils/getDataFromState';
import {
  SAAS_SLIDE_SHOW_UPLOAD_POST_CARD,
  GET_POST_CARD_LIST,
  GET_DETAIL_POST_CARD,
  DELETE_POST_CARD,
  ADD_POST_CARD,
  SET_POST_CARD,
  EDIT_POST_CARD
} from '@resource/lib/constants/apiUrl';
import { CHANGE_POST_CARD_DETAIL, SET_POST_CARD_DETAIL } from '@resource/lib/constants/actionTypes';

import { createImageFormData } from '@resource/websiteCommon/utils/uploadHelper';


const uploadFile = (file, name) => {

  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      const formData = createImageFormData({
        file
      });
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_SLIDE_SHOW_UPLOAD_POST_CARD,
            params: {
              name,
              galleryBaseUrl
            }
          },
          options: {
            method: 'POST',
            body: formData
          }
        }
      }).then(resolve, reject)
    });
  }
};


const getPostCardList = () => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { baseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: GET_POST_CARD_LIST,
            params: {
              baseUrl
            }
          }
        }
      }).then(resolve, reject);
    });
  };
};

export const getPostCardDetail = (id, isUsed = false) => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { baseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: GET_DETAIL_POST_CARD,
            params: {
              id,
              baseUrl,
              isUsed
            }
          }
        }
      }).then(resolve, reject);
    });
  };
};

const deletePostCard = (id) => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { baseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: DELETE_POST_CARD,
            params: {
              baseUrl
            }
          },
          options: {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({id})
          }
        }
      }).then(res => {
        resolve(res);
      }, reject);
    });
  };
};

const changePostCardDetail = ({ field }) => {
  return {
    type: 'CHANGE_POST_CARD_DETAIL',
    field
  }
};

const setPostCardDetail = data => {
  return {
    type: 'SET_POST_CARD_DETAIL',
    data
  }
};

const createPostCard = (params) => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { baseUrl } = getDataFromState(getState());

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: params.id ? EDIT_POST_CARD : ADD_POST_CARD,
            params: {
              baseUrl
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
      }).then(res => {
        resolve(res);
      }, reject)
    })
  }
};


const setPostCard = (params) => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());

      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SET_POST_CARD,
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
      }).then(res => {
        resolve(res);
      }, reject)
    })
  }
};

export const getUsedPostCardDetail = (id) => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { baseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: GET_DETAIL_POST_CARD,
            params: {
              id,
              baseUrl
            }
          }
        }
      }).then((res) => {
        if(res && res.ret_code === 200000 && res.data) {
          dispatch(setUsedPostCardDetail(res.data))
        }
      }, reject);
    });
  };
};

export const setUsedPostCardDetail = data => {
  return {
    type: 'SET_USED_POST_CARD_DETAIL',
    data
  }
};

export default {
  uploadFile,
  setPostCard,
  deletePostCard,
  createPostCard,
  getPostCardList,
  getPostCardDetail,
  setPostCardDetail,
  changePostCardDetail,
  getUsedPostCardDetail,
  setUsedPostCardDetail
}