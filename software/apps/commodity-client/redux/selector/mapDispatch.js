import { bindActionCreators } from 'redux';
import projectActions from '@apps/commodity-client/redux/actions';

export default dispatch => ({
  boundProjectActions: bindActionCreators(projectActions, dispatch)
});
