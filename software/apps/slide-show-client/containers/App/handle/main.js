import { is } from 'immutable';
import { isEqual } from 'lodash';

const didMount = that => {
  const { urls, boundProjectActions, detail, qs } = that.props;
  const project_id = qs.get('project_id');
  if (urls && urls.size && project_id) {
    boundProjectActions.getCollectionDetail().then(() => {
      boundProjectActions.getStudioInfo();
    });
    boundProjectActions.getLicenseLevelWithGive();
    boundProjectActions.getClientDownloadSetting().then(res => {
      // console.log("res========1",res)
      if (res.ret_code === 200000 && res.data && res.data.download_status) {
        // console.log("res========2",res)
        // boundProjectActions.getClientDownloadUrl();
      }
    });
  }
};

const willReceiveProps = (that, nextProps) => {
  const { boundProjectActions, qs } = that.props;
  const { urls: oldUrls } = that.props;
  const { urls: newUrls, qs: newqs } = nextProps;
  const old_project_id = qs.get('project_id');
  const project_id = newqs.get('project_id');
  // getEnv请求成功后.
  if ((!is(oldUrls, newUrls) && newUrls && newUrls.size && !!project_id) || (!isEqual(qs, newqs)) && !!project_id) {
    boundProjectActions.getCollectionDetail().then(() => {
      boundProjectActions.getStudioInfo();
    });
    boundProjectActions.getLicenseLevelWithGive();
    boundProjectActions.getClientDownloadSetting().then(res => {
      // console.log("res========1",res)
      if (res.ret_code === 200000 && res.data && res.data.download_status) {
        // console.log("res========2",res)
        // boundProjectActions.getClientDownloadUrl();
      }
    });
  }
};

export default {
  didMount,
  willReceiveProps
};
