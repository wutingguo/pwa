import React from 'react';
import XPureComponent from '@resource/components/XPureComponent';
import XButton from '@resource/components/XButton';
import { countDown } from '@apps/live-photo-client/utils/utils';
import { getImageUrl } from '@apps/live-photo-client/utils/helper';

class SplashScreen extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      time: 1
    };
  }

  componentDidMount() {
    const { time } = this.state;
    countDown(time, this.waitTimeStateChange, this.afterCountDown);
  }

  waitTimeStateChange = time => {
    this.setState({
      time: time
    });
  };

  afterCountDown = () => {
    const { gotoHomePage } = this.props;
    gotoHomePage();
  };

  render() {
    const { envUrls, startPage } = this.props;
    const baseUrl = envUrls.get('saasBaseUrl');
    const enc_image_uid = startPage.get('poster_image');
    const imgUrl = getImageUrl(baseUrl, enc_image_uid);
    const { time } = this.state;
    return (
      <div className="live-photo-screen">
        <div className="screen-box">
          <img className="screen-bg-image" src={imgUrl}></img>
        </div>
        <div className="countdown-box">{time}s</div>
        <div className="screen-btn-box">
          <XButton className="goto-btn" onClicked={() => this.afterCountDown()}>
            {t('LP_GOTO_LIVE_PHOTO')}
          </XButton>
        </div>
      </div>
    );
  }
}

export default SplashScreen;
