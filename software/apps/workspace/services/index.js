import { template } from 'lodash';

import * as xhr from '@resource/websiteCommon/utils/xhr';

import {
  GET_CONTENT_LIST_BY_BROADCAST,
  GET_CONTENT_LIST_BY_TIME_SEGMENT,
  GET_HOT_CONTENT,
  GET_JS_SDK_PARAM,
  GET_QWECHAR_JS_SDK_PARAM,
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
  is_asc = false,
  page_size,
  category_id, // 分类id
  sort_type, // 新增直播间排序方式
  last_shot_time, // 每一页的最后的那条数据的拍摄时间
  last_repeat_album_content_rel_id, // 需要判断最后的shot_time是否还有重复的，如果有把对应的 last_enc_album_content_rel_id 都传过来
}) => {
  const url = template(GET_CONTENT_LIST_BY_BROADCAST)({
    baseUrl,
  });
  const bodyParams = {
    enc_broadcast_id,
    last_enc_album_content_rel_id,
    page_size,
    // 如果sort_type=1时，传入create_time;如果sort_type=2时，传入shot_time
    order_by: sort_type === 1 ? 'create_time' : 'shot_time',
    is_asc,
    category_id,
    last_shot_time,
    last_repeat_album_content_rel_id,
  };
  return xhr.post(url, bodyParams);
};

/**
 * 获取直播热门图片列表
 * @param {*} param0 last_enc_album_content_rel_id 获取最后一条
 * @returns
 */
const getHotContentList = ({ baseUrl, enc_broadcast_id }) => {
  const url = template(GET_HOT_CONTENT)({
    baseUrl,
  });
  const bodyParams = {
    enc_broadcast_id,
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
  page_size,
  sort_type, // 新增直播间排序方式
  last_shot_time, // 每一页的最后的那条数据的拍摄时间
  last_repeat_album_content_rel_id, // 需要判断最后的shot_time是否还有重复的，如果有把对应的 last_enc_album_content_rel_id 都传过来
}) => {
  const url = template(GET_CONTENT_LIST_BY_TIME_SEGMENT)({
    baseUrl,
  });
  const bodyParams = {
    enc_broadcast_id,
    begin_time,
    end_time,
    last_enc_album_content_rel_id,
    page_size,
    // 如果sort_type=1时，传入create_time;如果sort_type=2时，传入shot_time
    order_by: sort_type === 1 ? 'create_time' : 'shot_time',
    is_asc,
    last_shot_time,
    last_repeat_album_content_rel_id,
  };
  return xhr.post(url, bodyParams);
};

/**
 * 是否有新照片
 * @param {*} param0
 * begin_time 使用获取图片列表中返回的last_search_time
 * @returns
 */
const hasUpdate = ({ baseUrl, enc_broadcast_id, begin_time }) => {
  const url = template(HAS_UPDATED)({
    baseUrl,
  });
  const bodyParams = {
    enc_broadcast_id,
    begin_time,
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
    target_type,
    action_type,
    enc_target_id,
    user_unique_id,
  };
  return xhr.post(url, bodyParams);
};

/**
 * 点赞或查看查询
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
  user_unique_id,
}) => {
  const url = template(GET_TARGET_OPERATION_COUNT)({
    baseUrl,
  });
  const bodyParams = {
    enc_broadcast_id,
    target_type,
    action_type,
    enc_target_id,
    user_unique_id,
  };
  return xhr.post(url, bodyParams);
};

/**
 * 获取JS SDK参数
 * @param {*} param0
 * @returns
 */
const getJSSdkParam = ({ baseUrl, url }) => {
  const URL = template(GET_JS_SDK_PARAM)({
    baseUrl,
    url,
  });
  return xhr.get(URL);
};

/**
 *
 * @param {object} params
 * @paras {string} baseUrl
 * @paras {string} url
 * @returns {Promise}
 */
const getQWecharJSSdkParam = ({ baseUrl, url }) => {
  const URL = template(GET_QWECHAR_JS_SDK_PARAM)({
    baseUrl,
    url,
  });
  return xhr.get(URL);
};

export default {
  getContentList,
  getHotContentList,
  getTimeSegmentGroup,
  getContentListByTimeSegment,
  hasUpdate,
  logTargetOperation,
  getTargetOperationCount,
  getJSSdkParam,
  getQWecharJSSdkParam,
};
