import classNames from 'classnames';
import React, { Component } from 'react';

import ImageBaner from './ImageBaner';
import VideoBanner from './VideoBanner';

import './index.scss';

class Banner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bannerShowed: true,
    };
  }

  componentDidMount() {}

  setOpen = bannerShowed => {
    this.setState({
      bannerShowed,
    });
  };
  render() {
    const { envUrls, banner, activityInfo } = this.props;
    const { bannerShowed } = this.state;

    const banner_vo = activityInfo.get('banner_vo').toJS();
    const { banner_video_info: info, banner_type } = banner_vo || {};

    if (!bannerShowed) return null;
    return (
      <div className="live-photo-banner" style={{ height: banner_type === 3 ? 400 : '' }}>
        {banner_type === 2 ? (
          <ImageBaner envUrls={envUrls} banner={banner} setOpen={this.setOpen} />
        ) : null}
        {banner_type === 3 ? (
          <VideoBanner envUrls={envUrls} info={info} setOpen={this.setOpen} />
        ) : null}
      </div>
    );
  }
}

export default Banner;
