import { bindActionCreators } from 'redux';
import projectActions from '@apps/live-photo-client/redux/actions';

export default dispatch => ({
  boundProjectActions: bindActionCreators(projectActions, dispatch)
});
