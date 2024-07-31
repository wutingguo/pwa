import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';

import XPureComponent from '@resource/components/XPureComponent';

import equals from '@resource/lib/utils/compare';

import ModalEntry from '@apps/live-photo-client-mobile/components/ModalEntry';
import mapDispatch from '@apps/live-photo-client-mobile/redux/selector/mapDispatch';
import mapState from '@apps/live-photo-client-mobile/redux/selector/mapState';

import main from './handle/main';

@connect(mapState, mapDispatch)
class App extends XPureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    main.didMount(this);
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: 'MSG_CHANGE_TITLE', payload: { title: 'Preview' } })
      );
    }
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
    return <Redirect to="/home" />;
  };

  render() {
    // 项目私有弹框
    const modalProps = {
      ...this.props,
    };
    return (
      <Fragment>
        {/* 设置默认的路由跳转 */}
        {this.getDefaultRedirect()}
        {/* 项目私有弹框. */}
        {/* <ModalEntry {...modalProps} /> */}
      </Fragment>
    );
  }
}

export default withRouter(App);
