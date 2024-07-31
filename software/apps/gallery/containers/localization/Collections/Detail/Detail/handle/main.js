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
  if(!is(detail, collectionDetail)){
    updateState(that, 'detail', collectionDetail);
  }
};

/**
 * 查看store上是否存在指定id的collection信息, 如果存在, 就直接设置到state中,
 * 或者重新获取.
 * @param {*} that
 */
const getCollectionDetail = (encCollectionId, boundProjectActions) => {
  if (encCollectionId) {
    return boundProjectActions.getCollectionDetail(encCollectionId);
  } else {
    console.error('collectionUid is empty');
  }
};

export default {
  willReceiveProps,
  getCollectionDetail,
  updateState
};
