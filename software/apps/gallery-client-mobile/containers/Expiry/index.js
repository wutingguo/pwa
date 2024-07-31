import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import XPureComponent from '@resource/components/XPureComponent';
import XLoading from '@resource/components/XLoading';

import mapState from '@apps/gallery-client/redux/selector/mapState';
import mapDispatch from '@apps/gallery-client/redux/selector/mapDispatch';

import expiryIcon from './expiry.png';
import './index.scss';

@connect(mapState, mapDispatch)
class Expiry extends XPureComponent {
  render() {
    const {
      isLoadCollectionCompleted
    } = this.props;

    if (!isLoadCollectionCompleted) {
      return <XLoading />;      
    }

    return (
      <div className="main-container-expiry">
        <div className="page-wrap">
        <img src={expiryIcon} />
        <div className="text">{t('PAGE_NO_LONGER_EXISTS')}</div>
        </div>
      </div>
    );
  }
}

export default Expiry;
