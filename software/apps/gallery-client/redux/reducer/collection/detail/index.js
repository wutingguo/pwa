import { fromJS, isImmutable } from 'immutable';
import { get, isEmpty, merge } from 'lodash';

import { convertObjIn } from '@resource/lib/utils/typeConverter';

import { API_FAILURE, API_SUCCESS, UPLOAD_COMPLETE } from '@resource/lib/constants/actionTypes';
import {
  COLLECTION_LIMIT_PHOTO_DOWNLOAD,
  GET_SET_VIDEO_BY_SET,
  SAAS_CLIENT_GALLERY_CHECKOUT_DOWNLOAD_PIN,
  SAAS_CLIENT_GALLERY_GET_DETAIL,
  SAAS_CLIENT_GALLERY_GET_LAST_TIME_ZIP_UUID,
  SAAS_CLIENT_GALLERY_GET_SETS_AND_RESOLUTION,
  SAAS_CLIENT_GALLERY_GET_ZIP_DOWNLOAD_LINK,
  SAAS_CLIENT_SLIDESHOW_PREVIEW_GET_DETAIL,
} from '@resource/lib/constants/apiUrl';
import codes from '@resource/lib/constants/responseCode';

import { GET_FACE_IMGS } from '@apps/gallery-client-mobile/constants/apiUrl';

const defaultState = fromJS({ isLoadCompleted: false });

const detail = (state = defaultState, action) => {
  switch (action.type) {
    case API_SUCCESS:
      switch (action.apiPattern.name) {
        case SAAS_CLIENT_GALLERY_GET_DETAIL: {
          const ret_code = get(action.response, 'ret_code');

          // 选片集已经过期
          if (ret_code === codes.C_420301) {
            return state.merge({
              isExpired: true,
              isLoadCompleted: true,
            });
          }

          // collections 删除查询不到数据
          if (ret_code === codes.C_404300) {
            return state.merge({
              isNoData: true,
              isLoadCompleted: true,
            });
          }

          const item = convertObjIn(get(action.response, 'data'));

          window.logEvent.setBaseParmas({
            CollectionID: item.collection_uid,
          });

          return state.merge(fromJS(item), { isLoadCompleted: true });
        }

        case SAAS_CLIENT_GALLERY_CHECKOUT_DOWNLOAD_PIN: {
          const status = get(action.response, 'data');
          if (isEmpty(status)) return state;

          const {
            common_download_status,
            common_gallery_download_status,
            common_single_photo_download_status,
            common_pin_status,
            is_pin_valid,
          } = status;

          return state.update('download_setting', download => {
            return download.merge(
              fromJS({
                common_download_status,
                common_gallery_download_status,
                common_single_photo_download_status,
                common_pin_status,
                is_pin_valid,
              })
            );
          });
        }

        case SAAS_CLIENT_GALLERY_GET_SETS_AND_RESOLUTION: {
          const sets_resolution_enum = get(action.response, 'data');
          if (isEmpty(sets_resolution_enum)) return state;

          const newState = state.updateIn(['download_setting', 'resolution'], () => {
            return fromJS(get(sets_resolution_enum, 'resolution'));
          });
          return newState.updateIn(['download_setting', 'sets_setting'], () => {
            return fromJS(get(sets_resolution_enum, 'sets_setting'));
          });
        }

        case SAAS_CLIENT_GALLERY_GET_LAST_TIME_ZIP_UUID: {
          const zip_uuid = get(action.response, 'data');
          if (isEmpty(zip_uuid)) return state;

          return state.setIn(['download_setting', 'zip_uuid'], zip_uuid);
        }

        case SAAS_CLIENT_GALLERY_GET_ZIP_DOWNLOAD_LINK: {
          const download_link = get(action.response, 'data');
          if (!download_link) return state;

          return state.setIn(['download_setting', 'download_link'], download_link);
        }
        case COLLECTION_LIMIT_PHOTO_DOWNLOAD: {
          const downloadImgInfo = get(action.response, 'data');
          if (!downloadImgInfo) return state;
          return state.setIn(['downloadImgInfo'], downloadImgInfo);
        }
        case GET_FACE_IMGS: {
          if (!get(action.response, 'data')) return state;
          const faceImgs = get(action.response, 'data.group_infos');
          if (!faceImgs) return state;
          return state.setIn(['faceImgs'], faceImgs);
        }
        case GET_SET_VIDEO_BY_SET: {
          const data = get(action.response, 'data') || {};
          return state.update('set_video_info', () => {
            return fromJS({
              ...data,
              showLoding: data.video_source === 2,
            });
          });
        }
        case SAAS_CLIENT_SLIDESHOW_PREVIEW_GET_DETAIL: {
          const data = get(action.response, 'data');
          if (!data) {
            return state.updateIn(['set_video_info', 'showLoding'], () => false);
          }
          return state.update('set_video_info', set_video_info => {
            return fromJS({
              ...set_video_info.toJS(),
              video_id: data.id ?? +data.id,
              cover_img: data.cover_img,
              cover_img_id: data.cover_img?.enc_image_uid,
              showLoding: false,
            });
          });
        }
        default: {
          return state;
        }
      }
    case API_FAILURE: {
      switch (action.apiPattern.name) {
        case SAAS_CLIENT_GALLERY_GET_DETAIL: {
          return state.merge({ isLoadCompleted: true });
        }

        default: {
          return state;
        }
      }
    }
    default: {
      return state;
    }
  }
};

export default detail;
