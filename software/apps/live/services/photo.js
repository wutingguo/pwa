import { template } from 'lodash';

import * as xhr from '@resource/websiteCommon/utils/xhr';

import reaquest from '@common/utils/request';

import {
  ALBUM_LIVE_DELETE_ALBUM,
  ALBUM_LIVE_GET_ALBUM_LIST,
  ALBUM_LIVE_GET_COUPON,
  ALBUM_LIVE_GET_START_PAGE,
  ALBUM_LIVE_GIFT_FREE,
  ALBUM_LIVE_QUERY_ALBUM_LIST,
  ALBUM_LIVE_RETRIEVE_ALBUM,
  ALBUM_LIVE_ROLLBACK_ALBUM,
  ALBUM_LIVE_SAVE_START_PAGE,
  ALBUM_LIVE_UPLOAD_FILE,
  ALBUM_LIVE_UPLOAD_FILE_ERROR_TIP,
  ALBUM_LIVE_VERIFY_AUTH,
  ALBUM_LIVE_VERIFY_AUTH_2,
} from '../constants/api';

const getAlbumList = ({ baseUrl, ...rest }) => {
  const url = template(ALBUM_LIVE_GET_ALBUM_LIST)({
    baseUrl,
  });
  const bodyParams = {
    album_status_list: [1, 2],
    ...rest,
  };
  return xhr.post(url, bodyParams);
};

const retrieveAlbum = ({ baseUrl, enc_album_ids }) => {
  const url = template(ALBUM_LIVE_RETRIEVE_ALBUM)({
    baseUrl,
    enc_album_ids,
  });
  return xhr.get(url);
};

const saveStartPage = ({ baseUrl, broadcast_id, start_page_switch, poster_image, ...rest }) => {
  const url = template(ALBUM_LIVE_SAVE_START_PAGE)({
    baseUrl,
  });
  const bodyParams = {
    start_page_switch,
    broadcast_id,
    poster_image,
    ...rest,
  };
  return xhr.post(url, bodyParams);
};

const getStartPage = ({ baseUrl, broadcast_id }) => {
  const url = template(ALBUM_LIVE_GET_START_PAGE)({
    baseUrl,
    broadcast_id,
  });
  return xhr.get(url);
};

// 获取回收站相册列表
const getAlbumRecycleList = ({ baseUrl, ...rest }) => {
  const url = template(ALBUM_LIVE_QUERY_ALBUM_LIST)({ baseUrl });
  return reaquest({ url, data: { ...rest } }, 'post');
};

// 删除相册（回收站中）
const deleteAlbumRecycle = ({ baseUrl, id }) => {
  const url = template(ALBUM_LIVE_DELETE_ALBUM)({ baseUrl, id });
  return reaquest({ url });
};

// 还原相册（回收站中）
const rollbackAlbumRecycle = ({ baseUrl, id }) => {
  const url = template(ALBUM_LIVE_ROLLBACK_ALBUM)({ baseUrl, id });
  return reaquest({ url });
};

// 还原相册（回收站中）
const init_account = ({ baseUrl, moduleCode }) => {
  const url = template(ALBUM_LIVE_GET_COUPON)({ baseUrl, moduleCode });
  return reaquest({ url });
};

// 权限验证
const verifyAuth = ({ baseUrl, id, scene }) => {
  const url = template(ALBUM_LIVE_VERIFY_AUTH)({ baseUrl, id, scene });
  return reaquest({ url });
};
// 权限验证2
const verifyAuth2 = ({ baseUrl, id, scene, enc_album_id }) => {
  const url = template(ALBUM_LIVE_VERIFY_AUTH_2)({ baseUrl, id, scene, enc_album_id });
  return reaquest({ url });
};

// 精修免费版
const gift_free = ({ baseUrl, moduleCode, policyCode }) => {
  const url = template(ALBUM_LIVE_GIFT_FREE)({ baseUrl, moduleCode, policyCode });
  return reaquest({ url });
};

// 文件直传接口
const albumLiveUploadFile = data => {
  const url = template(ALBUM_LIVE_UPLOAD_FILE)({
    baseUrl: '/',
  });
  return xhr.post(url, data, { setJSON: false, 'Content-type': 'multipart/form-data' });
};

/**
 *
 * @param {object} param0 文件错误提示文案
 * @param {string} param0.productName 产品名称
 * @param {string} param0.terminalName 终端名称
 * @param {string} param0.errorInfo 错误信息
 * @param {string} param0.requestUrl 请求地址
 * @param {object} param0.headers 请求头
 * @param {string} param0.keyName 文件key
 * @param {string} param0.baseUrl 请求地址
 * @returns
 */
const albumLiveUploadFileError = ({
  baseUrl = '/',
  productName,
  terminalName,
  errorInfo,
  requestUrl,
  headers,
  keyName,
}) => {
  const url = template(ALBUM_LIVE_UPLOAD_FILE_ERROR_TIP)({
    baseUrl,
  });

  const message = `${productName},${terminalName},errorInfo:${errorInfo},requestUrl:${requestUrl},headers:${JSON.stringify(
    headers
  )}`;
  const data = {
    failed_detail_list: [
      {
        key_name: keyName,
        msg: message,
      },
    ],
  };
  return xhr.post(url, data);
};

export default {
  getAlbumList,
  retrieveAlbum,
  saveStartPage,
  getStartPage,
  getAlbumRecycleList,
  deleteAlbumRecycle,
  rollbackAlbumRecycle,
  init_account,
  verifyAuth,
  gift_free,
  verifyAuth2,
  albumLiveUploadFile,
  albumLiveUploadFileError,
};
