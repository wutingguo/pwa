import classNames from 'classnames';
import React from 'react';

import XButton from '@resource/components/XButton';
import XPureComponent from '@resource/components/XPureComponent';

import { getImageUrl } from '@apps/live-photo-client-mobile/utils/helper';
import { countDown } from '@apps/live-photo-client-mobile/utils/utils';

import './index.scss';

class SplashScreen extends XPureComponent {
  constructor(props) {
    super(props);
    const { startPage } = props;
    const { count_down_value, count_down_switch } = startPage.get('count_down_setting').toJS();
    this.timeId = null;
    this.countdownSwitch = count_down_switch;
    this.state = {
      isShowBtn: false,
      isShowTiem: false,
      isCover: false,
      time: count_down_value || 3, // 默认为3秒
    };
  }

  componentDidMount() {
    this.init();
  }

  init = () => {
    if (this.timeId) {
      clearTimeout(this.timeId);
      this.timeId = null;
    }
    const { startPage } = this.props;
    const enc_image_uid = startPage.get('poster_image');
    const hasCostomPage = startPage.get('poster_method') !== 0;
    if (!enc_image_uid || !hasCostomPage) {
      this.startCountDown();
      this.setState({
        isShowBtn: true,
      });
    } else {
      this.timeId = setTimeout(() => {
        this.setState({
          isShowBtn: true,
        });
      }, 3000);
    }
  };

  waitTimeStateChange = time => {
    this.setState({
      time: time + 1,
    });
  };

  afterCountDown = () => {
    const { gotoHomePage } = this.props;
    gotoHomePage();
  };

  onLoadImage(i) {
    const { naturalHeight, naturalWidth } = i.target;
    const { height, width } = window.screen;
    const imgRatio = naturalHeight / naturalWidth;
    const screenRatio = height / width;
    if (imgRatio <= screenRatio) {
      this.setState({
        isCover: true,
      });
    }
    this.startCountDown();
    this.setState({
      isShowBtn: true,
    });
  }

  /**
   * 新增启动倒计时开关信息
   * 开启后，H5的直播间的启动页支持在倒计时后自动进入相册和手动点击按钮进入相册
   * 关闭后，H5的直播间的启动页仅支持手动点击按钮进入相册
   */
  startCountDown() {
    const { time } = this.state;
    if (this.countdownSwitch) {
      countDown(time, this.waitTimeStateChange, this.afterCountDown);
    }
    this.setState({
      isShowTiem: this.countdownSwitch,
    });
  }

  render() {
    const { isShowTiem, isShowBtn, isCover } = this.state;
    const { envUrls, startPage, style } = this.props;
    const baseUrl = envUrls.get('saasBaseUrl');
    const enc_image_uid = startPage.get('poster_image');
    const button_text = startPage.get('button_text');
    const imgUrl = getImageUrl(baseUrl, enc_image_uid);
    const hasCostomPage = startPage.get('poster_method') !== 0;
    const { time } = this.state;
    const iClassName = classNames('screen-bg-image', {
      cover: isCover,
      transform: isShowBtn,
    });
    return (
      <div className="live-photo-screen" style={style}>
        <div className="screen-box">
          {enc_image_uid && hasCostomPage && (
            <img
              className={iClassName}
              src={`${imgUrl}&temp=${new Date().getTime()}`}
              onLoad={i => this.onLoadImage(i)}
            ></img>
          )}
          {(!enc_image_uid || !hasCostomPage) && (
            <div className="default-text">
              <span>{t('LPCM_LIVE_SHARE')}</span>
            </div>
          )}
        </div>
        {isShowTiem && <div className="countdown-box">{time}s</div>}
        {isShowBtn && (
          <div className="screen-btn-box">
            <XButton className="goto-btn" onClicked={() => this.afterCountDown()}>
              {button_text || t('LP_GOTO_LIVE_PHOTO')}
            </XButton>
          </div>
        )}
      </div>
    );
  }
}

export default SplashScreen;
