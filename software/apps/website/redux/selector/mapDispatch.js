import { bindActionCreators } from 'redux';
import projectActions from '@apps/website/redux/actions';

export default dispatch => ({
  boundProjectActions: bindActionCreators(projectActions, dispatch)
});
