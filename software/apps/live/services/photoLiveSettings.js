import { template } from 'lodash';

import {
  GET_PFC_TOPIC_CATEGORIES,
  GET_PFC_TOPIC_EFFECTS_PROVIDER,
} from '@resource/lib/constants/apiUrl';

import * as xhr from '@resource/websiteCommon/utils/xhr';

import reaquest from '@common/utils/request';

import {
  ALBUM_LIVE_ADD_ALBUM_CONTENT,
  ALBUM_LIVE_ADD_CAMERAMAN,
  ALBUM_LIVE_ADD_FACE_GROUP,
  ALBUM_LIVE_AIRETOUCH_SWITCH,
  ALBUM_LIVE_BATCH_SET_PASS,
  ALBUM_LIVE_CANCEL_REWATERMARK_TASK,
  ALBUM_LIVE_CHANGE_CONTENT_GROUP,
  ALBUM_LIVE_CHECK_IMG_REPEAT,
  ALBUM_LIVE_CORRECT_STATICS,
  ALBUM_LIVE_CREATE_REWATERMARK_TASK,
  ALBUM_LIVE_DELETE_IMAGE,
  ALBUM_LIVE_DEL_CAMERAMAN,
  ALBUM_LIVE_DEL_FORM_FIELD,
  ALBUM_LIVE_DEL_SKIN,
  ALBUM_LIVE_Delete_DOWNLOAD_LINK,
  ALBUM_LIVE_EXPORT_REGISTER_FORM_INFO,
  ALBUM_LIVE_GET_ACCESS,
  ALBUM_LIVE_GET_AD_LIST,
  ALBUM_LIVE_GET_AIRETOUCH_PRESET,
  ALBUM_LIVE_GET_AIRETOUCH_PRESET_PROVIDER,
  ALBUM_LIVE_GET_AI_CONFIG,
  ALBUM_LIVE_GET_AI_FACE_CONFIG,
  ALBUM_LIVE_GET_ALBUM_ADVER,
  ALBUM_LIVE_GET_ALBUM_BANNER,
  ALBUM_LIVE_GET_ALBUM_SHARE,
  ALBUM_LIVE_GET_CAMERAMAN_INFO,
  ALBUM_LIVE_GET_CAMERAMAN_LIST,
  ALBUM_LIVE_GET_CUSTOMER_SKIN_COUNT,
  ALBUM_LIVE_GET_FACE_LIST,
  ALBUM_LIVE_GET_PHO_ROLE_LIST,
  ALBUM_LIVE_GET_PICKER_CONFIG,
  ALBUM_LIVE_GET_PV_CONFIG,
  ALBUM_LIVE_GET_REGISTER_CONFIG,
  ALBUM_LIVE_GET_REGISTER_FORM_INFO,
  ALBUM_LIVE_GET_RETOUCHING_POINTS,
  ALBUM_LIVE_GET_SKIN_CATEGORY_LIST,
  ALBUM_LIVE_GET_SKIN_LIST,
  ALBUM_LIVE_GET_UPLOAD_COMPLETE,
  ALBUM_LIVE_GET_UPLOAD_URL,
  ALBUM_LIVE_GET_WATERMARK_LIST,
  ALBUM_LIVE_HAS_DOWNLOAD_PACKAGE_JOB,
  ALBUM_LIVE_PACKAGE,
  ALBUM_LIVE_PINNED_IMAGE,
  ALBUM_LIVE_PROPOSE_DOWNLOAD_PACKAGE,
  ALBUM_LIVE_QUERY_ACTIVITY_INFO,
  ALBUM_LIVE_QUERY_ALBUM,
  ALBUM_LIVE_QUERY_COUNTRY_INFO,
  ALBUM_LIVE_QUERY_DOWNLOAD_LINK,
  ALBUM_LIVE_QUERY_MENU_INFO,
  ALBUM_LIVE_QUERY_PACKAGE_LIST,
  ALBUM_LIVE_QUERY_REWATERMARK_TASK,
  ALBUM_LIVE_REMOVE_AIRETOUCH_IMPORT,
  ALBUM_LIVE_REMOVE_WATERMARK,
  ALBUM_LIVE_REPLACE_ALBUM_CONTENT,
  ALBUM_LIVE_SAVE_ACCESS,
  ALBUM_LIVE_SAVE_AD,
  ALBUM_LIVE_SAVE_AIRETOUCH_IMPORT,
  ALBUM_LIVE_SAVE_AIRETOUCH_PRESET,
  ALBUM_LIVE_SAVE_ALBUM,
  ALBUM_LIVE_SAVE_BANNER_URL,
  ALBUM_LIVE_SAVE_PICKER_CONFIG,
  ALBUM_LIVE_SAVE_PV_CONFIG,
  ALBUM_LIVE_SAVE_REGISTER_CONFIG,
  ALBUM_LIVE_SAVE_SKIN,
  ALBUM_LIVE_SAVE_WATERMARK,
  ALBUM_LIVE_UPDATE_ACTIVITY_INFO,
  ALBUM_LIVE_UPDATE_ALBUM_ADVER,
  ALBUM_LIVE_UPDATE_ALBUM_BANNER,
  ALBUM_LIVE_UPDATE_ALBUM_SHARE,
  ALBUM_LIVE_UPDATE_CORRECT_ENABLE,
  ALBUM_LIVE_UPDATE_CUSTOMER_INFO,
  ALBUM_LIVE_UPDATE_FACE_GROUP,
  ALBUM_LIVE_UPDATE_MENU_INFO,
  ALBUM_LIVE_UPDATE_WATERMARK_ENABLE,
  ALBUM_LIVE_VALIDATE_SWITCH,
  ALBUM_LIVE_lIST_CONTENTS,
  UPDATE_CLIENT_SHOW,
} from '../constants/api';

// 更新基本信息
export const updataAlbumBaseInfo = ({ baseUrl, ...rest }) => {
  const url = template(ALBUM_LIVE_SAVE_ALBUM)({ baseUrl });

  return reaquest({ url, data: { ...rest } }, 'post');
};

// 获取基本信息
export const queryAlbumBaseInfo = ({ baseUrl, album_id }) => {
  const url = template(ALBUM_LIVE_QUERY_ALBUM)({ baseUrl, album_id });
  return reaquest({ url });
};

// 获取相册菜单详情
export const queryMenuInfo = ({ baseUrl, id }) => {
  const url = template(ALBUM_LIVE_QUERY_MENU_INFO)({ baseUrl, broadcast_id: id });
  return reaquest({ url });
};

// 保存活动介绍接口
export const updateActivityInfo = ({ baseUrl, ...rest }) => {
  const url = template(ALBUM_LIVE_UPDATE_ACTIVITY_INFO)({ baseUrl });
  return reaquest({ url, data: { ...rest } }, 'post');
};

// 获取活动介绍接口
export const queryActivityInfo = ({ baseUrl, id }) => {
  const url = template(ALBUM_LIVE_QUERY_ACTIVITY_INFO)({ baseUrl, broadcast_id: id });
  return reaquest({ url });
};

// 保存相册菜单接口
export const updateMenuInfo = ({ baseUrl, data }) => {
  const url = template(ALBUM_LIVE_UPDATE_MENU_INFO)({ baseUrl });
  return reaquest({ url, data }, 'post');
};
export const getCountryList = ({ baseUrl }) => {
  const url = template(ALBUM_LIVE_QUERY_COUNTRY_INFO)({ baseUrl });
  return reaquest({ url });
};

// 获取上传的token - 1
export const getFetchUploadUrl = ({ baseUrl, upload_file }) => {
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
  return reaquest({ url, data: { upload_file: fileList, hasManageError: false } }, 'post', {
    hasManageError: false,
  });
};

// 文件上传-2
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

// 照片直播--添加， 替换
const getInterface = type => {
  switch (type) {
    case 'add_album_content':
      return ALBUM_LIVE_ADD_ALBUM_CONTENT;
      break;
    case 'replace_album_content':
      return ALBUM_LIVE_REPLACE_ALBUM_CONTENT;
      break;
    default:
      return ALBUM_LIVE_GET_UPLOAD_COMPLETE;
      break;
  }
};

// 照片直播--添加， 替换
export const liveUploadComplete = ({ baseUrl, upload_success_list, interfaceType }) => {
  const url = template(getInterface(interfaceType))({ baseUrl });
  return reaquest({ url, data: upload_success_list }, 'post').then(res => {
    return {
      upload_complete: res.upload_result,
    };
  });
};

// 通知服务器 - 3
export const uploadComplete = ({ baseUrl, upload_success_list }) => {
  const url = template(ALBUM_LIVE_GET_UPLOAD_COMPLETE)({ baseUrl });
  return reaquest({ url, data: { upload_success_list } }, 'post').then(res => {
    return {
      upload_complete: res.upload_result,
    };
  });
};

// 相册中添加图片（上传完成后）
export const addPhoto = ({ baseUrl, data }) => {
  const url = baseUrl + 'cloudapi/album_live/album_content/add_album_content';
  return reaquest({ url, data }, 'post').then(res => {
    return res.upload_result;
  });
};

// 上传多个文件
export function uploadFiles({ files, baseUrl }) {
  const upload_file = [];
  if (files.length === 0) return Promise.reject();
  Array.from(files).forEach(file => {
    upload_file.push({
      client_file_name: file.name,
    });
  });
  return new Promise((resovle, reject) => {
    getFetchUploadUrl({ upload_file, baseUrl }).then(
      res => {
        const metas = res.upload_file_meta;
        const promises = [];
        for (let i = 0; i < metas.length; i++) {
          const item = metas[i];
          const file = files[i];
          const url = item.pre_signature_url;
          const promise = uploadFile({ url, data: file, media_type: item.media_type }).then(
            code => {
              return uploadComplete({
                baseUrl,
                upload_success_list: [
                  {
                    key_name: item.key_name,
                    file_name: item.client_file_name,
                    file_size: file.size,
                  },
                ],
              });
            }
          );

          promises.push(promise);
        }
        resovle(promises);
      },
      err => {
        reject(err);
      }
    );
  });
}

// 上传多个文件2
export function uploadPhotoFiles({ files, baseUrl, id }) {
  const upload_file = [];
  if (files.length === 0) return Promise.reject();
  Array.from(files).forEach(file => {
    upload_file.push({
      client_file_name: file.name,
    });
  });
  return new Promise((resovle, reject) => {
    getFetchUploadUrl({ upload_file, baseUrl }).then(
      res => {
        const metas = res.upload_file_meta;
        const promises = [];
        for (let i = 0; i < metas.length; i++) {
          const item = metas[i];
          const file = files[i];
          const url = item.pre_signature_url;
          const promise = uploadFile({ url, data: file, media_type: item.media_type }).then(
            file => {
              const { name, size } = file;
              const suffix = name.split('.')[1];
              const params = {
                enc_album_id: id,
                //图片id
                key_name: item.key_name,
                //图片名称
                content_name: name,
                content_size: size,
                //资源类型：1-image，2-audio，3-video
                content_type: 1,
                suffix: suffix,
                /** resolution type 0-raw, 1-original, 2-2000, 3-3000, 4-4000 **/
                resolution_type: 2,
                //机位编号，默认 1
                camera_identifier: '1',
              };
              return addPhoto({ baseUrl, data: [params] });
            }
          );
          promises.push(promise);
        }
        resovle(promises);
      },
      err => {
        reject(err);
      }
    );
  });
}

// 获取banner信息接口
export const getBanner = ({ baseUrl, id }) => {
  const url = template(ALBUM_LIVE_GET_ALBUM_BANNER)({ baseUrl, broadcast_id: id });
  return reaquest({ url });
};

// 保存banner信息接口
export const updateBanner = ({ baseUrl, ...rest }) => {
  const url = template(ALBUM_LIVE_UPDATE_ALBUM_BANNER)({ baseUrl });
  return reaquest({ url, data: { ...rest } }, 'post');
};

// 保存banner链接
export const saveBannerUrl = ({ baseUrl, ...rest }) => {
  const url = template(ALBUM_LIVE_SAVE_BANNER_URL)({ baseUrl });
  return reaquest({ url, data: { ...rest } }, 'post');
};
// 获取分享信息接口
export const getShare = ({ baseUrl, id }) => {
  const url = template(ALBUM_LIVE_GET_ALBUM_SHARE)({ baseUrl, broadcast_id: id });
  return reaquest({ url });
};

// 保存分享信息接口
export const updateShare = ({ baseUrl, ...rest }) => {
  const url = template(ALBUM_LIVE_UPDATE_ALBUM_SHARE)({ baseUrl });
  return reaquest({ url, data: { ...rest } }, 'post');
};

export const queryAdver = ({ baseUrl, enc_album_id }) => {
  const url = template(ALBUM_LIVE_GET_ALBUM_ADVER)({ baseUrl, enc_album_id: enc_album_id });
  return reaquest({ url });
};
export const updateAdver = ({ baseUrl, ...rest }) => {
  const url = template(ALBUM_LIVE_UPDATE_ALBUM_ADVER)({ baseUrl });
  return reaquest({ url, data: { ...rest } }, 'post');
};

// ALBUM_LIVE_PROPOSE_DOWNLOAD_PACKAGE,
// ALBUM_LIVE_QUERY_PACKAGE_LIST,
// ALBUM_LIVE_QUERY_DOWNLOAD_LINK,

// 发起新的打包下载
export const proposeDownloadPackage = ({ baseUrl, ...rest }) => {
  const url = template(ALBUM_LIVE_PROPOSE_DOWNLOAD_PACKAGE)({ baseUrl });
  return reaquest({ url, data: { ...rest } }, 'post');
};

// 下一步打包下载接口-CN
export const nextDownloadPackage = ({ baseUrl, ...rest }) => {
  const url = template(ALBUM_LIVE_PACKAGE)({ baseUrl });
  return reaquest({ url, data: { ...rest } }, 'post');
};

// 查询相册是否存在正在打包下载的任务接口-CN
export const hasDownloadPackageJob = ({ baseUrl, enc_album_id }) => {
  const url = template(ALBUM_LIVE_HAS_DOWNLOAD_PACKAGE_JOB)({ baseUrl, enc_album_id });
  return reaquest({ url });
};

// 获取打包下载列表
export const getPackageList = ({ baseUrl, id }) => {
  const url = template(ALBUM_LIVE_QUERY_PACKAGE_LIST)({ baseUrl, id });
  return reaquest({ url });
};

// 获取打包下载链接
export const getDownloadLink = ({ baseUrl, id }) => {
  const url = template(ALBUM_LIVE_QUERY_DOWNLOAD_LINK)({ baseUrl, id });
  return reaquest({ url });
};

export const changeRetouchSwitch = ({ baseUrl, album_id, correct_enable, ...rest }) => {
  const url = template(ALBUM_LIVE_AIRETOUCH_SWITCH)({ baseUrl });
  const data = {
    album_id,
    correct_enable,
    ...rest,
  };
  return reaquest({ url, data }, 'post');
};

export const getAIRetouchPreset = ({ baseUrl, enc_album_id, provider = '' }) => {
  const url = template(ALBUM_LIVE_GET_AIRETOUCH_PRESET_PROVIDER)({
    baseUrl,
    enc_album_id,
    provider,
  });
  return reaquest({ url });
};

export const saveAIRetouchPreset = ({ baseUrl, enc_album_id, topic_code, provider }) => {
  const url = template(ALBUM_LIVE_SAVE_AIRETOUCH_PRESET)({ baseUrl });
  const data = {
    enc_album_id,
    topic_code,
    provider,
  };
  return reaquest({ url, data }, 'post');
};

// 获取修图点数
export const getRetouchingPoints = ({ baseUrl, customer_id }) => {
  const url = template(ALBUM_LIVE_GET_RETOUCHING_POINTS)({ baseUrl, customer_id });
  return reaquest({ url });
};

// GET_PFC_TOPIC_CATEGORIES
export const getTopicCategories = ({ galleryBaseUrl }) => {
  const url = template(GET_PFC_TOPIC_CATEGORIES)({ galleryBaseUrl });
  return reaquest({ url });
};
// GET_PFC_TOPIC_EFFECTS_PROVIDER
export const getTopicEffects = ({ galleryBaseUrl, provider = '' }) => {
  const url = template(GET_PFC_TOPIC_EFFECTS_PROVIDER)({ galleryBaseUrl, provider });
  return reaquest({ url });
};

// ALBUM_LIVE_Delete_DOWNLOAD_LINK
// 获取打包下载链接
export const deleteDownloadLink = ({ baseUrl, id }) => {
  const url = template(ALBUM_LIVE_Delete_DOWNLOAD_LINK)({ baseUrl, id });
  return reaquest({ url });
};

// 保存直播间皮肤
export const saveLiveSkin = ({ baseUrl, ...rest }) => {
  const url = template(ALBUM_LIVE_SAVE_SKIN)({ baseUrl });
  return reaquest({ url, data: { ...rest } }, 'post');
};
// 删除直播间皮肤
export const deleteLiveSkin = ({ baseUrl, id }) => {
  const url = template(ALBUM_LIVE_DEL_SKIN)({ baseUrl, id });
  return reaquest({ url });
};
// 获取用户所有的直播间皮肤
export const getLiveSkinList = ({ baseUrl, type, skin_category_id }) => {
  const url = template(ALBUM_LIVE_GET_SKIN_LIST)({ baseUrl, type, skin_category_id });
  return reaquest({ url });
};
// 获取用户自定义皮肤数量
export const getCustomerSkinCount = ({ baseUrl }) => {
  const url = template(ALBUM_LIVE_GET_CUSTOMER_SKIN_COUNT)({ baseUrl });
  return reaquest({ url });
};

// 皮肤分类列表
export const get_skin_category_list = ({ baseUrl }) => {
  const url = template(ALBUM_LIVE_GET_SKIN_CATEGORY_LIST)({ baseUrl });
  return reaquest({ url });
};

// 水印开关
export const updateWatermarkEnable = ({ baseUrl, ...reset }) => {
  const url = template(ALBUM_LIVE_UPDATE_WATERMARK_ENABLE)({ baseUrl });
  return reaquest({ url, data: { ...reset } }, 'post');
};
// 水印列表
export const getWatermarkList = ({ baseUrl, id }) => {
  const url = template(ALBUM_LIVE_GET_WATERMARK_LIST)({ baseUrl, id });
  return reaquest({ url });
};
// 水印设置新增/修改
export const saveWatermark = ({ baseUrl, ...reset }) => {
  const url = template(ALBUM_LIVE_SAVE_WATERMARK)({ baseUrl });
  return reaquest({ url, data: { ...reset } }, 'post');
};
// 水印图删除
export const removeWatermark = ({ baseUrl, id }) => {
  const url = template(ALBUM_LIVE_REMOVE_WATERMARK)({ baseUrl, id });
  return reaquest({ url });
};

// 获取摄影师列表
export const getCameramanList = ({ baseUrl, id }) => {
  const url = template(ALBUM_LIVE_GET_CAMERAMAN_LIST)({ baseUrl, id });
  return reaquest({ url });
};

// 获取摄影师列表
export const getCameramanInfo = ({ baseUrl, phone }) => {
  const url = template(ALBUM_LIVE_GET_CAMERAMAN_INFO)({ baseUrl, phone });
  return reaquest({ url });
};

// 新增摄影师
export const addCameraman = ({ baseUrl, ...reset }) => {
  const url = template(ALBUM_LIVE_ADD_CAMERAMAN)({ baseUrl });
  return reaquest({ url, data: { ...reset } }, 'post');
};

// 删除摄影师
export const removeCameraman = ({ baseUrl, id, customer_id }) => {
  const url = template(ALBUM_LIVE_DEL_CAMERAMAN)({ baseUrl, id, customer_id });
  return reaquest({ url });
};

/**
 *  出参
 *  "customer_id"
 *  "phone"
 *  "name"
 *  "photo_count"
 */
export const get_pho_role_list = ({ baseUrl, album_id }) => {
  const url = template(ALBUM_LIVE_GET_PHO_ROLE_LIST)({ baseUrl, album_id });
  return reaquest({ url });
};

// "enc_album_id":"",
// //图片id
// "enc_content_id":"",
// //图片名称
// "content_name":"",
// "content_size":12322421,
// //资源类型：1-image，2-audio，3-video
// "content_type":1，
// "suffix":"jpg",
// /** resolution type 0-raw, 1-original, 2-2000, 3-3000, 4-4000 **/
// "resolution_type": 2,
// //机位编号，默认 1
// "camera_identifier":"1",
// "raw_content":{
//     "raw_content_size":123242,
//     "enc_content_id":""
// },
// // 上传方式 CLICK-点选上传，DIRECT-边拍边传，MANUAL-人工上传
// "add_method" : "CLICK",
// "add_source" : "APP"

export const add_album_content = ({ baseUrl, ...rest }) => {
  const url = template(ALBUM_LIVE_ADD_ALBUM_CONTENT)({ baseUrl });
  return reaquest({ url, data: rest }, 'post');
};

export const replace_album_content = ({ baseUrl, ...rest }) => {
  const url = template(ALBUM_LIVE_REPLACE_ALBUM_CONTENT)({ baseUrl });
  return reaquest({ url, data: rest }, 'post');
};

// current_page=1 当前页数
// page_size=10 每页数量
// customer_ids 摄影师cusid
// album_id=52 相册id
// is_client_show 是否显示
// replace 是否替换
// startTime 开始时间
// endTime 结束时间
// imageName 图片名称
// sort 排序

export const list_contents = ({
  baseUrl,
  album_id,
  current_page,
  page_size,
  customer_ids,
  is_client_show,
  replace,
  startTime,
  endTime,
  imageName,
  sort,
  category_id,
  select_status, // 新增挑图状态
}) => {
  const url = template(ALBUM_LIVE_lIST_CONTENTS)({
    baseUrl,
    album_id,
    current_page,
    page_size,
    customer_ids,
    is_client_show,
    replace,
    startTime,
    endTime,
    imageName,
    sort,
    category_id,
    select_status,
  });
  return reaquest({ url });
};

// "enc_album_id":"相册加密ID",
// "enc_content_id":"content加密ID",
// "client_show":true

export const update_client_show = ({ baseUrl, ...rest }) => {
  const url = template(UPDATE_CLIENT_SHOW)({
    baseUrl,
  });
  const bodyParams = {
    ...rest,
  };
  return xhr.post(url, bodyParams);
};

// 查询用户修图剩余点数，剩余场数以及当前album修图计费方式
export const queryCorrectStatics = ({ baseUrl, customer_id, album_id }) => {
  const url = template(ALBUM_LIVE_CORRECT_STATICS)({ baseUrl, customer_id, album_id });
  return reaquest({ url });
};
export const saveTopicImport = ({ baseUrl, base_topic_code, provider, topic_name }) => {
  const url = template(ALBUM_LIVE_SAVE_AIRETOUCH_IMPORT)({ baseUrl });
  const data = {
    base_topic_code,
    provider,
    topic_name,
  };
  return reaquest({ url, data }, 'post');
};
export const removeTopicImport = ({ baseUrl, topic_code }) => {
  const url = template(ALBUM_LIVE_REMOVE_AIRETOUCH_IMPORT)({ baseUrl });
  const data = {
    topic_code,
  };
  return reaquest({ url, data }, 'post');
};
// 打开修图接口需要修改
export const updateCorrectEnable = ({ baseUrl, ...rest }) => {
  const url = template(ALBUM_LIVE_UPDATE_CORRECT_ENABLE)({ baseUrl });
  return reaquest({ url, data: rest }, 'post');
};

/**
 * 删除图片接口
 * @param {object} param
 * @param {string} param.baseUrl
 * @param {string[]} param.ids
 */
export const deleteImage = ({ baseUrl, ids }) => {
  const url = template(ALBUM_LIVE_DELETE_IMAGE)({ baseUrl });
  const bodyParams = ids;
  return reaquest({ url, data: bodyParams }, 'post');
};

/**
 * 置顶图片接口
 * @param {object} param
 * @param {string} param.enc_album_content_id
 * @param {boolean} param.is_pinned
 */
export const pinnedImage = ({ baseUrl, enc_album_content_id, is_pinned }) => {
  const url = template(ALBUM_LIVE_PINNED_IMAGE)({ baseUrl, enc_album_content_id, is_pinned });
  return reaquest({ url });
};

/**
 * 批量移动照片接口
 * @param {object} param
 * @param {string} param.category_id 分类id
 * @param {string[]} param.content_list 图片enc_album_content_rel_id
 * @param {string} param.enc_album_id 相册id
 */
export const changeContentGroup = ({ baseUrl, category_id, content_list, enc_album_id }) => {
  const url = template(ALBUM_LIVE_CHANGE_CONTENT_GROUP)({ baseUrl });
  const bodyParams = { category_id, content_list, enc_album_id };
  return reaquest({ url, data: bodyParams }, 'post');
};

export const getPVConfig = ({ baseUrl, enc_album_id }) => {
  const url = template(ALBUM_LIVE_GET_PV_CONFIG)({ baseUrl, enc_album_id });
  return reaquest({ url }, 'get');
};

export const savePVConfig = ({ baseUrl, ...params }) => {
  const url = template(ALBUM_LIVE_SAVE_PV_CONFIG)({ baseUrl });
  return reaquest({ url, data: params }, 'post');
};

/**
 * 获取B端访问设置信息
 * @param {Object} param
 * @param {string} param.baseUrl
 * @param {string} param.enc_broadcast_id
 */
export const getAccessInfo = ({ baseUrl, enc_broadcast_id }) => {
  const url = template(ALBUM_LIVE_GET_ACCESS)({ baseUrl, enc_broadcast_id });
  return reaquest({ url });
};

/**
 * 保存访问设置
 * @param {Object} param
 * @param {string} param.enc_broadcast_id 相册id
 * @param {boolean} param.password_enable 是否开启密码
 * @param {string} param.password 密码
 * @param {string} param.access_title 标题
 * @param {string} param.password_input_tip 提示
 */
export const saveAccessSetting = ({ baseUrl, ...rest }) => {
  const url = template(ALBUM_LIVE_SAVE_ACCESS)({ baseUrl });
  const bodyParams = { ...rest };
  return reaquest({ url, data: bodyParams }, 'post');
};

/**
 * AI识别B端配置接口
 * @param {Object} param
 * @param {string} param.baseUrl
 * @param {string} param.enc_broadcast_id 加密album id
 * @param {boolean} param.query_by_pic 是否开启根据人脸查找照片
 * @param {boolean} param.auto_detect 是否开始自动识别照片人脸
 *
 */
export const saveConfigAiFace = ({ baseUrl, ...rest }) => {
  const url = template(ALBUM_LIVE_GET_AI_CONFIG)({ baseUrl });
  const bodyParams = { ...rest };
  return reaquest({ url, data: bodyParams }, 'post');
};

/**
 * B端获取AI人脸识别配置
 * @param {Object} param
 * @param {string} param.baseUrl
 * @param {string} param.enc_broadcast_id
 *
 */
export const getConfigAiFace = ({ baseUrl, enc_broadcast_id }) => {
  const url = template(ALBUM_LIVE_GET_AI_FACE_CONFIG)({ baseUrl, enc_broadcast_id });
  return reaquest({ url });
};

/**
 * B端查询自定义广告列表
 * @param {Object} param
 * @param {string} param.baseUrl
 * @param {string} param.enc_album_id
 *
 */
export const getAdList = ({ baseUrl, enc_album_id }) => {
  const url = template(ALBUM_LIVE_GET_AD_LIST)({ baseUrl, enc_album_id });
  return reaquest({ url });
};

/**
 * B端保存修改自定义广告设置
 * @param {Object} param
 * @param {string} param.baseUrl
 * @param {string} param.current_ad_type 当前设置的广告类型（1-无广告 2-自定义侧边广告 3-自定义底部广告）
 * @param {Object} adItem 广告对象
 * @param {string} adItem.id 广告id（必传字段）
 * @param {string} adItem.enc_album_id 加密的相册ID（必传字段）
 * @param {string} adItem.ad_type 广告类型：1-无广告 2-自定义侧边广告 3-自定义底部广告，（必传字段）注意：ad_type需和current_ad_type一致
 * @param {string} adItem.ad_time 广告持续时间(单位秒)，注意：当current_ad_type=2时，必传，当current_ad_type=3可以不传
 * @param {string} adItem.ad_text 广告文案，（必传字段）
 * @param {string} adItem.button_content_type 按钮内容类型：1-图片 2-文案，注意：current_ad_type=2时，必传，当current_ad_type=3可以不传
 * @param {string} adItem.button_content_value 按钮内容值，注意：current_ad_type=2时，必传，当current_ad_type=3可以不传
 * @param {string} adItem.button_function_type 按钮功能类型：1-打开图片 2-打开链接 3-拨打电话（必传字段）
 * @param {string} adItem.button_function_value 按钮功能值（必传字段）
 *
 */
export const updateAdList = ({ baseUrl, ...rest }) => {
  const url = template(ALBUM_LIVE_SAVE_AD)({ baseUrl });
  return reaquest({ url, data: { ...rest } }, 'post');
};

/**
 * 校验图片名称重复
 * @param {Object} param0
 * @param {string} param0.baseUrl
 * @param {string} param0.enc_album_id
 * @param {string} param0.image_name
 */
export const check_img_repeat = ({ baseUrl, enc_album_id, image_name }) => {
  const bodyParams = {
    enc_album_id,
    image_name,
  };
  const url = template(ALBUM_LIVE_CHECK_IMG_REPEAT)({ baseUrl });
  return reaquest({ url, data: bodyParams }, 'post');
};

/* --------------------------------[CN-登记表单]------------------------------- */

/**
 * B端获取登记表单配置
 * @param {Object} param0
 * @param {string} param0.baseUrl 接口baseUrl地址
 * @param {string} param0.enc_album_id 相册加密id
 */
export const get_register_config = ({ baseUrl, enc_album_id }) => {
  const url = template(ALBUM_LIVE_GET_REGISTER_CONFIG)({ baseUrl, enc_album_id });
  return reaquest({ url });
};

/**
 * B端保存登记表单配置
 * @param {Object} param0
 * @param {string} param0.baseUrl 接口baseUrl地址
 * @param {string} param0.uidpk uidpk
 * @param {string} param0.enc_album_id 相册加密id
 * @param {boolean} param0.enabled 客资收集开关 true-开启 false-关闭
 * @param {1|2} param0.popup_type 客资收集时机 1-访问相册时 2-点击查看大图时
 * @param {boolean} param0.banner_enabled 顶部宣传图开关 true-开启 false-关闭
 * @param {string} param0.title 标题
 * @param {Array} param0.field_config 设置客资信息收集项
 * @param {string} param0.button_text 广告标题
 */
export const save_register_config = ({ baseUrl, ...rest }) => {
  const url = template(ALBUM_LIVE_SAVE_REGISTER_CONFIG)({ baseUrl });
  return reaquest({ url, data: { ...rest } }, 'post');
};

/**
 * B端获取登记表单查看客资名单信息列表(分页)
 * @param {Object} param0
 * @param {string} param0.baseUrl 接口baseUrl地址
 * @param {string} param0.enc_album_id 相册加密id
 * @param {number} param0.page_num 页码
 * @param {number} param0.page_size 每页条数
 */
export const get_register_form_list = ({ baseUrl, ...rest }) => {
  const url = template(ALBUM_LIVE_GET_REGISTER_FORM_INFO)({ baseUrl, ...rest });
  return reaquest({ url });
};

/**
 * B端导出信息到Excel
 * @param {Object} param0
 * @param {string} param0.baseUrl 接口baseUrl地址
 * @param {string} param0.enc_album_id 相册加密id
 */
export const export_register_form_list = ({ baseUrl, enc_album_id }) => {
  const url = template(ALBUM_LIVE_EXPORT_REGISTER_FORM_INFO)({ baseUrl, enc_album_id });
  return url;
};

/**
 * 登记表单-收集项删除
 * @param {Object} param0
 * @param {string} param0.baseUrl 接口baseUrl地址
 * @param {string} param0.enc_album_id 相册加密id
 * @param {number} param0.field_id 收集项uidpk
 */
export const del_form_field = ({ baseUrl, enc_album_id, field_id }) => {
  const url = template(ALBUM_LIVE_DEL_FORM_FIELD)({ baseUrl });
  const bodyParams = { enc_album_id, field_id };
  return reaquest({ url, data: bodyParams }, 'post');
};

/* --------------------------------[CN-登记表单]------------------------------- */

/**
 * 创建重新打水印任务
 * @param {object} param0
 * @param {string} param0.baseUrl 接口baseUrl地址
 * @param {string} param0.enc_album_id 相册加密id
 * @param {number} param0.category_id 分类id
 */
export const createRewatermarkTask = ({ baseUrl, ...rest }) => {
  const url = template(ALBUM_LIVE_CREATE_REWATERMARK_TASK)({ baseUrl });
  return reaquest({ url, data: { ...rest } }, 'post');
};

/**
 * 查询重新打水印任务状态
 * @param {object} param0
 * @param {string} param0.baseUrl 接口baseUrl地址
 * @param {string} param0.enc_album_id 相册加密id
 */
export const queryRewatermarkTaskStatus = ({ baseUrl, enc_album_id }) => {
  const url = template(ALBUM_LIVE_QUERY_REWATERMARK_TASK)({ baseUrl, enc_album_id });
  return reaquest({ url });
};

/**
 * 取消重新打水印任务
 * @param {object} param0
 * @param {string} param0.baseUrl 接口baseUrl地址
 * @param {string} param0.enc_album_id 相册加密id
 */
export const cancelRewatermarkTaskStatus = ({ baseUrl, enc_album_id }) => {
  const url = template(ALBUM_LIVE_CANCEL_REWATERMARK_TASK)({ baseUrl, enc_album_id });
  return reaquest({ url });
};

/* --------------------------------[CN-挑图师]------------------------------- */

/**
 * B端查询AI挑图设置信息
 * @param {Object} param0
 * @param {string} param0.baseUrl 接口baseUrl地址
 * @param {string} param0.enc_album_id 相册加密id
 */
export const get_AIPicker_config = ({ baseUrl, enc_album_id }) => {
  const url = template(ALBUM_LIVE_GET_PICKER_CONFIG)({ baseUrl, enc_album_id });
  return reaquest({ url });
};

/**
 * B端获取人脸列表以及图片接口
 * @param {object} param0
 * @param {string} param0.baseUrl 接口baseUrl地址
 * @param {string} param0.enc_album_id 相册加密id
 * @returns
 */
export const getFaceList = ({ baseUrl, enc_album_id }) => {
  const url = template(ALBUM_LIVE_GET_FACE_LIST)({ baseUrl, enc_album_id });
  return reaquest({ url });
};

/**
 * B端保存AI挑图设置信息
 * @param {Object} param0
 * @param {string} param0.baseUrl 接口baseUrl地址
 * @param {number} param0.id AI挑图设置ID
 * @param {string} param0.enc_album_id 相册加密id
 * @param {0|1} param0.setting_status 是否开启AI挑图师:0-关闭 1-开启
 * @param {0|1} param0.flg_close_eye 是否检测闭眼：0-不检测 1-检测
 * @param {number} param0.close_eye_setting 符合条件的照片不检测闭眼设置（参数值为：2,3,4,5,6,7,8,9,10）
 * @param {0|1} param0.flg_blurry 是否检测模糊:0-不检测 1-检测
 * @param {0|1} param0.flg_under_exposure 是否检测欠曝：0-不检测，1-检测
 * @param {1|2|3} param0.under_exposure_value 欠曝敏感度检测值：1-弱  2-中(默认值) 3-强
 * @param {0|1} param0.flg_over_exposure 是否检测过曝：0-不检测 1-检测
 * @param {1|2|3} param0.over_exposure_value 过曝敏感度检测值:1-弱  2-中(默认值) 3-强
 * @param {0|1} param0.flg_repeat_photo 是否开启重复照片择优展示:0-不开启 1-开启
 * @param {number} param0.repeat_photo_value 重复照片对比范围（单位:minute）,参数值为：（1,5,10,15）
 */
export const save_AIPicker_config = ({ baseUrl, ...rest }) => {
  const url = template(ALBUM_LIVE_SAVE_PICKER_CONFIG)({ baseUrl });
  return reaquest({ url, data: { ...rest } }, 'post');
};

/**
 *
 * 添加分组接口
 * @param {object} param0
 * @param {string} param0.baseUrl 接口baseUrl地址
 * @param {string} param0.enc_broadcast_id 相册加密id
 * @param {string} param0.full_name 分组名称
 * @param {string} param0.phone_number 分组电话
 * @param {string} param0.email 分组邮件
 * @param {string} param0.enc_image_id 分组图片id
 * @param {string} param0.create_source 分组create_source 创建源：1-B端创建 2-C端创建
 * @returns
 */
export const addFaceGroup = ({ baseUrl, ...rest }) => {
  const url = template(ALBUM_LIVE_ADD_FACE_GROUP)({ baseUrl });
  return reaquest({ url, data: { ...rest } }, 'post');
};

/**
 * 验证是否可以打开开关
 * @param {Object} param0
 * @param {string} param0.baseUrl 接口baseUrl地址
 * @param {string} param0.id ai挑图设置的id
 */
export const check_re_open = ({ baseUrl, id }) => {
  const url = template(ALBUM_LIVE_VALIDATE_SWITCH)({ baseUrl, id });
  return reaquest({ url });
};

/* --------------------------------[CN-挑图师]------------------------------- */

/**
 * 批量设置图片挑图通过/未通过
 * @param {Object} param0
 * @param {string} param0.baseUrl 接口baseUrl地址
 * @param {string} param0.enc_album_id 相册加密id
 * @param {Array} param0.enc_album_content_ids 加密图片id数组
 * @param {number} param0.select_status 2-挑图通过 3-通图未通过
 */
export const change_ai_select = ({ baseUrl, ...rest }) => {
  const url = template(ALBUM_LIVE_BATCH_SET_PASS)({ baseUrl });
  return reaquest({ url, data: { ...rest } }, 'post');
};
/**
 *
 * 修改图片的分组信息接口
 * @param {object} param0
 * @param {string} param0.baseUrl 接口baseUrl地址
 * @param {string} param0.enc_image_id 相册加密id
 * @param {Array} param0.source_group_list
 * @param {Array} param0.target_group_list
 * @returns
 */
export const updateFaceGroup = ({ baseUrl, ...rest }) => {
  const url = template(ALBUM_LIVE_UPDATE_FACE_GROUP)({ baseUrl });
  return reaquest({ url, data: { ...rest } }, 'post');
};

/**
 * B端修改新增full name,email,phone number
 * @param {object} param0
 * @param {string} param0.baseUrl 接口baseUrl地址
 * @param {number} param0.detailId
 * @param {string} param0.email
 * @param {string} param0.encAlbumId
 * @param {string} param0.fullName
 * @param {string} param0.phoneNumber
 * @param {number} [param0.submit_Id=1]
 * @returns
 */
export const updateCustomerInfo = ({ baseUrl, ...rest }) => {
  const url = template(ALBUM_LIVE_UPDATE_CUSTOMER_INFO)({ baseUrl });
  return reaquest({ url, data: { ...rest } }, 'post');
};
