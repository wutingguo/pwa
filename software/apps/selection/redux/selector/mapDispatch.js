import { bindActionCreators } from 'redux';
import projectActions from '@apps/workspace/redux/actions';

export default dispatch => ({
  boundProjectActions: bindActionCreators(projectActions, dispatch)
});
