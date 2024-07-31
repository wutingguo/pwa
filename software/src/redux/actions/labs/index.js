import request from '@resource/lib/utils/request';
import {GET_GATEGORY_LIST, GET_LABS_LIST, CREATE_LAB, DELETE_LAB, GET_TEMPLATE_SIZE_LIST} from '@resource/lib/constants/apiUrl';
import {UPDATE_LAB_STATE} from '@resource/lib/constants/actionTypes';

// 获取category列表
export const getCategoryList = () => {
  return request({
    url: GET_GATEGORY_LIST,
    hostType: 'baseUrl'
  });
}
// 获取lab列表
export const getLabList = () => {
  return request({
    url: GET_LABS_LIST,
    hostType: 'baseUrl',
    isConvert: false
  });
}
// 新增lab
export const createLab = bodyParams => {
  return request({
    url: CREATE_LAB,
    hostType: 'galleryBaseUrl',
    method: 'POST',
    bodyParams
  });
}
// 删除lab
export const deleteLab = bodyParams => {
  return request({
    url: DELETE_LAB,
    hostType: 'galleryBaseUrl',
    method: 'POST',
    bodyParams
  });
}

// 获取模板列表
export const getTemplateSizeList = query => {
  return request({
    url: GET_TEMPLATE_SIZE_LIST,
    hostType: 'baseUrl',
    query
  })
}
// 更新lab state
export const updateLabState = (payload) => ({
  type: UPDATE_LAB_STATE,
  payload
})