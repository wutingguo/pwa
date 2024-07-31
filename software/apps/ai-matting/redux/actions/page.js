import * as xhr from 'appsCommon/utils/xhr';
import { omit, template } from 'lodash';

import { wrapPromise } from '@resource/lib/utils/promise';

import { CALL_API } from '@resource/lib/middlewares/api';

import { SET_PAGE, UPDATE_PAGE } from '@apps/ai-matting/constants/actionTypes';
import { URL_MATTING_COMPOSITE, URL_MATTING_DETECT } from '@apps/ai-matting/constants/apiUrl';
import { updateElement } from '@apps/ai-matting/redux/actions/elements';
import getDataFromState from '@apps/ai-matting/utils/getDataFromState';

export function setPage(page) {
  return dispatch => {
    dispatch({
      type: SET_PAGE,
      page,
    });
  };
}

export function updatePage(updatePage) {
  return dispatch => {
    dispatch({
      type: UPDATE_PAGE,
      page: updatePage,
    });
  };
}

/**
 * 首次抠图，获取当前page抠图蒙版
 */
export function getMattingMask() {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl, originEncImgId, photoElement } = getDataFromState(getState());
      const url = template(URL_MATTING_DETECT)({ baseUrl: galleryBaseUrl });
      const data = `enc_image_id=${originEncImgId}`;
      const options = {
        setHead: true,
        setJSON: false,
      };
      xhr.post(url, data, options).then(res => {
        const { data: baseMaskId } = res || {};
        if (baseMaskId) {
          dispatch(
            updateElement({
              id: photoElement.get('id'),
              imageMatting: {
                baseMaskId,
                finalMaskId: baseMaskId,
              },
            })
          );
          resolve(baseMaskId);
        }
        reject('获取蒙板失败');
      });
    });
  };
}

//应用抠图蒙板,该方法会resolve一个需要回传给调用方的信息对象
export function applyMatting() {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { projectId, galleryBaseUrl, page, photoElement, originEncImgId } = getDataFromState(
        getState()
      );
      const elementId = photoElement.get('id');
      const imageMatting = photoElement.get('imageMatting');
      const imageMattingJS = imageMatting?.toJS() || {};
      const { finalMaskId } = imageMattingJS;
      const url = template(URL_MATTING_COMPOSITE)({ baseUrl: galleryBaseUrl });
      const data = {
        origin_enc_image_id: originEncImgId,
        matting: {
          masks: [
            {
              code: finalMaskId,
              index: 0,
            },
          ],
        },
        contexts: [
          {
            context_type: 'PROJECT',
            context_value: projectId,
          },
          {
            context_type: 'PROJECT_ELEMENT',
            context_value: elementId,
          },
        ],
      };
      xhr.post(url, data).then(res => {
        const { data = {} } = res || {};
        const { final_enc_image_id } = data;
        if (final_enc_image_id) {
          resolve({
            elementId,
            imageMatting: {
              ...omit(imageMattingJS, ['mattingMaskObj']),
              finalEncImgId: final_enc_image_id,
            },
          });
        }
        reject('应用失败');
      });
    });
  };
}
