import React, { Children, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';

import XPureComponent from '@resource/components/XPureComponent';

// import ModalEntry from '@apps/gallery-client-mobile/components/ModalEntry';
import equals from '@resource/lib/utils/compare';

import mapDispatch from '@apps/dashboard-mobile/redux/selector/mapDispatch';
import mapState from '@apps/dashboard-mobile/redux/selector/mapState';
import renderRoutes from '@apps/dashboard-mobile/utils/routeHelper';
import { setHeader, setPageHeaders } from '@apps/dashboard-mobile/utils/setPageHeader';

import main from './handle/main';

@connect(mapState, mapDispatch)
class App extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = { data: [] };
  }

  componentDidMount() {
    main.didMount(this);
  }

  componentWillReceiveProps(nextProps) {
    // const isEqual = equals(this.props, nextProps);
    // if (!isEqual) {
    //     main.willReceiveProps(this, nextProps);
    // }
  }

  /**
   * 设置默认的路由跳转
   */
  getDefaultRedirect = () => {
    const { location, isShareExpired, isLoadCollectionCompleted } = this.props;
    // if (location.pathname === '/') {
    //   return <Redirect to="/software/gallery/collection" />;
    // }

    return null;
  };
  render() {
    // 项目私有弹框
    // const modalProps = {
    //     ...this.props,
    // };

    const routeHtml = renderRoutes({
      isHash: true,
      props: { ...this.props, setPageHeaders, setHeader },
      // AuthorizedRoute: XAuthorizedRoute
    });
    return (
      <Fragment>
        {/* 渲染的主体区域. */}
        {routeHtml}
        {/* 项目私有弹框. */}
        {/* <ModalEntry {...modalProps} /> */}
      </Fragment>
    );
  }
}

export default withRouter(App);
