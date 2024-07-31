import { fromJS } from 'immutable';
import { get, isEmpty } from 'lodash';
import { API_SUCCESS, API_FAILURE } from '@resource/lib/constants/actionTypes';
import { convertObjIn } from '@resource/lib/utils/typeConverter';
import {
  SAAS_SLIDE_GET_PROJECT_LIST,
  SAAS_SLIDE_CREATE_PROJECT,
  SAAS_SLIDE_MODIFY_PROJECT,
  SAAS_SLIDE_DELETE_PROJECT,
  SAAS_SLIDE_COPY_PROJECT,
  SAAS_SLIDE_GET_DOWNLOAD_URL,
  SAAS_SLIDE_GET_VIDEO_STATUS
} from '@resource/lib/constants/apiUrl';
import { makdeVideoStausEnum } from '@apps/slide-show/constants/strings';

const collectionsList = (state = fromJS([]), action) => {
  // console.log("action....",action)
  switch (action.type) {
    case API_SUCCESS:
      switch (action.apiPattern.name) {
        case SAAS_SLIDE_GET_PROJECT_LIST:
          const items = convertObjIn(get(action.response, 'data.records'));
          return fromJS(items);

        case SAAS_SLIDE_CREATE_PROJECT:
          const createItem = convertObjIn(get(action.response, 'data'));
          console.log('createItem: ', createItem);
          return !isEmpty(createItem) ? state.unshift(fromJS(createItem)) : state;

        case SAAS_SLIDE_MODIFY_PROJECT:
          const updateItem = convertObjIn(get(action.response, 'data'));
          const updateSlideshowUid = get(updateItem, 'id');
          const updateIndex = state.findIndex(item => item.get('id') === updateSlideshowUid);
          return updateIndex !== -1
            ? state.setIn([updateIndex, 'slides_name'], get(updateItem, 'slides_name'))
            : state;

        case SAAS_SLIDE_DELETE_PROJECT:
          const deleteSlideshowUid = get(convertObjIn(action.response), 'data');
          const deleteIndex = state.findIndex(item => item.get('id') === deleteSlideshowUid);
          return deleteIndex !== -1 ? state.delete(deleteIndex) : state;

        case SAAS_SLIDE_COPY_PROJECT:
          const cloneItem = convertObjIn(get(action.response, 'data'));
          return !isEmpty(cloneItem) ? state.unshift(fromJS(cloneItem)) : state;

        case SAAS_SLIDE_GET_DOWNLOAD_URL:
          const { projectId, definition } = action.apiPattern.params;
          const retCode = get(action.response, 'ret_code');
          const slideshowDownloadUrl = get(action.response, 'data');
          const convertState = state;
          if (retCode === 200000) {
            // 已生成
            return convertState.map((slideshow, index) => {
              if (slideshow.get('id') === projectId) {
                let newSlideShow = slideshow.merge({
                  slideshowDownloadUrl,
                  project_status: 2,
                  video_status: 2
                });

                newSlideShow = newSlideShow.setIn(
                  ['makeVideoStatus', String(definition)],
                  makdeVideoStausEnum.generateSuccess
                );
                return newSlideShow;
              }
              return slideshow;
            });
          } else if (retCode === 202328) {
            // 生成中
            return convertState.map(slideshow => {
              if (slideshow.get('id') === projectId) {
                let newSlideShow = slideshow.merge({ video_status: 1 });
                newSlideShow = newSlideShow.setIn(
                  ['makeVideoStatus', String(definition)],
                  makdeVideoStausEnum.generating
                );
                return newSlideShow;
              }
              return slideshow;
            });
          } else if (retCode === 420320) {
            // 未生成
            return convertState.map(slideshow => {
              if (slideshow.get('id') === projectId) {
                return slideshow.merge({ video_status: 0 }); // ?
              }
              return slideshow;
            });
          } else if (retCode === 500328) {
            // 生成失败
            return convertState.map(slideshow => {
              if (slideshow.get('id') === projectId) {
                let newSlideShow = slideshow;
                newSlideShow = newSlideShow.setIn(
                  ['makeVideoStatus', String(definition)],
                  makdeVideoStausEnum.generateFaile
                );
                return newSlideShow;
              }
              return slideshow;
            });
          }

        case SAAS_SLIDE_GET_VIDEO_STATUS: {
          const { project_id } = action.apiPattern.params;
          const retCode = get(action.response, 'ret_code');
          let convertState = state;
          // console.log('convertState...', convertState.toJS());
          if (retCode === 200000) {
            const currentSlideShowIndex = convertState.findIndex(
              slideshow => slideshow.get('id') === project_id
            );
            let revertData = Object.assign({}, action.response.data);
            convertState = convertState.setIn(
              [currentSlideShowIndex, 'makeVideoStatus'],
              fromJS(revertData)
            );
          }
          return convertState;
        }

        default:
          return state;
      }

    default:
      return state;
  }
};

export default collectionsList;
