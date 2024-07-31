import { bindActionCreators } from 'redux';
import projectActions from '@apps/selection-client-mobile/redux/actions';

export default dispatch => ({
  boundProjectActions: bindActionCreators(projectActions, dispatch)
});
