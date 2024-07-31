import { GET_LOADING_INFO } from '@apps/live-photo-client-mobile/constants/actionTypes';
import { getLoadingInfo } from '@apps/live-photo-client-mobile/servers';
import getDataFromState from '@apps/live-photo-client-mobile/utils/getDataFromState';

function getLoadingInfoAction() {
  return async (dispatch, getState) => {
    const { urls, qs } = getDataFromState(getState());
    const baseUrl = urls.get('saasBaseUrl');
    const enc_broadcast_id = qs.get('enc_broadcast_id');
    const params = {
      baseUrl,
      enc_broadcast_id,
    };
    const res = await getLoadingInfo(params);
    dispatch({
      type: GET_LOADING_INFO,
      data: res?.data,
    });
  };
}

export default {
  getLoadingInfoAction,
};
