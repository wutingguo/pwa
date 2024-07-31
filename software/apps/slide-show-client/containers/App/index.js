import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';
import XPureComponent from '@resource/components/XPureComponent';
import ModalEntry from '@apps/slide-show-client/components/ModalEntry';
import equals from '@resource/lib/utils/compare';

import mapState from '@apps/slide-show-client/redux/selector/mapState';
import mapDispatch from '@apps/slide-show-client/redux/selector/mapDispatch';
import main from './handle/main';
// 初始化图片加载池
import '@resource/lib/utils/imagePool';

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
    const { 
      location, 
      isLoadCollectionCompleted 
    } = this.props;
    if (location.pathname === '/' && isLoadCollectionCompleted) {
      return <Redirect to="/home" />;
    }

    return null;
  };

  render() {
    // 项目私有弹框
    const modalProps = {
      ...this.props
    };

    return (
      <Fragment>
        {/* 设置默认的路由跳转 */}
        {this.getDefaultRedirect()}

        {/* 项目私有弹框. */}
        <ModalEntry {...modalProps} />
      </Fragment>
    );
  }
}

export default withRouter(App);
