import { merge } from 'lodash';
import { isImmutable, is } from 'immutable';
import {
  REDO,
  UNDO,
  CLEAR_HISTORY,
  START_UNDO,
  STOP_UNDO
} from '@resource/lib//constants/actionTypes';
import { dispatchCustomEvent } from '@resource/lib/utils/events';

const defaultConfig = {
  // 仅仅允许的action type.
  filter: [],
  limit: 10
};

/**
 * 从右边开始, 截取指定长度的数组内容.
 * @param  {[type]} arr  待截取的原数组.
 * @param  {Number} size 截取指定长度
 */
const doSlice = (arr, size) => {
  if (!arr || !arr.length || !size) {
    return [];
  }

  let newArr = arr;

  if (arr.length > size) {
    newArr = arr.slice(newArr.length - size);
  }

  return newArr;
};

const doFilter = (filter, actionType) => {
  return filter.indexOf(actionType) !== -1;
};

const createUndoable = (defaultState, reducer, options) => {
  // 以一个空的 action 调用 reducer 来产生初始的 state
  const initialState = {
    past: [],
    pastIds: [],
    present: reducer(defaultState, {}),
    future: [],
    futureIds: [],
    inUndo: false
  };

  const config = merge({}, defaultConfig, options);

  // 返回一个可以执行撤销和重做的新的reducer
  const enhanceReducer = (state = initialState, action) => {
    const { past = [], present = {}, future = [], off } = state;
    const updateId = parseInt(Date.now() / 10);

    switch (action.type) {
      case UNDO:
        if (!past.length) {
          return state;
        }

        const previous = past[past.length - 1];

        // 如果最新的shotId不等于当前数据的快照Id 则不处理
        if (previous.shotId && window.pastShotId && previous.shotId !== window.pastShotId) {
          return state;
        }

        const newPast = past.slice(0, past.length - 1);
        const lastShot = newPast[newPast.length - 1];
        if (lastShot && lastShot.shotId) {
          window.pastShotId = lastShot.shotId;
        } else {
          window.pastShotId = null;
        }
        present.shotId = updateId;
        window.futureShotId = present.shotId;

        dispatchCustomEvent('state', previous);

        return {
          past: newPast,
          present: previous,
          future: [present, ...future],
          inUndo: true
        };
      case REDO:
        if (!future.length) {
          return state;
        }

        const next = future[0];

        // 如果最新的shotId不等于当前数据的快照Id 则不处理
        if (next.shotId && window.futureShotId && next.shotId !== window.futureShotId) {
          return state;
        }

        const newFuture = future.slice(1);
        const futureShot = newFuture[0];
        if (futureShot && futureShot.shotId) {
          window.futureShotId = futureShot.shotId;
        } else {
          window.futureShotId = null;
        }
        window.pastShotId = present.shotId;

        dispatchCustomEvent('state', next);

        return {
          past: [...past, present],
          present: next,
          future: newFuture,
          inUndo: true
        };
      case CLEAR_HISTORY: {
        return {
          past: [],
          present,
          future: [],
          inUndo: true
        };
      }
      case START_UNDO: {
        return merge({}, state, { off: false });
      }
      case STOP_UNDO: {
        return merge({}, state, { off: true });
      }
      default: {
        // 将其他 action 委托给原始的 reducer 处理
        const newPresent = reducer(present, action);
        newPresent.shotId = updateId;
        // TODO: 两个数据都为immutable，不能用全等比较
        if (isImmutable(present) && isImmutable(newPresent) && is(present, newPresent)) {
          return state;
        }

        if (present === newPresent) {
          return state;
        }

        if (off) {
          return merge({}, state, { present: newPresent });
        }

        // 处理fitler逻辑.
        if (doFilter(config.filter, action.type)) {
          if (present.shotId) {
            window.pastShotId = present.shotId;
            window.futureShotId = null;
          }

          // 限制回滚的次数.
          const newArr = [...past, present];

          return {
            past: doSlice(newArr, config.limit),
            present: newPresent,
            future: [],
            inUndo: false
          };
        }

        return {
          past,
          present: newPresent,
          future,
          inUndo: false
        };
      }
    }
  };

  return enhanceReducer;
};

export default function undoable(defaultState, reducer, options) {
  // 利用闭包, 对传入的变量做保存.
  return createUndoable(defaultState, reducer, options);
}
