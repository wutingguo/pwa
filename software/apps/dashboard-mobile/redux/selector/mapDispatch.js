import { bindActionCreators } from 'redux';

import projectActions from '@apps/dashboard-mobile/redux/actions';

export default dispatch => ({
  boundProjectActions: bindActionCreators(projectActions, dispatch),
});
