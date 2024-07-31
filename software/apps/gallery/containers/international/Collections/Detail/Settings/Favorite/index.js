import React, { Fragment } from 'react';
import { XPureComponent } from '@common/components';
import equals from '@resource/lib/utils/compare';
import CollectionDetailHeader from '@gallery/components/CollectionDetailHeader';
import Switch from '@apps/gallery/components/Switch';

import mainHandler from './handle/main';

import './index.scss';
class SettingsFavorite extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpenFavoriteStatus: true,
      isOpenNotes: true,
      isShowNoteSwitch: true
    };
  }

  componentDidMount() {
    this.willReceiveProps();
  }

  componentWillReceiveProps(nextProps) {
    const isEqual = equals(this.props, nextProps);
    if (!isEqual) {
      this.willReceiveProps(nextProps);
    }
  }

  willReceiveProps = nextProps => mainHandler.willReceiveProps(this, nextProps);
  getFavoriteStatusSwitchProps = () => mainHandler.getFavoriteStatusSwitchProps(this);
  getNotesSwitchProps = () => mainHandler.getNotesSwitchProps(this);

  render() {
    const {
      history,
      match: { params },
      collectionPreviewUrl,
      collectionsSettings
    } = this.props;

    const { isShowNoteSwitch } = this.state;

    // settings header
    const { id } = params;
    const headerProps = {
      history,
      collectionPreviewUrl,
      collectionId: id,
      title: t('FAVORITE_SETTINGS'),
      hasHandleBtns: false
    };

    return (
      <Fragment>
        <div className="gllery-collection-detail-settings-favorite">
          {/* 主渲染区域. */}
          <div className="content">
            {/* settings header */}
            <CollectionDetailHeader {...headerProps} />
            {collectionsSettings && collectionsSettings.size ? (
              <div className="settings-favorite-wrap">
                <div className="favorite-item">
                  <div className="item-name">{t('FAVORITE_STATUS')}</div>
                  <div className="item-content">
                    <Switch {...this.getFavoriteStatusSwitchProps()} />
                    <div className="tip-wrap">
                      <span className="tip-msg ellipsis" title={t('FAVORITE_STATUS_TIP')}>
                        {t('FAVORITE_STATUS_TIP')}
                      </span>
                    </div>
                  </div>
                </div>
                {isShowNoteSwitch ? (
                  <div className="favorite-item">
                    <div className="item-name">{t('NOTES')}</div>
                    <div className="item-content">
                      <Switch {...this.getNotesSwitchProps()} />
                      <div className="tip-wrap">
                        <span className="tip-msg ellipsis" title={t('NOTES_TIP')}>
                          {t('NOTES_TIP')}
                        </span>
                        {/* <a className="more-link">{t('LEARN_MORE')}</a> */}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default SettingsFavorite;
