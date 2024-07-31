import moment from 'moment';
import React, { Component, Fragment } from 'react';

import equals from '@resource/lib/utils/compare';

import { XButton, XInput, XPureComponent } from '@common/components';

import DatePicker from '@apps/gallery/components/DatePicker';
import Switch from '@apps/gallery/components/Switch';

import CollectionDetailHeader from '@gallery/components/CollectionDetailHeader';

import mainHandler from './handle/main';

import './index.scss';

class SettingsDesign extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      defaultValue: 'Jack & Rose',
      inputValue: 'Jack & Rose',
      slugValue: '',
      defaultSlugValue: '',
      slugShowSuffix: false,
      slugShowTip: false,
      isShowSuffix: false,
      isShowTip: false,
      tipContent: '',
      autoExpiryDate: new Date(),
      convertAutoExpiryDate: moment(new Date()).format('YYYY-MM-DD'),
      closeDatePicker: true,
      emailRegistration: false,
      showOnPortfolio: false,
      galleryPasswordSwitch: false,
      galleryPassword: '',
      eventDate: '',
      convertEventDate: '',
      closeEventDatePicker: true,
      isOpenViewImg: true,
      isOpenShareMedia: true,
    };
  }

  componentDidMount() {
    const { collectionsSettings } = this.props;
    console.log('props', collectionsSettings.toJS());
    this.willReceiveProps();
  }

  componentWillReceiveProps(nextProps) {
    const isEqual = equals(this.props, nextProps);
    if (!isEqual) {
      this.willReceiveProps(nextProps);
    }
  }

  componentWillUnmount() {
    this.willUnmount();
  }

  willUnmount = () => mainHandler.willUnmount(this);
  willReceiveProps = nextProps => mainHandler.willReceiveProps(this, nextProps);

  getCollectionNameProps = () => mainHandler.getCollectionNameProps(this);
  getCollectionSlugProps = () => mainHandler.getCollectionSlugProps(this);
  getAutoExpiryProps = type => mainHandler.getAutoExpiryProps(this, type);
  getDatePickerProps = type => mainHandler.getDatePickerProps(this, type);
  getSwitchProps = () => mainHandler.getSwitchProps(this);
  getViewImgSwitchProps = () => mainHandler.getViewImgSwitchProps(this);
  getShareSwitchProps = () => mainHandler.getShareSwitchProps(this);
  getPasswordSwitchProps = () => mainHandler.getPasswordSwitchProps(this);
  resetGalleryPassword = () => mainHandler.resetGalleryPassword(this);
  getPortfolioProps = () => mainHandler.getPortfolioProps(this);
  handleViewLink = () => mainHandler.handleViewLink(this);

  render() {
    const {
      history,
      match: { params },
      collectionPreviewUrl,
      collectionsSettings,
    } = this.props;

    const { closeDatePicker, galleryPasswordSwitch, galleryPassword, closeEventDatePicker } =
      this.state;

    const domain_name = collectionsSettings.getIn(['collection_setting', 'domain_name']);
    const url_slug = collectionsSettings.getIn(['collection_setting', 'url_slug']);

    // settings header
    const { id } = params;
    const headerProps = {
      history,
      collectionPreviewUrl,
      collectionId: id,
      title: t('COLLECTION_SETTINGS'),
      hasHandleBtns: false,
    };

    const collectionUrl = `${domain_name}/${url_slug}`;

    return (
      <Fragment>
        <div className="gllery-collection-detail-collection-settings">
          {/* 主渲染区域. */}
          <div className="content">
            {/* settings header */}
            <CollectionDetailHeader {...headerProps} />

            {/* collection settings 区域 */}
            {collectionsSettings && collectionsSettings.size ? (
              <div className="collection-settings-wrap">
                <div className="settings-item">
                  <div className="item-name">{t('COLLECTION_NAME')}</div>
                  <div className="item-content">
                    <XInput {...this.getCollectionNameProps()} />
                    <span className="tip-msg ellipsis">{t('COLLECTION_NAME_TIP')}</span>
                  </div>
                </div>
                <div className="settings-item">
                  <div className="item-name">Event Date</div>
                  <div className="item-content">
                    <XInput {...this.getAutoExpiryProps('EventDate')} />
                    {closeEventDatePicker ? null : (
                      <div className="date-picker-wrap date-picker-wrap1">
                        <DatePicker {...this.getDatePickerProps('EventDate')} minDate="" />
                      </div>
                    )}
                    <span className="tip-msg">Pick a date that shows time of the event.</span>
                  </div>
                </div>
                <div className="settings-item">
                  <div className="item-name">{t('AUTO_EXPIRY')}</div>
                  <div className="item-content">
                    <XInput {...this.getAutoExpiryProps()} />
                    {closeDatePicker ? null : (
                      <div className="date-picker-wrap date-picker-wrap2">
                        <DatePicker {...this.getDatePickerProps()} />
                      </div>
                    )}
                    <span className="tip-msg ellipsis">{t('AUTO_EXPIRY_TIP')}</span>
                  </div>
                </div>
                <div className="settings-item">
                  <div className="item-name">{t('COLLECTION_SLUG')}</div>
                  <div className="item-content slug-item-content">
                    <XInput {...this.getCollectionSlugProps()} />
                    <span
                      className="tip-msg ellipsis"
                      dangerouslySetInnerHTML={{
                        __html: t('COLLECTION_SLUG_TIP', { url: `<b><i>${collectionUrl}</i></b>` }),
                      }}
                    />
                  </div>
                </div>
                <div className="settings-item">
                  <div className="item-name">{t('EMAIL_REGISTRATION')}</div>
                  <div className="item-content">
                    <Switch {...this.getSwitchProps()} />
                    <div className="tip-wrap">
                      <span className="tip-msg ellipsis">{t('EMAIL_REGISTRATION_TIP')}</span>
                      {/* <a className="more-link">{t('LEARN_MORE')}</a> */}
                    </div>
                  </div>
                </div>
                <div className="settings-item">
                  <div className="item-name">{t('GALLERY_CLIENT_PASSWORD')}</div>
                  <div className="item-content">
                    <Switch {...this.getPasswordSwitchProps()} />
                    <div className="collection-content-container">
                      {galleryPasswordSwitch && !!galleryPassword && (
                        <div className="extra">
                          <span>
                            <span className="label">{t('PASSWORD')}</span>: {galleryPassword}
                          </span>
                          <span className="label btn" onClick={this.resetGalleryPassword}>
                            {t('RESET_PASSWORD')}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="tip-wrap">
                      <span className="tip-msg ellipsis">{t('GALLERY_CLIENT_PASSWORD_TIP')}</span>
                    </div>
                  </div>
                </div>
                {/* PORTFOLIO--TAB and Collection Settings */}
                {!__isCN__ && (
                  <div className="settings-item">
                    <div className="item-name">{t('SHOW_ON_PORTFOLIO')}</div>
                    <div className="item-content">
                      <Switch {...this.getPortfolioProps()} />
                      <div className="tip-wrap">
                        <span className="tip-msg ellipsis">
                          {t('SHOW_ON_PORTFOLIO_TIP')}
                          <span className="tip-mag-link" onClick={this.handleViewLink}>
                            {t('SHOW_ON_PORTFOLIO_TIP_LINK')}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                {!__isCN__ && (
                  <div className="settings-item">
                    <div className="item-name">{t('FAVORITE_VIEW_IMAGE')}</div>
                    <div className="item-content">
                      <Switch {...this.getViewImgSwitchProps()} />
                      <div className="tip-wrap">
                        <span className="tip-msg ellipsis">{t('FAVORITE_VIEW_IMAGE_DESC')}</span>
                      </div>
                    </div>
                  </div>
                )}
                {!__isCN__ && (
                  <div className="settings-item">
                    <div className="item-name">Social Sharing</div>
                    <div className="item-content">
                      <Switch {...this.getShareSwitchProps()} />
                      <div className="tip-wrap">
                        <span className="tip-msg ellipsis">
                          Allow your clients to share the collection on social media.
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default SettingsDesign;
