import { CALL_API } from '@resource/lib/middlewares/api';
import { ESTORE_CREATE } from '@resource/lib/constants/apiUrl';
import getDataFromState from '@resource/lib/utils/getDataFromState';
import {
    CLEAR_PROJECT_FOR_EDITOR,
} from '../../../../constants/actionTypes';

const createVirtualProject = (params) => {
    return (dispatch, getState) => {
        const { baseUrl } = getDataFromState(getState());
        const { rack_id, store_id, collectionId, rack_sku_id } = params
        let createUrl = ESTORE_CREATE
        const body = {
            collection_id: collectionId,
            store_id,
            schema_version: "1",
            default_sku: {
                rack_id: rack_id,
                rack_sku_id: rack_sku_id
            }
        }
        return dispatch({
            [CALL_API]: {
                apiPattern: {
                    name: createUrl,
                    params: {
                        baseUrl
                    }
                },
                options: {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8'
                    },
                    body: JSON.stringify(body)
                }
            }
        }).then(res => {
            const { data } = res;
            if (data) {
                return data;
            }
            return res;
        });
    };
};
const clearProject = () => {
    return {
        type: CLEAR_PROJECT_FOR_EDITOR,
    };
};
export default {
    createVirtualProject,
    clearProject
};
