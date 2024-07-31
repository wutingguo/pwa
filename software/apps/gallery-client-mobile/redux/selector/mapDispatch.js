import { bindActionCreators } from 'redux';
import projectActions from '@apps/gallery-client-mobile/redux/actions';

export default dispatch => ({
  boundProjectActions: bindActionCreators(projectActions, dispatch)
});
