import request from 'appsCommon/utils/ajax';
import { template } from 'lodash';

import {
  AI_GROUP_CHANGE_GROUP,
  AI_GROUP_FACE_RECTANGLE,
  AI_GROUP_FRESH_COUNT,
  AI_GROUP_FRESH_IMAGES,
  AI_GROUP_LIST_COLLECTION_GROUP_DETAILS,
  AI_UPDATE_AVATAR,
  GET_COLLECTION_GROUP_INFO,
} from '@resource/lib/constants/apiUrl';

import * as xhr from '@resource/websiteCommon/utils/xhr';

import { GET_FACE_IMGS } from '@apps/gallery-client-mobile/constants/apiUrl';

const getAiGroupHeadList = ({ baseUrl, enc_collection_id }) => {
  return new Promise(resolve => {
    const url = template(GET_FACE_IMGS)({
      baseUrl,
      galleryBaseUrl: baseUrl,
      enc_collection_id,
    });
    xhr.get(url).then(res => {
      resolve(res.data);
    });
  });
};

const getSmartShardingStatus = ({ baseUrl, enc_collection_id }) => {
  return new Promise(resolve => {
    const url = template(GET_COLLECTION_GROUP_INFO)({
      baseUrl,
      enc_collection_id,
    });
    xhr.get(url).then(res => {
      resolve(res.data);
    });
  });
};

const getFreshImages = ({ baseUrl, enc_collection_id }) => {
  return new Promise(resolve => {
    const url = template(AI_GROUP_FRESH_IMAGES)({
      baseUrl,
      enc_collection_id,
    });
    xhr.get(url).then(res => {
      resolve(res.data);
    });
  });
};

const getFreshCount = ({ baseUrl, enc_collection_id }) => {
  return new Promise(resolve => {
    const url = template(AI_GROUP_FRESH_COUNT)({
      baseUrl,
      enc_collection_id,
    });
    xhr.get(url).then(res => {
      resolve(res.data);
    });
  });
};

const changeGroup = ({ baseUrl, params }) => {
  return new Promise(resolve => {
    const url = template(AI_GROUP_CHANGE_GROUP)({
      baseUrl,
    });

    xhr.post(url, params).then(res => {
      resolve(res.data);
    });
  });
};
const updateAvatar = ({ baseUrl, params }) => {
  return new Promise(resolve => {
    const url = template(AI_UPDATE_AVATAR)({
      baseUrl,
    });

    xhr.post(url, params).then(res => {
      resolve(res.data);
    });
  });
};
const getAiImgFaceRectangle = ({ baseUrl, params }) => {
  return new Promise(resolve => {
    const url = template(AI_GROUP_FACE_RECTANGLE)({
      baseUrl,
      ...params,
    });
    xhr.get(url).then(res => {
      resolve(res.data);
    });
  });
};
export {
  getAiGroupHeadList,
  getSmartShardingStatus,
  getFreshImages,
  getFreshCount,
  changeGroup,
  updateAvatar,
  getAiImgFaceRectangle,
};
