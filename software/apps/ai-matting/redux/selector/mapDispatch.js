import { bindActionCreators } from 'redux';
import projectActions from '@apps/ai-matting/redux/actions';

export default dispatch => ({
  boundProjectActions: bindActionCreators(projectActions, dispatch)
});
