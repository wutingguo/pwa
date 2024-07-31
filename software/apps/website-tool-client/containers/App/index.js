import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';
import XPureComponent from '@resource/components/XPureComponent';
import ModalEntry from '@apps/gallery-client/components/ModalEntry';
import XLoading from '@resource/components/XLoading';
import equals from '@resource/lib/utils/compare';

import mapState from '@apps/website-tool-client/redux/selector/mapState';
import mapDispatch from '@apps/website-tool-client/redux/selector/mapDispatch';
import main from './handle/main';

@connect(mapState, mapDispatch)
class App extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: props.location.pathname === '/'
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    const isEqual = equals(this.props, nextProps);
  }

  /**
   * 设置默认的路由跳转
   */
  getDefaultRedirect = () => {
    const { location } = this.props;

    // const currentPath = location.hash.slice(1);
    // console.log('currentPath: ', currentPath);

    if (location.pathname === '/') {
      this.setState({
        loading: false
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
      ...this.props
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
