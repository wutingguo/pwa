import { bindActionCreators } from 'redux';
import projectActions from '@apps/aiphoto/redux/actions';

export default dispatch => ({
  boundProjectActions: bindActionCreators(projectActions, dispatch)
});
