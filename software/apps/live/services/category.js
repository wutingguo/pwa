import { template } from 'lodash';

import reaquest from '@common/utils/request';

import {
  ALBUM_LIVE_DELETE_ALBUM_CATEGORY,
  ALBUM_LIVE_GET_ALBUM_CATEGORY,
  ALBUM_LIVE_SAVE_ALBUM_CATEGORY,
  ALBUM_LIVE_SORT_ALBUM_CATEGORY,
  ALBUM_LIVE_SWITCH_ALBUM_CATEGORY,
} from '../constants/api';

/**
 * 获取相册的分类别表
 * @param {GetAlbumRequest} param0
 * @typedef {Object} GetAlbumRequest
 * @property {string} baseUrl
 * @property {string} enc_album_id 加密的相册ID
 * @property {boolean} [is_show_hide=true] 是否查询隐藏的分类：true-查询 false-不查询
 * @returns {Promise<any>}
 */
export const getAlbumCategory = ({ baseUrl, enc_album_id, is_show_hide = true }) => {
  const url = template(ALBUM_LIVE_GET_ALBUM_CATEGORY)({ baseUrl, enc_album_id, is_show_hide });
  return reaquest({ url });
};

/**
 * 新增|编辑相册分类
 * @param {SaveAlbumCategoryRequest} param0
 * @typedef {Object} SaveAlbumCategoryRequest
 * @property {string} baseUrl
 * @property {number} [id] 传入id为编辑，不传入为新增
 * @property {string} category_name 分类名称
 * @property {string} enc_album_id 加密的相册ID
 * @returns {Promise<any>} 特殊code说明：400332-超出分类创建数量 400333-编辑分类时，分类不存在
 *
 */
export const saveAlbumCategory = ({ baseUrl, id, category_name, enc_album_id }) => {
  const url = template(ALBUM_LIVE_SAVE_ALBUM_CATEGORY)({ baseUrl });
  return reaquest({ url, data: { id, category_name, enc_album_id } }, 'post');
};

/**
 * 删除分类
 * @param {DeleteAlbumCategoryRequest} param0
 * @typedef {Object} DeleteAlbumCategoryRequest
 * @property {string} baseUrl
 * @property {number} category_id 分类ID
 * @returns {Promise<any>} 特殊code说明：400333-目标删除对象不存在 400334-主分类不能被删除
 *
 */
export const deleteAlbumCategory = ({ baseUrl, category_id }) => {
  const url = template(ALBUM_LIVE_DELETE_ALBUM_CATEGORY)({ baseUrl, category_id });
  return reaquest({ url });
};

/**
 * 分类排序
 * @param {SortAlbumCategoryRequest} param0
 * @typedef {Object} SortAlbumCategoryRequest
 * @property {string} baseUrl
 * @property {number} current_id 当前鼠标拖动的分类ID
 * @property {number} prev_id 移动分类后，该分类的上一个分类ID，如果上一个没有，传0
 * @property {number} next_id 移动分类后，该分类的上一个分类ID，如果下一个没有，传0
 * @returns {Promise<any>} 特殊code说明：400333-目标移动对象不存在
 *
 */
export const sortAlbumCategory = ({ baseUrl, current_id, prev_id, next_id }) => {
  const url = template(ALBUM_LIVE_SORT_ALBUM_CATEGORY)({ baseUrl });
  return reaquest({ url, data: { current_id, prev_id, next_id } }, 'post');
};

/**
 * 分类显示隐藏切换
 * @param {SwitchAlbumCategoryRequest} param0
 * @typedef {Object} SwitchAlbumCategoryRequest
 * @property {string} baseUrl
 * @property {number} category_id 分类ID
 * @property {0|1|number} status 状态：0-隐藏 1-显示
 * @returns {Promise<any>} 特殊code说明：400333-不存在
 *
 */
export const switchAlbumCategory = ({ baseUrl, category_id, status }) => {
  const url = template(ALBUM_LIVE_SWITCH_ALBUM_CATEGORY)({ baseUrl });
  return reaquest({ url, data: { category_id, status } }, 'post');
};
