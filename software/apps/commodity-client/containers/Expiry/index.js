import classNames from 'classnames';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import XLoading from '@resource/components/XLoading';
import XPureComponent from '@resource/components/XPureComponent';

import mapDispatch from '@apps/gallery-client/redux/selector/mapDispatch';
import mapState from '@apps/gallery-client/redux/selector/mapState';

import './index.scss';

@connect(mapState, mapDispatch)
class Expiry extends XPureComponent {
  render() {
    const { isLoadCompleted } = this.props;

    if (!isLoadCompleted) {
      return <XLoading />;
    }

    return (
      <div className="main-container-expiry">
        <div className="page-wrap">
          <div className="text">链接已失效，请联系商家客户!</div>
        </div>
      </div>
    );
  }
}

export default Expiry;
