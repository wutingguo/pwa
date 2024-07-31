import { bindActionCreators } from 'redux';
import projectActions from '@apps/gallery-client/redux/actions';

export default dispatch => ({
  boundProjectActions: bindActionCreators(projectActions, dispatch)
});
