import { bindActionCreators } from 'redux';
import projectActions from '@apps/live/redux/actions';

export default dispatch => ({
  boundProjectActions: bindActionCreators(projectActions, dispatch)
});
