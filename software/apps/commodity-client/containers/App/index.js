import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';

import XLoading from '@resource/components/XLoading';
import XPureComponent from '@resource/components/XPureComponent';

import equals from '@resource/lib/utils/compare';

import ModalEntry from '@apps/commodity-client/components/ModalEntry';
import mapDispatch from '@apps/commodity-client/redux/selector/mapDispatch';
import mapState from '@apps/commodity-client/redux/selector/mapState';

import main from './handle/main';

@connect(mapState, mapDispatch)
class App extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: props.location.pathname === '/',
    };
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
    const { location, isShareExpired, isNoData, isLoadCompleted } = this.props;

    if (isShareExpired || isNoData) {
      this.setState({
        loading: false,
      });
      return <Redirect to="/expiry" />;
    }
    if (location.pathname === '/' && isLoadCompleted) {
      this.setState({
        loading: false,
      });
      return <Redirect to="/home" />;
    }
    // if (currentPath) {
    //   return <Redirect to={`${currentPath}`} />;
    // }
    return null;
  };

  render() {
    const { loading } = this.state;
    // 项目私有弹框
    const modalProps = {
      ...this.props,
    };
    return (
      <Fragment>
        {loading && <XLoading type="imageLoading" size="lg" zIndex={99} isShown={loading} />}
        {/* 设置默认的路由跳转 */}
        {this.getDefaultRedirect()}

        {/* 项目私有弹框. */}
        <ModalEntry {...modalProps} />
      </Fragment>
    );
  }
}

export default withRouter(App);
