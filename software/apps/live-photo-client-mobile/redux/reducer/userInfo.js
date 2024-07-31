import { fromJS, isImmutable } from 'immutable';
import { GET_USER_INFO } from '@apps/live-photo-client-mobile/constants/actionTypes';
import * as cache from '@resource/lib/utils/cache';
import { getUserUniqueIdCacheKey } from '@apps/live-photo-client-mobile/utils/helper';
import { guid } from '@resource/lib/utils/math';
const defaultState = fromJS({});
const userInfo = (state = defaultState, action) => {
    switch (action.type) {
        case GET_USER_INFO: {
            const cacheUserIdKey = getUserUniqueIdCacheKey('uid');
            let user_id = cache.get(cacheUserIdKey);
            if (!user_id) {
                user_id = guid()
                cache.set(cacheUserIdKey, user_id, false, 720);
            }
            return state.merge({
                user_id
            });
        }
        default: {
            return state;
        }
    }
};
export default userInfo;

