import { bindActionCreators } from 'redux';
import projectActions from '@apps/slide-show-client/redux/actions';

export default dispatch => ({
  boundProjectActions: bindActionCreators(projectActions, dispatch)
});
