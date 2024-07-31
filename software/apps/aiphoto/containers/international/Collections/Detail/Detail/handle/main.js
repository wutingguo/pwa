import { merge } from 'lodash';
import { isImmutable, fromJS, is } from 'immutable';

/**
 * 更新store上的数据.
 * @param {*} that
 * @param {String} key
 * @param {Any} result
 */
const updateState = (that, key, result) => {
  const oldValue = that.state[key];

  if (!oldValue) {
    return that.setState({ [key]: result });
  }

  if (isImmutable(oldValue)) {
    return that.setState({ [key]: result.merge(oldValue) });
  }

  return that.setState({ [key]: merge({}, result, oldValue) });
};

/**
 * componentWillReceiveProps
 * @param {*} that
 * @param {*} nextProps
 */
const willReceiveProps = (that, nextProps) => {
  const { collectionDetail } = nextProps;
  const { detail } = that.state;

  // 更新collection detail对象.
  if (!is(detail, collectionDetail)) {
    updateState(that, 'detail', collectionDetail);
  }
};

export default {
  willReceiveProps,
  updateState
};
