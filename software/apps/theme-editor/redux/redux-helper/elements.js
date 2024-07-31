import Immutable from 'immutable';
import {
  CREATE_ELEMENT,
  CREATE_ELEMENTS,
  UPDATE_ELEMENT,
  UPDATE_ELEMENTS,
  DELETE_ELEMENTS
} from '@apps/theme-editor/constants/actionTypes';

export default (state = Immutable.List(), action, updateElements = Immutable.List()) => {
  switch (action.type) {
    case CREATE_ELEMENT: {
      return state.push(action.element);
    }
    case CREATE_ELEMENTS: {
      return state.concat(action.elements);
    }
    case UPDATE_ELEMENT:
    case UPDATE_ELEMENTS: {
      let newState = state;

      updateElements.forEach(element => {
        const theElementIndex = newState.findIndex(o => {
          return o.get('id') === element.get('id');
        });

        if (theElementIndex !== -1) {
          const theElement = newState.get(theElementIndex);
          newState = newState.set(String(theElementIndex), theElement.merge(element));
        }
      });

      return newState;
    }
    case DELETE_ELEMENTS: {
      const { elementIds } = action;
      return state.filter(element => {
        return elementIds.indexOf(element.get('id')) === -1;
      });
    }
    default:
      return state;
  }
};
