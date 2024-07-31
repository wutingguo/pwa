import { bindActionCreators } from 'redux';
import globalActions from '@resource/pwa/redux/actions';
import actions from '../actions';

export const mapDispatchToProps = dispatch => ({
	boundGlobalActions: bindActionCreators(globalActions, dispatch),
	boundActions: bindActionCreators(actions, dispatch)
});