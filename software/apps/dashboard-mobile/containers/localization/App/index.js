import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';

import XPureComponent from '@resource/components/XPureComponent';

// import ModalEntry from '@apps/gallery-client-mobile/components/ModalEntry';
import equals from '@resource/lib/utils/compare';

// import renderRoutes from '@resource/lib/utils/routeHelper';
import mapDispatch from '@apps/dashboard-mobile/redux/selector/mapDispatch';
import mapState from '@apps/dashboard-mobile/redux/selector/mapState';

import main from './handle/main';

@connect(mapState, mapDispatch)
class App extends XPureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    main.didMount(this);
  }

  componentWillReceiveProps(nextProps) {
    const isEqual = equals(this.props, nextProps);
    if (!isEqual) {
      main.willReceiveProps(this, nextProps);
    }
  }

  /**
   * 设置默认的路由跳转
   */
  getDefaultRedirect = () => {
    const { location, isShareExpired, isLoadCollectionCompleted } = this.props;

    // if (isShareExpired) {
    //   return <Redirect to="/expiry" />;
    // }

    if (location.pathname === '/software/gallery/') {
      return <Redirect to="/software/gallery/collection" />;
    }

    return null;
  };

  render() {
    // 项目私有弹框
    const modalProps = {
      ...this.props,
    };
    // const routeHtml = renderRoutes({
    //   isHash: false,
    //   props: this.props,
    //   // AuthorizedRoute: XAuthorizedRoute
    // });
    return (
      <Fragment>
        {/* 设置默认的路由跳转 */}
        {this.getDefaultRedirect()}
        {/* {routeHtml} */}
        {/* 项目私有弹框. */}
        {/* <ModalEntry {...modalProps} /> */}
      </Fragment>
    );
  }
}

export default App;
