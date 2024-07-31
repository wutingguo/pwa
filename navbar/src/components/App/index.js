import React, { Component, Fragment, createRef } from 'react';
import { connect } from 'react-redux';
import { isEqual, template } from 'lodash';
import { mapStateToProps } from '@src/redux/selector/mapState';
import { mapDispatchToProps } from '@src/redux/selector/mapDispatch';
import XNavbar from '@resource/components/pwa/XNavbar/WrapNabrBar';
import XStyleAsset from '@resource/components/XStyleAsset';
import { galleryStyle } from '@resource/lib/utils/notificationStyles';
import NotificationSystem from 'react-notification-system';
// import { updateManifest } from '@resource/pwa/utils/updateManifest';
import routes from '@src/config/links';
// import { IMAGE_SRC1 } from '@resource/lib/constants/apiUrl';
import { Provider } from 'react-redux';
// import getPuid from '@resource/websiteCommon/utils/getPuid';
import Modals from '../Modals';

import main from './handle/main';
import helpActions from './handle/help';

import withRoute from './handle/withRoute';
import './index.scss';

function initProject() {}

initProject();

@connect(mapStateToProps, mapDispatchToProps)
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false
    };
    this.notificationSystem = createRef();

    this.onHowThisWorks = () => helpActions.onHowThisWorks(this);
    this.onGuidlineTips = () => helpActions.onGuidlineTips(this);
    this.onFAQ = () => helpActions.onFAQ(this);
    this.onFeedback = () => helpActions.onFeedback(this);
    this.onLogout = params => helpActions.onLogout(this, params);
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
  }

  componentWillMount() {
    main.willMount(this);
  }

  componentDidMount() {
    main.didMount(this);
  }

  render() {
    const {
      navbarOptions,
      userInfo,
      planList,
      qs,
      isUserLogined,
      isUserLoadCompleted,
      history,
      productSubscriptionStatus,
      isZnoLab,
      productCode,
      studioInfo,
      modals,
      property,
      baseUrl,
      boundGlobalActions,
      urls,
      location,
      mySubscription
    } = this.props;

    const navbarProps = {
      userInfo,
      planList,
      isUserLoadCompleted,
      isUserLogined,
      history,
      productSubscriptionStatus,
      routes,
      mySubscription,
      isShowHelp: navbarOptions.getIn(['help', 'isShow']),
      isShowLabs: navbarOptions.getIn(['labs', 'isShow']),
      isShowProjects: navbarOptions.getIn(['project', 'isShow']),
      isShowStuff: navbarOptions.getIn(['stuff', 'isShow']),
      isShowProjectToggle: navbarOptions.getIn(['projectToggle', 'isShow']),
      studioList: studioInfo.get('studioList'),
      studioDataLoad: studioInfo.get('load') || false,
      urls,
      boundGlobalActions,
      // help相关的action.
      onHowThisWorks: this.onHowThisWorks,
      onGuidlineTips: this.onGuidlineTips,
      onFAQ: this.onFAQ,
      onFeedback: this.onFeedback,
      onLogout: this.onLogout,

      isZnoLab,
      productCode
    };

    const modalProps = {
      modals,
      property,
      boundGlobalActions,
      baseUrl,
      userInfo,
      qs,
      urls
    };
    const pathname = location.pathname;
    const hiddenNavbarPaths = ['e-store/products/pricing', 'e-store/products/pricing-digital', 'theme-editor', 'custom-pricing', 'ai-matting'];
    const isHideNavbar = hiddenNavbarPaths.some(path => pathname && pathname.includes(path));
    return (
      <Fragment>
        {/* 导入全局样式 */}
        <XStyleAsset />
        {isHideNavbar ? null : <XNavbar {...navbarProps} />}

        {/* 全局弹框 */}
        <Modals {...modalProps} />

        {/*通知组件*/}
        <NotificationSystem ref={this.notificationSystem} style={galleryStyle} />
      </Fragment>
    );
  }
}

export default props => {
  const NewApp = withRoute(App);

  return (
    <Provider store={props.store}>
      <NewApp {...props} />
    </Provider>
  );
};
