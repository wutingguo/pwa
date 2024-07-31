import Immutable from 'immutable';
import { get } from 'lodash';
import * as stateHelper from '@apps/ai-matting/utils/mapStateHelper';
import { isImmutable } from '@resource/lib/utils/compare';
import { elementTypes } from '@resource/lib/constants/strings';

const emptyList = Immutable.fromJS([]);

export default state => {
  const { root, aiMatting } = state;
  const { system } = root;
  const urls = stateHelper.getUrlsHelper(get(system, 'env.urls'));
  const page = aiMatting.page.present;
  const elementArray = page.get('elements');
  const photoElement = elementArray.find(ele => ele.get('type') == elementTypes.photo);
  const originEncImgId = photoElement?.get('encImgId') || '';
  const projectId = aiMatting.property.get('projectId');
  return {
    qs: get(system, 'env.qs'),
    urls,
    baseUrl: urls.get('baseUrl'),
    galleryBaseUrl: urls.get('galleryBaseUrl'),
    uploadBaseUrl: urls.get('uploadBaseUrl'),
    userInfo: get(system, 'userInfo'),
    projectId,
    page,
    elementArray,
    photoElement,
    originEncImgId
  };
};
