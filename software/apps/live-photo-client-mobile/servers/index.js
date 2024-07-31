import { template } from 'lodash';

import * as xhr from '@resource/websiteCommon/utils/xhr';

import {
  ALBUM_LIVE_CHECK_ACCESS,
  ALBUM_LIVE_GET_ACCESS,
  ALBUM_LIVE_GET_AI_FACE_INFO,
  ALBUM_LIVE_GET_FACE_DETECT,
  ALBUM_LIVE_GET_FACE_IMAGE,
  ALBUM_LIVE_GET_IMAGE_INFO,
  ALBUM_LIVE_GET_UPLOAD_COMPLETE,
  ALBUM_LIVE_GET_UPLOAD_URL,
  ALBUM_LIVE_SUBMIT_FACE_DETECT,
  ALBUM_LIVE_SUBMIT_FACE_INFO,
  ALBUM_LIVE_SUBMIT_FORM_INFO,
  GET_FACE_INFO,
  GET_FACE_SIMILAR_IMAGE,
  GET_LOADING_INFO,
  GET_TOKEN_INFO,
} from '@apps/live-photo-client-mobile/constants/apiUrl';

/**
 *
 * @param {InfoParams} param0
 * @typedef {Object} InfoParams
 * @param {string} baseUrl
 * @param {string} broadcast_id
 * @returns {Promise<any>}
 */
export function getLoadingInfo({ baseUrl, enc_broadcast_id }) {
  const url = template(GET_LOADING_INFO)({ baseUrl, enc_broadcast_id });

  return xhr.get(url);
}

/**
 * 获取C端访问设置
 * @param {object} param0
 * @param {string} param0.baseUrl
 * @param {string} param0.enc_broadcast_id
 * @returns
 */
export const getAccessSetting = ({ baseUrl, enc_broadcast_id }) => {
  const url = template(ALBUM_LIVE_GET_ACCESS)({
    baseUrl,
    enc_broadcast_id,
  });

  return xhr.get(url);
};

/**
 * 校验访问密码
 * @param {object} param0
 * @param {string} param0.baseUrl
 * @param {string} param0.enc_broadcast_id
 * @param {string} param0.password
 * @returns
 */
export const checkAccessPassword = ({ baseUrl, enc_broadcast_id, password }) => {
  const url = template(ALBUM_LIVE_CHECK_ACCESS)({
    baseUrl,
  });
  const bodyParams = {
    enc_broadcast_id,
    password,
  };
  return xhr.post(url, bodyParams);
};

/**
 * 根据当前album获取所属用户的token信息接口
 * @param {object} param0
 * @param {string} param0.baseUrl
 * @param {string} param0.enc_broadcast_id
 * @returns
 */
export const getAiTokenInfo = ({ baseUrl, enc_broadcast_id }) => {
  const url = template(GET_TOKEN_INFO)({
    baseUrl,
    enc_broadcast_id,
  });

  return xhr.get(url);
};

/**
 * 获取图片人脸信息
 * @param {object} param0
 * @param {string} param0.baseUrl
 * @param {string} param0.enc_image_id
 * @returns
 */
export const getImageWithFaceInfo = ({ baseUrl, enc_image_id }) => {
  const url = template(GET_FACE_INFO)({ baseUrl, enc_image_id });
  return xhr.get(url);
};

/**
 * 根据人脸信息查询相似图片
 * @param {object} param0
 * @param {string} param0.baseUrl
 * @param {string} param0.enc_broadcast_id
 * @param {string} param0.face_token
 * @returns
 */
export const getImageWithSimilarFace = ({ baseUrl, enc_broadcast_id, face_token }) => {
  const url = template(GET_FACE_SIMILAR_IMAGE)({
    baseUrl,
    enc_broadcast_id,
    face_token,
  });
  return xhr.get(url);
};

/**
 * 获取上传的url - 1
 * @param {object} param0
 * @param {string} param0.baseUrl
 * @param {Array[]} param0.upload_file
 * @returns
 */
export const getFetchUploadUrl = ({ baseUrl, upload_file }, options) => {
  const url = template(ALBUM_LIVE_GET_UPLOAD_URL)({ baseUrl });
  /**
   * 设置默认media_type
   * 1. 表示iamge
   * 2. 表示audio
   * 3. 表示video
   *  */
  const fileList = upload_file.map(item => {
    if (!item.media_type) {
      item.media_type = 1;
    }
    return item;
  });
  return xhr.post(url, { upload_file: fileList }, options);
};

/**
 * 文件上传-2
 * @param {object} param0
 * @param {string} param0.url
 * @param {object} param0.data
 * @param {Array[]} param0.media_type
 * @returns
 **/

export const uploadFile = ({ url, data, media_type = 1 }) => {
  return new Promise((resovle, reject) => {
    const request = new XMLHttpRequest();
    request.open('PUT', url, true);
    /**
     * media_type为1 content-type： image/*;
     * media_type为2 content-type： audio/*;
     * media_type为3 content-type： video/*;
     */
    if (media_type === 1) {
      request.setRequestHeader('Content-Type', 'image/*');
    } else if (media_type === 2) {
      request.setRequestHeader('Content-Type', 'audio/*');
    } else if (media_type === 3) {
      request.setRequestHeader('Content-Type', 'video/*');
    }

    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        if (request.status === 200) {
          resovle(data);
        } else {
          reject(400);
        }
      }
    };
    request.send(data);
  });
};

/**
 * 通知服务器 - 3
 *
 * */

export const uploadComplete = ({ baseUrl, upload_success_list }, options) => {
  const url = template(ALBUM_LIVE_GET_UPLOAD_COMPLETE)({ baseUrl });
  return xhr.post(url, { upload_success_list }, options).then(res => {
    return {
      upload_result: res.data.upload_result,
    };
  });
};

/**
 * 合并上传文件接口
 * @param {object} param0
 * @param {string} param0.baseUrl
 * @param {object} param0.file
 * @param {string} param0.enc_broadcast_id
 * */

export function uploadFileCombine({ file, baseUrl, enc_broadcast_id }) {
  const upload_file = [];
  if (!file) return Promise.reject();
  upload_file.push({
    client_file_name: file.name,
  });
  return new Promise(async (resovle, reject) => {
    const params = {
      baseUrl,
      enc_broadcast_id,
    };
    let header = {};

    try {
      {
        const res = await getAiTokenInfo(params).catch(err => {
          reject(err);
        });
        const { token, app_id } = res.data;
        header = {
          'X-As-Auth-Token': token,
          'X-As-App-Id': app_id,
        };
      }

      {
        const res = await getFetchUploadUrl({ upload_file, baseUrl }, { header }).catch(err => {
          reject(err);
        });
        const item = res.data.upload_file_meta[0];
        const url = item.pre_signature_url;
        await uploadFile({ url, data: file, media_type: item.media_type }).catch(err => {
          reject(err);
        });

        const completeRes = await uploadComplete(
          {
            baseUrl,
            upload_success_list: [
              {
                key_name: item.key_name,
                file_name: item.client_file_name,
                file_size: file.size,
              },
            ],
          },
          { header }
        ).catch(err => {
          reject(err);
        });
        resovle(completeRes);
      }
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * 获取AI人像搜索大图展示的人脸信息
 * @param {object} param0
 * @param {string} param0.baseUrl
 * @param {string} param0.enc_broadcast_id
 * @param {string} param0.enc_image_id
 */
export const getAIFaceInfo = ({ baseUrl, enc_broadcast_id, enc_image_id }) => {
  const url = template(ALBUM_LIVE_GET_AI_FACE_INFO)({ baseUrl, enc_broadcast_id, enc_image_id });
  return xhr.get(url);
};

/**
 * C端提交表单信息
 * @param {object} param0
 * @param {string} param0.baseUrl
 * @param {string} param0.uidpk
 * @param {string} param0.enc_album_id
 * @param {Array} param0.submit_info
 */
export const submitFormInfo = ({ baseUrl, ...rest }) => {
  const url = template(ALBUM_LIVE_SUBMIT_FORM_INFO)({ baseUrl });
  return xhr.post(url, { ...rest });
};

/**
 * C端提交人脸上传表单信息
 * @param {Object} param0
 * @param {string} param0.baseUrl baseUrl
 * @param {string} param0.enc_broadcast_id 加密的broadcast_id
 * @param {string} param0.full_name 姓名
 * @param {string} param0.phone_number 电话号码
 * @param {string} param0.email 邮箱
 * @param {string} param0.enc_image_id 头像id
 * @param {1|2} param0.create_source 1-B端 2-C端
 */
export const submitFaceInfo = ({ baseUrl, ...rest }) => {
  const url = template(ALBUM_LIVE_SUBMIT_FACE_INFO)({ baseUrl });
  return xhr.post(url, { ...rest });
};

/**
 * 开启隐私模式下，获取AI搜索展示的人脸信息
 * @param {Object} param0
 * @param {string} param0.baseUrl
 * @param {string} param0.enc_broadcast_id
 * @param {string} param0.enc_image_id
 */
export const getFaceDetectInfo = ({ baseUrl, enc_broadcast_id, enc_image_id }) => {
  const url = template(ALBUM_LIVE_GET_FACE_DETECT)({ baseUrl, enc_broadcast_id, enc_image_id });
  return xhr.get(url);
};

/**
 * 开启隐私模式下，点击人脸头像提交信息
 * @param {Object} param0
 * @param {string} param0.baseUrl baseUrl
 * @param {string} param0.detail_id 人脸头像的id
 * @param {boolean} param0.submit_id 提交人脸表单的id
 */
export const submitFaceDetectInfo = ({ baseUrl, ...rest }) => {
  const url = template(ALBUM_LIVE_SUBMIT_FACE_DETECT)({ baseUrl });
  return xhr.post(url, { ...rest });
};

/**
 * 开启隐私模式下，根据人脸信息查询相似图片
 * @param {object} param0
 * @param {string} param0.baseUrl baseUrl
 * @param {string} param0.enc_broadcast_id 加密的broadcast_id
 * @param {string} param0.face_token 头像的唯一标识
 */
export const getImagePrivacySimilarFace = ({ baseUrl, enc_broadcast_id, face_token }) => {
  const url = template(ALBUM_LIVE_GET_FACE_IMAGE)({
    baseUrl,
    enc_broadcast_id,
    face_token,
  });
  return xhr.get(url);
};
