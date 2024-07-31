import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Route, HashRouter, Redirect } from 'react-router-dom';
import XPureComponent from '@resource/components/XPureComponent';
import XAuthorizedRoute from '@resource/components/pwa/XAuthorizedRoute';

import XPageRouter from '@resource/components/XPageRouter';
import ModalEntry from '@apps/slide-show/components/ModalEntry';

import renderRoutes from '@resource/lib/utils/routeHelper';
import withMatch from './handle/withMatch';

import mapState from '@apps/slide-show/redux/selector/mapState';
import mapDispatch from '@apps/slide-show/redux/selector/mapDispatch';
// 初始化图片加载池
import '@resource/lib/utils/imagePool';

@connect(mapState, mapDispatch)
class App extends XPureComponent {
  state = { data: [] };

  render() {
    // 项目私有弹框
    const modalProps = {
      ...this.props
    };

    const routeHtml = renderRoutes({
      isHash: false,
      props: this.props,
      // AuthorizedRoute: XAuthorizedRoute
    });

    return (
      <Fragment>
        {/* 渲染的主体区域. */}
        {routeHtml}

        {/* 项目私有弹框. */}
        <ModalEntry {...modalProps} />
      </Fragment>
    );
  }
}

export default withMatch(withRouter(App));
