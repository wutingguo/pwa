import { bindActionCreators } from 'redux';
import projectActions from '@apps/live-photo-client-mobile/redux/actions';

export default dispatch => ({
  boundProjectActions: bindActionCreators(projectActions, dispatch)
});
