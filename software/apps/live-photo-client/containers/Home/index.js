import classNames from 'classnames';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import XLoading from '@resource/components/XLoading';
import XPureComponent from '@resource/components/XPureComponent';

import AuthorityBox from '@apps/live-photo-client/components/AuthorityBox';
import ModalEntry from '@apps/live-photo-client/components/ModalEntry';
import mapDispatch from '@apps/live-photo-client/redux/selector/mapDispatch';
import mapState from '@apps/live-photo-client/redux/selector/mapState';

import Home from './Home';

// import SplashScreen from './handle/SplashScreen';
// import SplashScreen from '@apps/live-photo-client/components/SplashScreen';
import './index.scss';

@connect(mapState, mapDispatch)
class Index extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      urls: props.urls.toJS(),
      qs: props.qs.toJS(),
    };
  }

  componentDidMount() {}

  gotoHomePage = () => {
    const { boundProjectActions } = this.props;
    boundProjectActions.hideSplashScreen();
  };

  render() {
    const {
      isLoadCompleted,
      // isShowSplashScreen,
      broadcastAlbum,
    } = this.props;
    if (!isLoadCompleted) {
      return <XLoading type="imageLoading" size="lg" zIndex={99} isShown={!isLoadCompleted} />;
    }
    return (
      <AuthorityBox className="main-container" broadcastAlbum={broadcastAlbum}>
        <Home {...this.props} />
        <ModalEntry {...this.props} />
      </AuthorityBox>
    );
  }
}

export default Index;
