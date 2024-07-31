import { bindActionCreators } from 'redux';
import projectActions from '@apps/slide-show-client-mobile/redux/actions';

export default dispatch => ({
  boundProjectActions: bindActionCreators(projectActions, dispatch)
});
