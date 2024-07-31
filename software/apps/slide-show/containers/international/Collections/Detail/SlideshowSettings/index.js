import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { XPureComponent, XInput, XButton } from '@common/components';
import equals from '@resource/lib/utils/compare';
import Switch from '@apps/gallery/components/Switch';

import mainHandler from './handle/main';

import './index.scss';
class SlideshowSettings extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      emailRegistration: false,
      slideshow_password_switch: false,
      slideshow_password: '',
      domain_name: '',
      segment_name: 'slideshow',
      url_slug: '',
      slugValue: '',
      defaultSlugValue: '',
      slugShowSuffix: false,
      slugShowTip: false,
      isShowSuffix: false,
      isShowTip: false,
      tipContent: '',
    };
  }

  componentDidMount() {
    this.didMount();
  }

  componentWillReceiveProps(nextProps) {
    const isEqual = equals(this.props, nextProps);
    if (!isEqual) {
      this.willReceiveProps(nextProps);
    }
  }

  didMount = () => mainHandler.didMount(this);
  willReceiveProps = nextProps => mainHandler.willReceiveProps(this, nextProps);

  getPasswordSwitchProps = () => mainHandler.getPasswordSwitchProps(this);
  getSlideshowUrlProps = () => mainHandler.getSlideshowUrlProps(this);
  resetPassword = () => mainHandler.resetPassword(this);

  render() {
    const {
      history,
      match: { params }
    } = this.props;

    const { slideshow_password_switch, slideshow_password, domain_name, slugValue, segment_name, url_slug } = this.state;

    // settings header
    const { id } = params;

    const slugUrl = `${domain_name}/${segment_name}/${url_slug}`;

    return (
      <Fragment>
        <div className="slide-show-editor-content-wrapper slide-show-collection-detail-slide-show-settings">
          {/* 主渲染区域. */}
          <div className="content">
            <div className="setting-head">{t('SLIDESHOW_TITLE')}</div>

            <div className="collection-settings-wrap">
              <div className="settings-item">
                <div className="item-name">{t('SLIDESHOW_SLUG')}</div>
                <div className="item-content slug-item-content">
                  <XInput {...this.getSlideshowUrlProps()} />
                  {/* <span
                    className="tip-msg ellipsis"
                    title={t('SLIDESHOW_SLUG_TIP')}
                  >{t('SLIDESHOW_SLUG_TIP')}</span> */}
                  <span
                      className="tip-msg ellipsis"
                      dangerouslySetInnerHTML={{
                        __html: t('SLIDESHOW_SLUG_TIP', { url: domain_name ? `<b><i>${slugUrl}</i></b>`: 'this URL' }),
                      }}
                    />
                </div>
              </div>
              <div className="settings-item">
                <div className="item-name">Slideshow Password</div>
                <div className="item-content">
                  <Switch {...this.getPasswordSwitchProps()} />
                  <div className="collection-content-container">
                    {slideshow_password_switch && !!slideshow_password && (
                      <div className="extra">
                        <span>
                          <span className="label">{t('PASSWORD')}</span>: {slideshow_password}
                        </span>
                        <span className="label btn" onClick={this.resetPassword}>
                          {t('RESET_PASSWORD')}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="tip-wrap">
                    <span className="tip-msg ellipsis">
                    Your clients will be required to enter the password to see the slideshow.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default SlideshowSettings;
