
import { GET_USER_INFO } from '@apps/live-photo-client-mobile/constants/actionTypes';

const getUserInfo = () => {
    return {
        type: GET_USER_INFO,
    };
};

export default {
    getUserInfo
};