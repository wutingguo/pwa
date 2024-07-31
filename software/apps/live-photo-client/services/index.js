import { template } from 'lodash';

import * as xhr from '@resource/websiteCommon/utils/xhr';

import {
  ALBUM_LIVE_CHECK_ACCESS,
  ALBUM_LIVE_GET_ACCESS,
  ALBUM_LIVE_GET_ALBUM_CATEGORY,
} from '@apps/live-photo-client/constants/imageUrl';
import {
  GET_CONTENT_LIST_BY_BROADCAST,
  GET_CONTENT_LIST_BY_TIME_SEGMENT,
  GET_HOT_CONTENT,
  GET_TARGET_OPERATION_COUNT,
  GET_TIME_SEGMENT_GROUP,
  HAS_UPDATED,
  LOG_TARGET_OPERATION,
} from '@apps/workspace/constants/apiUrl';

/**
 * 获取直播间图片列表
 * @param {*} param0 last_enc_album_content_rel_id 获取最后一条
 * @returns
 */
const getContentList = ({
  baseUrl,
  enc_broadcast_id,
  last_enc_album_content_rel_id = '',
  is_asc = '',
  page_size,
}) => {
  const url = template(GET_CONTENT_LIST_BY_BROADCAST)({
    baseUrl,
  });
  const bodyParams = {
    enc_broadcast_id,
    last_enc_album_content_rel_id,
    page_size,
    order_by: '',
    is_asc,
  };
  return xhr.post(url, bodyParams);
};

/**
 * 获取直播热门图片列表
 * @param {*} param0 last_enc_album_content_rel_id 获取最后一条
 * @returns
 */
const getHotContentList = ({
  baseUrl,
  enc_broadcast_id,
  last_enc_album_content_rel_id = '',
  page_size,
}) => {
  const url = template(GET_HOT_CONTENT)({
    baseUrl,
  });
  const bodyParams = {
    enc_broadcast_id,
    last_enc_album_content_rel_id,
    page_size,
  };
  return xhr.post(url, bodyParams);
};

/**
 * 获取相册下小时分段信息
 * @param {*} param0
 * @returns
 */
const getTimeSegmentGroup = ({ baseUrl, enc_broadcast_id }) => {
  const url = template(GET_TIME_SEGMENT_GROUP)({
    baseUrl,
    enc_broadcast_id,
  });
  return xhr.get(url);
};

/**
 * 根据时间段获取图片列表
 * @param {*} param0
 * @returns
 */
const getContentListByTimeSegment = ({
  baseUrl,
  enc_broadcast_id,
  begin_time,
  end_time,
  last_enc_album_content_rel_id,
  is_asc,
}) => {
  const url = template(GET_CONTENT_LIST_BY_TIME_SEGMENT)({
    baseUrl,
  });
  const bodyParams = {
    enc_broadcast_id,
    begin_time,
    end_time,
    last_enc_album_content_rel_id,
    page_size: '100000',
    order_by: 'create_time',
    is_asc,
  };
  return xhr.post(url, bodyParams);
};

/**
 * 是否有新照片
 * @param {*} param0
 * @returns
 */
const hasUpdate = ({
  baseUrl,
  enc_broadcast_id,
  last_enc_album_content_rel_id = '',
  is_asc = false,
  page_size,
}) => {
  const url = template(HAS_UPDATED)({
    baseUrl,
  });
  const bodyParams = {
    enc_broadcast_id,
    last_enc_album_content_rel_id,
    page_size,
    order_by: 'create_time',
    is_asc,
  };
  return xhr.post(url, bodyParams);
};

/**
 * 点赞或查看记录接口
 * @param {*} param0
 * target_type 1-album, 2-content
 * action_type: 1-view 查看, 2-like 点赞, 3-unlike 点踩, 4-取消点赞，5-取消点踩
 * @returns
 */
const logTargetOperation = ({
  baseUrl,
  enc_broadcast_id,
  target_type,
  action_type,
  enc_target_id,
  user_unique_id,
}) => {
  const url = template(LOG_TARGET_OPERATION)({
    baseUrl,
  });
  const bodyParams = {
    enc_broadcast_id,
    // last_enc_album_content_rel_id,
    target_type,
    action_type,
    enc_target_id,
    user_unique_id,
  };
  return xhr.post(url, bodyParams);
};

/**
 * 点赞或查看记录接口
 * @param {*} param0
 * target_type 1-album, 2-content
 * action_type: 1-view 查看, 2-like 点赞, 3-unlike 点踩, 4-取消点赞，5-取消点踩
 * @returns
 */
const getTargetOperationCount = ({
  baseUrl,
  enc_broadcast_id,
  target_type,
  action_type,
  enc_target_id,
}) => {
  const url = template(GET_TARGET_OPERATION_COUNT)({
    baseUrl,
  });
  const bodyParams = {
    enc_broadcast_id,
    // last_enc_album_content_rel_id,
    target_type,
    action_type,
    enc_target_id,
  };
  return xhr.post(url, bodyParams);
};

/**
 * 获取相册的分类别表
 * @param {GetAlbumRequest} param0
 * @typedef {Object} GetAlbumRequest
 * @property {string} baseUrl
 * @property {string} enc_album_id 加密的相册ID
 * @property {boolean} [is_show_hide=false] 是否查询隐藏的分类：true-查询 false-不查询
 * @returns {Promise<any>}
 */
const getAlbumCategory = ({ baseUrl, enc_album_id, is_show_hide = false }) => {
  const url = template(ALBUM_LIVE_GET_ALBUM_CATEGORY)({ baseUrl, enc_album_id, is_show_hide });
  return xhr.get(url);
};

/**
 * 获取C端访问设置
 * @param {object} param0
 * @param {string} param0.baseUrl
 * @param {string} param0.enc_broadcast_id
 * @returns
 */
const getAccessSetting = ({ baseUrl, enc_broadcast_id }) => {
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
const checkAccessPassword = ({ baseUrl, enc_broadcast_id, password }) => {
  const url = template(ALBUM_LIVE_CHECK_ACCESS)({
    baseUrl,
  });
  const bodyParams = {
    enc_broadcast_id,
    password,
  };
  return xhr.post(url, bodyParams);
};

export default {
  getContentList,
  getHotContentList,
  getTimeSegmentGroup,
  getContentListByTimeSegment,
  hasUpdate,
  logTargetOperation,
  getTargetOperationCount,
  getAlbumCategory,
  getAccessSetting,
  checkAccessPassword,
};
