import classNames from 'classnames';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import XLoading from '@resource/components/XLoading';
import XPureComponent from '@resource/components/XPureComponent';

import mapDispatch from '@apps/commodity-client/redux/selector/mapDispatch';
import mapState from '@apps/commodity-client/redux/selector/mapState';

import EmailEnter from './EmailEnter';
import Home from './Home';

// import { isIE } from '@resource/lib/utils/browser';
import './index.scss';

@connect(mapState, mapDispatch)
class Index extends XPureComponent {
  render() {
    const { isLoadCompleted, isLogin } = this.props;

    if (!isLoadCompleted) {
      return (
        <XLoading type="imageLoading" size="lg" zIndex={99} isShown={!isLoadCompleted} />
      );
    }

    return (
      <div className="commodity-main-container">
        {isLogin ? <Home {...this.props} /> : <EmailEnter {...this.props} />}
      </div>
    );
  }
}

export default Index;
