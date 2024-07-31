import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router';
import equals from '@resource/lib/utils/compare';
import { connect } from 'react-redux';
import XPureComponent from '@resource/components/XPureComponent';
import { willMount, didMount, willUnmount, didUpdate } from './handle/main';
import { onresize } from './events';

import ModalEntry from '@apps/theme-editor/components/ModalEntry';

import renderRoutes from '@resource/lib/utils/routeHelper';
import withMatch from './handle/withMatch';

import mapState from '@apps/theme-editor/redux/selector/mapState';
import mapDispatch from '@apps/theme-editor/redux/selector/mapDispatch';
@connect(mapState, mapDispatch)
class App extends XPureComponent {
  constructor() {
    super();
    this.state = { data: [] };
    this.willMount = () => willMount(this);
    this.didMount = () => didMount(this);
    this.didUpdate = () => didUpdate(this);
    this.willUnmount = () => willUnmount(this);
    this.onresize = () => onresize(this);
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
      props: this.props
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
