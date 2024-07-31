import { wrapPromise } from '@resource/lib/utils/promise';

import { SAAS_EMAIL_SHARE_GET_DIRECT_LINK } from '@resource/lib/constants/apiUrl';

import { CALL_API } from '@resource/lib/middlewares/api';

import getDataFromState from '@apps/gallery/utils/getDataFromState';

// 获取邮箱分享直白链接
const getEmailShareDirectLink = collectionUid => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { galleryBaseUrl } = getDataFromState(getState());
      dispatch({
        [CALL_API]: {
          apiPattern: {
            name: SAAS_EMAIL_SHARE_GET_DIRECT_LINK,
            params: {
              galleryBaseUrl,
              collectionUid,
            },
          },
        },
      }).then(resolve, reject);
    });
  };
};

export default {
  getEmailShareDirectLink,
};
