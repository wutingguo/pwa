import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import XPureComponent from '@resource/components/XPureComponent';
import XLoading from '@resource/components/XLoading';
import mapState from '@apps/slide-show-client-mobile/redux/selector/mapState';
import mapDispatch from '@apps/slide-show-client-mobile/redux/selector/mapDispatch';
import Home from './Home';
import EmailEnter from './EmailEnter';

import './index.scss';

@connect(mapState, mapDispatch)
class Index extends XPureComponent {
  render() {
    const { isLoadCollectionCompleted, isRequiredPosswordBeforeViewing } = this.props;

    if (!isLoadCollectionCompleted) {
      return (
        <XLoading type="imageLoading" size="lg" zIndex={99} isShown={!isLoadCollectionCompleted} />
      );
    }

    return (
      <div className="main-container">
        {isRequiredPosswordBeforeViewing ? (
          <EmailEnter {...this.props} />
        ) : (
          <Home {...this.props} />
        )}
      </div>
    );
  }
}

export default Index;
