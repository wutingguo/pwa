import { bindActionCreators } from 'redux';
import projectActions from '@apps/gallery/redux/actions';

export default dispatch => ({
  boundProjectActions: bindActionCreators(projectActions, dispatch)
});
