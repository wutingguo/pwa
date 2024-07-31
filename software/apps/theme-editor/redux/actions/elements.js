import Immutable, { fromJS } from 'immutable';
import { guid } from '@resource/lib/utils/math';
import { filterInvalidKeysOfPhotobook } from '@resource/lib/utils/elements';
import getDataFromState, {
  getElementPageIdMap,
  getCurrentPage,
  getElementArray
} from '@apps/theme-editor/utils/getDataFromState';
import { updateEffectKeys } from '@apps/theme-editor/constants/strings';
import setElementByType from '@apps/theme-editor/utils/setElementByType';
import {
  CREATE_ELEMENTS,
  DELETE_ALL,
  DELETE_ELEMENTS,
  UPDATE_ELEMENTS,
  UPDATE_PAGE
} from '@apps/theme-editor/constants/actionTypes';
import { wrapPromise } from '@resource/lib/utils/promise';

const emptyList = Immutable.fromJS([]);

export const createElements = (elements, pageId) => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const willUpdateElementArray = Immutable.fromJS(elements);
      if (!willUpdateElementArray.size) {
        return reject('elements is empty when creating elements');
      }

      const { pageArray } = getDataFromState(getState());

      const thePage = getCurrentPage(pageArray, pageId);
      if (!thePage) {
        return reject('pageId is empty when delete elements');
      }
      // 动态的添加一个guid
      let newElements = willUpdateElementArray.map(ele => {
        return ele.merge({
          id: guid()
        });
      });

      dispatch({
        type: CREATE_ELEMENTS,
        pageId: thePage.get('id'),
        elements: newElements
      });
      resolve(newElements.get(0));
    });
  };
};

export const createElement = (element, pageId) => {
  return createElements([element], pageId);
};

/**
 * 删除指定的元素。
 *
 */
export const deleteElements = (elementIds, pageIdOrIds) => {
  return (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      if (!pageIdOrIds) {
        return reject('pageId is empty when delete elements');
      }

      const immuableElementIds = Immutable.fromJS(elementIds);

      // 确保封装成数组形式。
      const pageIds = Array.isArray(pageIdOrIds) ? pageIdOrIds : [pageIdOrIds];
      Object.values(pageIds).forEach(pageId => {
        dispatch({
          type: DELETE_ELEMENTS,
          pageId,
          elementIds: immuableElementIds
        });
        dispatch({
          type: UPDATE_PAGE,
          data: {
            pageId,
            isUpdatePage: true
          }
        });
      });

      return resolve(immuableElementIds);
    });
  };
};

const deleteElement = (elementId, pageId) => {
  return deleteElements([elementId], pageId);
};

const deleteAll = (keepElementIds = []) => {
  return (dispatch, getState) => {
    const { pageArray } = getDataFromState(getState());
    const oldElements = getElementArray(pageArray);
    dispatch({
      type: DELETE_ALL,
      willDeleteElementIds: oldElements
        .map(o => o.get('id'))
        .filter(id => !keepElementIds.includes(id))
    });

    return Promise.resolve();
  };
};
// 更新cover或内页里面的元素
export const updateElements = elementArray => {
  return async (dispatch, getState) => {
    return wrapPromise((resolve, reject) => {
      const { pageArray } = getDataFromState(getState());

      const updateEffectElement = elementArray.find(ele => {
        return Object.keys(ele).some(key => updateEffectKeys.includes(key));
      });

      const willUpdateElementArray = fromJS(elementArray);

      if (!willUpdateElementArray.size) {
        return reject('elementArray is empty');
      }
      const elementPageIdMap = getElementPageIdMap(pageArray);
      let fixedUpdateObjectArray = emptyList;
      willUpdateElementArray.forEach(updateObject => {
        const elements = Immutable.List([updateObject]);

        const thePageId = elementPageIdMap.get(elements.getIn(['0', 'id']));

        const thePage = getCurrentPage(pageArray, thePageId);
        if (!thePage) {
          return reject('the page is empty when update elements');
        }

        let immutableElements = Immutable.fromJS(elements);

        let newElements = Immutable.List();
        immutableElements.forEach(element => {
          const newElement = setElementByType({
            element,
            thePage
          });
          newElements = newElements.push(newElement);
        });
        const fixedIndex = fixedUpdateObjectArray.findIndex(m => m.get('pageId') === thePageId);
        if (fixedIndex !== -1) {
          const fixeddUpdatedObject = fixedUpdateObjectArray.get(fixedIndex);
          const elements = fixeddUpdatedObject.get('elements').concat(newElements);
          fixedUpdateObjectArray = fixedUpdateObjectArray.setIn(
            [String(fixedIndex), 'elements'],
            elements
          );
        } else {
          fixedUpdateObjectArray = fixedUpdateObjectArray.push(
            Immutable.Map({
              page: thePage,
              pageId: thePageId,
              elements: newElements
            })
          );
        }
      });

      const updateObjectArray = filterInvalidKeysOfPhotobook(fixedUpdateObjectArray);
      dispatch({
        type: UPDATE_ELEMENTS,
        updateObjectArray: updateObjectArray
      });
      if (updateEffectElement) {
        const pageId = elementPageIdMap.get(updateEffectElement.id);
        dispatch({
          type: UPDATE_PAGE,
          data: {
            pageId,
            isUpdatePage: true
          }
        });
      }
      resolve(elementArray[0]);
    });
  };
};

export const updateElement = (element, pageId) => {
  return updateElements([element], pageId);
};

export default {
  createElements,
  createElement,
  deleteElement,
  deleteElements,
  deleteAll,
  updateElements,
  updateElement
};
