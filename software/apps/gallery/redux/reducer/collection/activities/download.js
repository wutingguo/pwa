import { fromJS } from 'immutable';
import { convertObjIn } from '@resource/lib/utils/typeConverter';
import {
  SAAS_GET_PACKAGE_DOWNLOAD_RECORD_LIST,
  SAAS_GET_SINGLE_DOWNLOAD_RECORD_LIST
} from '@resource/lib/constants/apiUrl';
import { API_SUCCESS } from '@resource/lib/constants/actionTypes';
import { get } from 'lodash';

const initState = fromJS({
  packageDownloadRecords: [],
  singlePhotoDownloadRecords: []
});

export default (state = initState, action) => {
  switch (action.type) {
    case API_SUCCESS:
      switch (action.apiPattern.name) {
        case SAAS_GET_PACKAGE_DOWNLOAD_RECORD_LIST: {
          const list = get(action.response, 'data');
          if (list) {
            return state.set('packageDownloadRecords', list);
          }
          break;
        }
        case SAAS_GET_SINGLE_DOWNLOAD_RECORD_LIST: {
          const list = get(action.response, 'data');
          if (__isCN__) {
            const CNList = list.reduce((res, item) => {
              const detail = item.details_vo.records || [];
              res = res.concat(detail);
              return res;
            }, []);
            return state.set('singlePhotoDownloadRecords', CNList);
          }
          if (list) {
            return state.set('singlePhotoDownloadRecords', list);
          }
          break;
        }
      }
    default:
      return state;
  }
};
