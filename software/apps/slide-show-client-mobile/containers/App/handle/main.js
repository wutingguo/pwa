import { is } from 'immutable';
import { isEqual } from 'lodash';

const didMount = that => {
  const { urls, boundProjectActions } = that.props;

  if(urls && urls.size) {
    boundProjectActions.getCollectionDetail().then(() => {
      boundProjectActions.getStudioInfo();
    });
    boundProjectActions.getLicenseLevel();
  }
};

const willReceiveProps = (that, nextProps) => {
  const { urls: oldUrls, qs } = that.props;
  const { urls: newUrls, qs:newqs } = nextProps;
  const project_id = newqs.get('project_id');
  const old_project_id  = qs.get('project_id');

  // getEnv请求成功后.
  if ((!is(oldUrls, newUrls) && newUrls && newUrls.size && !!project_id) || (!isEqual(qs, newqs)) && !!project_id) {
    const { boundProjectActions } = that.props;
    boundProjectActions.getCollectionDetail().then(() => {
      boundProjectActions.getStudioInfo();
    });
    boundProjectActions.getLicenseLevel();
  }
};

export default {
  didMount,
  willReceiveProps
};
