import { bindActionCreators } from 'redux';
import projectActions from '@src/redux/actions';


export default dispatch => ({
  boundProjectActions: bindActionCreators(projectActions, dispatch)
});
