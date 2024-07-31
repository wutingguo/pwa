
import Immutable from 'immutable';
import {
	ESTORE_GET_ENV
} from '@resource/lib/constants/apiUrl';
import { convertObjIn } from '@resource/lib/utils/typeConverter';
import { API_SUCCESS } from '../../../../constants/actionTypes';

const initValues = Immutable.Map({});

/**
 * 更新store上的urls.
 */
const urls = (state = initValues, action) => {
	switch (action.type) {
		case API_SUCCESS: {
			if (action.apiPattern.name === ESTORE_GET_ENV) {
				const { data } = action.response
				let env = {}
				// estore接口修改
				if (data && data.env) {
					env = data.env;
				} else {
					env = convertObjIn(action.response.env);
				}
				const { layoutTemplateServerBaseUrl } = env;
				return state.merge(env).merge({
					templateThumbnailPrefx: `${layoutTemplateServerBaseUrl}TemplateThumbnail/`
				});
			}
			return state;
		}
		default: {
			return state;
		}
	}
};

export default urls;
