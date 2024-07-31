import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import XPureComponent from '@resource/components/XPureComponent';
import mapState from '@apps/website-tool-client/redux/selector/mapState';
import mapDispatch from '@apps/website-tool-client/redux/selector/mapDispatch';
// import { isIE } from '@resource/lib/utils/browser';

import './index.scss';

@connect(mapState, mapDispatch)
class Index extends XPureComponent {
  render() {
    return <div className="main-container"></div>;
  }
}

export default Index;
