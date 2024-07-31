import { bindActionCreators } from 'redux';
import dashboardActions from '@apps/dashboard/redux/actions';

export default dispatch => {
  return {
    boundProjectActions: bindActionCreators(dashboardActions, dispatch)
  }
};
