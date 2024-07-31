import { GET_USER_INFO } from '@apps/live-photo-client/constants/actionTypes';

const getUserInfo = () => {
  return {
    type: GET_USER_INFO
  };
};

export default {
  getUserInfo
};
