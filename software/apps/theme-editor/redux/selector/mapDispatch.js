import { bindActionCreators } from 'redux';
import projectActions from '@apps/theme-editor/redux/actions';

export default dispatch => ({
  boundProjectActions: bindActionCreators(projectActions, dispatch)
});
