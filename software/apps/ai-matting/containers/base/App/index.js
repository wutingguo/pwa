import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router';
import equals from '@resource/lib/utils/compare';
import { connect } from 'react-redux';
import XPureComponent from '@resource/components/XPureComponent';
import * as mainHandler from './handle/main';
import * as eventHandler from './events';
import { bindFuncs } from '@resource/lib/utils/component';

// import ModalEntry from '@apps/ai-cutout/components/ModalEntry';

import renderRoutes from '@resource/lib/utils/routeHelper';
import withMatch from './handle/withMatch';

import mapState from '@apps/ai-matting/redux/selector/mapState';
import mapDispatch from '@apps/ai-matting/redux/selector/mapDispatch';
@connect(mapState, mapDispatch)
class App extends XPureComponent {
  constructor() {
    super();
    this.state = { data: [] };
    bindFuncs(this, mainHandler);
    bindFuncs(this, eventHandler);
  }

  componentWillMount() {
    this.willMount();
  }

  componentDidMount() {
    this.didMount();
  }

  componentDidUpdate(prevProps, prevState) {
    this.didUpdate();
  }

  componentWillUnmount() {
    this.willUnmount();
  }

  render() {
    // 项目私有弹框
    const modalProps = {
      ...this.props
    };
    const routeHtml = renderRoutes({
      isHash: false,
      props: {
        ...this.props,
        exitImageMatting: this.exitImageMatting,
        showRetryModal: this.showRetryModal
      }
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
