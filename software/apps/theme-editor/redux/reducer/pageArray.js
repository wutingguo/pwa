import Immutable, { isImmutable } from 'immutable';
import {
  CREATE_ELEMENT,
  CREATE_ELEMENTS,
  DELETE_ELEMENTS,
  DELETE_ALL,
  UPDATE_ELEMENT,
  UPDATE_ELEMENTS,
  UPDATE_PAGE,
  UPDATE_PAGES,
  DELETE_MULTIPLE_PAGE,
  SET_PAGE_ARRAY,
  DELETE_PAGE,
  MOVE_PAGE_BEFORE
} from '@apps/theme-editor/constants/actionTypes';
import { elementTypes } from '@resource/lib/constants/strings';
import { SET_PSD_PAGES, CONCAT_PSD_PAGES } from '@resource/lib/constants/actionTypes';
import getSettedElements from '@apps/theme-editor/redux/redux-helper/elements';
import undoable from '@apps/theme-editor/utils/undoable';
import { guid } from '@resource/lib/utils/math';
const initialState = Immutable.fromJS();

const includeActionTypes = [
  CREATE_ELEMENT,
  CREATE_ELEMENTS,
  DELETE_ALL,
  DELETE_ELEMENTS,
  UPDATE_ELEMENT,
  UPDATE_ELEMENTS,
  UPDATE_PAGES
];

const convertElements = layers => {
  let elements = [];
  layers.forEach(layer => {
    const { width: pictureWidth, height: pictureHeight, isGroup, children } = layer;
    if (!isGroup) {
      elements.push({
        type: layer.isBackground ? elementTypes.background : elementTypes.sticker,
        pictureWidth,
        pictureHeight,
        ...layer
      });
    }
  });
  return elements;
};

function convertPsdPages(pages) {
  return pages.map(page => {
    const { layers, ...rest } = page;
    return {
      backend: {
        isPrint: true,
        slice: false
      },
      type: 'Sheet',
      bgColor: '#fff',
      template: {},
      ...rest,
      elements: convertElements(layers)
    };
  });
}

const pageArrayReducer = (state, action) => {
  switch (action.type) {
    case SET_PAGE_ARRAY: {
      const { pageArray } = action;
      if (Immutable.List.isList(pageArray)) {
        return pageArray;
      }

      return state;
    }
    case SET_PSD_PAGES: {
      const { pages } = action;

      if (pages.length) {
        const pageArray = convertPsdPages(pages);
        return Immutable.fromJS(pageArray);
      }

      return state;
    }
    case CONCAT_PSD_PAGES: {
      const { pages } = action;

      if (pages.length) {
        const pageArray = convertPsdPages(pages);
        return state.concat(Immutable.fromJS(pageArray));
      }

      return state;
    }
    case DELETE_PAGE: {
      const { pageId } = action;
      const thePageIndex = state.findIndex(o => o.get('id') === pageId);

      if (thePageIndex !== -1) {
        return state.remove(thePageIndex);
      }

      return state;
    }
    case UPDATE_PAGE: {
      const { data } = action;
      const { pageId } = data;
      const pageIndex = state.findIndex(page => page.get('id') === pageId);
      if (pageIndex !== -1) {
        return state.set(pageIndex, state.get(pageIndex).merge(data));
      }

      return state;
    }
    case UPDATE_PAGES: {
      let pages = state;
      const newPages = action.pages;

      newPages.forEach(newPage => {
        const pageId = newPage.get('id');
        const index = pages.findIndex(page => page.get('id') === pageId);
        if (index >= 0) {
          pages = pages.set(index, newPage);
        }
      });

      return pages;
    }
    case DELETE_MULTIPLE_PAGE: {
      const { pageIds } = action;
      return state.filter(page => {
        const pageId = page.get('id');
        return pageIds.indexOf(pageId) === -1;
      });
    }
    case MOVE_PAGE_BEFORE: {
      const { pageId, beforePageId } = action;

      const dragPage = state.find(page => page.get('id') === pageId);
      let newPageArray = state.filter(page => page.get('id') !== pageId);
      const dropPageIndex = newPageArray.findIndex(page => page.get('id') === beforePageId);
      if (dragPage && dropPageIndex !== -1) {
        newPageArray = newPageArray
          .slice(0, dropPageIndex + 1)
          .concat(Immutable.List([dragPage]))
          .concat(newPageArray.slice(dropPageIndex + 1));

        return newPageArray;
      }

      return state;
    }

    case CREATE_ELEMENTS:
    case DELETE_ELEMENTS: {
      const { pageId } = action;

      const thePageIndex = state.findIndex(o => o.get('id') === pageId);
      if (thePageIndex !== -1) {
        const oldElements = state.getIn([String(thePageIndex), 'elements']);
        const newElements = getSettedElements(oldElements, action);

        let newState = state.setIn([String(thePageIndex), 'elements'], newElements);
        return newState;
      }

      return state;
    }
    case UPDATE_ELEMENTS: {
      const { updateObjectArray } = action;
      let newState = state;
      console.time('update-page-element');
      updateObjectArray.forEach(updateObject => {
        // { elements, pageId } updateObject
        const pageId = updateObject.get('pageId');
        const updateElements = updateObject.get('elements');

        const thePageIndex = state.findIndex(o => o.get('id') === pageId);
        if (thePageIndex !== -1) {
          const oldElements = newState.getIn([String(thePageIndex), 'elements']);
          const newElements = getSettedElements(oldElements, action, updateElements);

          newState = newState.setIn([String(thePageIndex), 'elements'], newElements);
        }
      });
      console.timeEnd('update-page-element');
      return newState;
    }

    default:
      return state;
  }
};

// 添加undo/redo行为
export default undoable(initialState, pageArrayReducer, {
  filter: includeActionTypes,
  limit: 10
});
