import { bindActionCreators } from 'redux';
import projectActions from '@apps/slide-show/redux/actions';

export default dispatch => ({
  boundProjectActions: bindActionCreators(projectActions, dispatch)
});
