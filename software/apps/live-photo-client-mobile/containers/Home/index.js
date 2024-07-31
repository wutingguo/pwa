import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import XPureComponent from '@resource/components/XPureComponent';

import AuthorityBox from '@apps/live-photo-client-mobile/components/AuthorityBox';
import Empty from '@apps/live-photo-client-mobile/components/Empty';
import FaceUploadForm from '@apps/live-photo-client-mobile/components/FaceUploadForm';
import ModalEntry from '@apps/live-photo-client-mobile/components/ModalEntry';
import SplashScreen from '@apps/live-photo-client-mobile/components/SplashScreen';
import loading from '@apps/live-photo-client-mobile/icons/loading.gif';
import mapDispatch from '@apps/live-photo-client-mobile/redux/selector/mapDispatch';
import mapState from '@apps/live-photo-client-mobile/redux/selector/mapState';
import { getDownloadUrl } from '@apps/live-photo-client-mobile/utils/helper';

import Home from './Home';
import './style/index.css';

import './index.scss';

@connect(mapState, mapDispatch)
class Index extends XPureComponent {
  constructor(props) {
    super(props);
    this.timeId = null;
    this.state = {
      urls: props.urls.toJS(),
      qs: props.qs.toJS(),
      isLoading: true,
      showFaceModal: false, // US-直播 人脸上传表单
      selfieCheckInEnable: false, // 打开隐私模式
    };
  }

  componentDidMount() {
    const { boundProjectActions, startPage, boundGlobalActions } = this.props;
    this.hiddenLoading();
    const pageSwitch = startPage?.get('start_page_switch');
    pageSwitch && boundProjectActions.showSplashScreen();
  }

  gotoHomePage = () => {
    const { boundProjectActions } = this.props;
    boundProjectActions.hideSplashScreen();
  };

  componentDidUpdate(preProps) {
    const { isLoadCompleted, logoInfo } = this.props;
    // console.log('logoInfo', logoInfo);
    if (typeof isLoadCompleted === 'boolean' && isLoadCompleted && logoInfo) {
      this.hiddenLoading();
    }
  }

  hiddenLoading = isClear => {
    if (isClear) {
      clearTimeout(this.timeId);
      this.timeId = null;
    }
    if (this.timeId) return;
    const { logoInfo } = this.props;
    if (!logoInfo) return;
    const time = logoInfo.loading_time ? logoInfo.loading_time * 1000 : 1000;
    if (!logoInfo.switch_status) {
      this.setState({
        isLoading: false,
      });
      return;
    }
    this.setState(
      {
        isLoading: true,
      },
      () => {
        this.timeId = setTimeout(() => {
          clearTimeout(this.timeId);
          this.setState({
            isLoading: false,
          });
        }, time);
      }
    );
  };

  getLoadingUri = () => {
    const { logoInfo, envUrls } = this.props;
    let uri = './images/loading.gif';
    if (logoInfo.loading_pic && logoInfo.is_default_loading === 1) {
      const baseUrl = envUrls.get('saasBaseUrl');
      uri = getDownloadUrl({ baseUrl, enc_image_uid: logoInfo.loading_pic });
    }
    return uri;
  };

  /**
   * US-直播 切换隐私模式
   * @param {boolean} value 是否打开
   */
  handleChangeSelfieCheckInEnable = value => {
    if (!__isCN__ && value) {
      this.setState({
        selfieCheckInEnable: value,
        showFaceModal: true,
      });
    }
  };

  /**
   * US-直播 人脸上传表单提交成功
   * 跳转到人脸搜索页面，不进入正常图片列表
   */
  onSuccessFace = () => {
    this.setState({ showFaceModal: false });
  };

  render() {
    const { isLoadCompleted, isShowSplashScreen, broadcastAlbum, logoInfo } = this.props;
    const { isLoading, showFaceModal } = this.state;

    // if(1) {
    //   return <Login />
    // }
    if (!logoInfo) return null;
    if (!logoInfo.switch_status && !isLoadCompleted) return null;
    const loadingUrl = this.getLoadingUri();
    if (
      (broadcastAlbum && broadcastAlbum.get('album_del') === 1) ||
      broadcastAlbum?.get('album_expired') === 1 ||
      broadcastAlbum?.get('album_status') === 3
    ) {
      return <Empty />;
    }

    if (logoInfo.switch_status && !isLoadCompleted) {
      return (
        <div className="loading-box">
          <img src={loadingUrl} />
        </div>
      );
    }
    return (
      <AuthorityBox
        className="main-container"
        hiddenLoading={this.hiddenLoading}
        handleChangeSelfieCheckInEnable={this.handleChangeSelfieCheckInEnable} // 打开隐私模式回调
      >
        {!isLoading && isShowSplashScreen ? (
          <SplashScreen
            {...this.props}
            gotoHomePage={this.gotoHomePage}
            isLoading={isLoading}
            style={{ position: 'fixed', width: '100%', height: '100%', zIndex: 10 }}
          />
        ) : null}
        <Home
          style={{ height: isLoading ? 0 : '', overflow: 'auto' }}
          isShow={!isShowSplashScreen}
          isLoading={isLoading}
          loadingUrl={loadingUrl}
          {...this.props}
        />
        <ModalEntry {...this.props} />
        {/* US-直播 人脸上传表单展示时机在动态图后面 */}
        {showFaceModal && !isShowSplashScreen && <FaceUploadForm onClose={this.onSuccessFace} />}
      </AuthorityBox>
    );
  }
}

export default Index;
