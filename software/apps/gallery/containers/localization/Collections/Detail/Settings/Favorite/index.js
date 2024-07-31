import React, { Fragment } from 'react';

import equals from '@resource/lib/utils/compare';

import { XPureComponent } from '@common/components';
import { XIcon } from '@common/components';

import Switch from '@apps/gallery/components/Switch';

import CollectionDetailHeader from '@gallery/components/CollectionDetailHeader';

import mainHandler from './handle/main';

import './index.scss';

class SettingsFavorite extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpenFavoriteStatus: true,
      isOpenNotes: true,
      isShowNoteSwitch: true,
      labels: [],
      isOpenFavoriteViewImg: true,
      isOpenPreviewSave: false,
    };
  }

  async componentDidMount() {
    const { boundProjectActions, collectionsSettings } = this.props;
    const collection_uid = collectionsSettings.get('enc_collection_uid');
    collection_uid && (await boundProjectActions.getCollectionsSettings(collection_uid));
    this.willReceiveProps();
  }

  componentWillReceiveProps(nextProps) {
    const { collectionsSettings: nextCollectionsSettings } = nextProps;
    const { collectionsSettings } = this.props;
    const isEqual = equals(nextCollectionsSettings, collectionsSettings);
    if (!isEqual) {
      this.willReceiveProps(nextProps);
    }
  }
  willReceiveProps = nextProps => mainHandler.willReceiveProps(this, nextProps);
  getFavoriteStatusSwitchProps = () => mainHandler.getFavoriteStatusSwitchProps(this);
  getFavoriteViewImgSwitchProps = () => mainHandler.getFavoriteViewImgSwitchProps(this);
  getFavoritePreViewSaveProps = () => mainHandler.getFavoritePreViewSaveProps(this);
  getNotesSwitchProps = () => mainHandler.getNotesSwitchProps(this);
  getLabelsSwitchProps = item => mainHandler.getLabelsSwitchProps(this, item);

  instantUpdate = (key, value, msg) => {
    const { collectionPresetSettings, boundProjectActions, envUrls, boundGlobalActions } =
      this.props;
    const galleryBaseUrl = envUrls.get('galleryBaseUrl');
    const template_id = collectionPresetSettings.get('template_id');
    const template_name = collectionPresetSettings.get('template_name');
    const favorites_setting = collectionPresetSettings.get('favorites_setting').toJS();
    const setting_type = favorites_setting.setting_type;
    const bodyParams = {
      template_id,
      template_name,
      favorites_setting: {
        ...favorites_setting,
        [key]: value,
      },
    };
    boundProjectActions
      .presetSettingUpdate({ bodyParams, type: setting_type, galleryBaseUrl })
      .then(res => {
        if (msg && res.data) {
          boundGlobalActions.addNotification({
            message: msg,
            level: 'success',
            autoDismiss: 2,
          });
        }
      });
  };

  updateLabel = labelParams => {
    const { modify_type } = labelParams;
    window.logEvent.addPageEvent({
      name: 'GalleryFavorite_Click_EditTagName',
    });
    if (modify_type === 1) {
      mainHandler.handleRename(this, labelParams);
    }
  };
  render() {
    const {
      history,
      match: { params },
      collectionPreviewUrl,
      collectionsSettings,
      presetState,
    } = this.props;

    const { isShowNoteSwitch, isOpenNotes, labels } = this.state;

    // settings header
    const { id } = params;
    const headerProps = {
      history,
      collectionPreviewUrl,
      collectionId: id,
      hasHandleBtns: false,
      title: t('FAVORITE_SETTINGS'),
    };

    return (
      <Fragment>
        <div
          className={`gllery-collection-detail-settings-favorite ${
            presetState ? 'presetWrapper' : ''
          }`}
        >
          {/* 主渲染区域. */}
          <div className="content">
            {/* settings header */}
            {!presetState && <CollectionDetailHeader {...headerProps} />}
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
                  <div className="favorite-item notes">
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
                    {isShowNoteSwitch && (
                      <div className="item-custom-tag">
                        <div className="item-name">自定义标签</div>
                        {labels.length &&
                          labels.map(item => (
                            <div className="item-content" key={item.id}>
                              <span className="custom-tag-name">{item.label_name}</span>
                              <span className="custom-tag-icon">
                                <XIcon
                                  type="edit"
                                  iconHeight={12}
                                  iconWidth={12}
                                  onClick={() =>
                                    this.updateLabel({
                                      label_code: item.label_code,
                                      modify_type: 1,
                                    })
                                  }
                                ></XIcon>
                              </span>
                              <Switch {...this.getLabelsSwitchProps(item)} />
                            </div>
                          ))}
                        <div className="tip-wrap">
                          <span className="tip-msg ellipsis">
                            允许客户向自己喜欢的照片添加您的自定义标签，您可以将标签名更改为适合您业务的名称。
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}
                {__isCN__ && (
                  <div className="favorite-item">
                    <div className="item-name">{t('FAVORITE_VIEW_IMAGE')}</div>
                    <div className="item-content">
                      <Switch {...this.getFavoriteViewImgSwitchProps()} />
                      <div className="tip-wrap">
                        <span className="tip-msg ellipsis" title={t('FAVORITE_VIEW_IMAGE_DESC')}>
                          {t('FAVORITE_VIEW_IMAGE_DESC')}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div className="favorite-item">
                  <div className="item-name">{t('FAVORITE_PREVIEW_SAVE')}</div>
                  <Switch {...this.getFavoritePreViewSaveProps()} />
                  <div className="tip-wrap">
                    <span className="tip-msg ellipsis" title={t('FAVORITE_PREVIEW_SAVE_DESC')}>
                      {t('FAVORITE_PREVIEW_SAVE_DESC')}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default SettingsFavorite;
