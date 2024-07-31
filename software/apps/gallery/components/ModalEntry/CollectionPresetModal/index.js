import { fromJS } from 'immutable';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { NAME_CN_REG, NAME_REG } from '@resource/lib/constants/reg';

import editorPng from '@resource/static/icons/handleIcon/editor_1.png';

import { XButton, XInput, XModal } from '@common/components';

import DesignSetting from '@apps/gallery/containers/international/Collections/Detail/Settings/Design';
import CollectionSetting from '@apps/gallery/containers/localization/Collections/Detail/Settings/Collection';
import DownloadSetting from '@apps/gallery/containers/localization/Collections/Detail/Settings/Download';
import FavSetting from '@apps/gallery/containers/localization/Collections/Detail/Settings/Favorite';
import StoreSetting from '@apps/gallery/containers/localization/Collections/Detail/Settings/Store';
import SelectionSetting from '@apps/gallery/containers/localization/Collections/Detail/Settings/Selection';
// import SelectionSetting from '@apps/gallery/containers/localization/Collections/Detail/Settings/TempSelection';
import mapDispatch from '@apps/gallery/redux/selector/mapDispatch';
import mapState from '@apps/gallery/redux/selector/mapState';

import './index.scss';

@connect(mapState, mapDispatch)
@withRouter
class CollectionPresetModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curTab: 0,
      templateName: '',
      editorStatus: false,
      settingsCollect: __isCN__
        ? [
            {
              tabName: t('COLLECTION_SETTINGS'),
              id: 'collectionSetting',
              component: CollectionSetting,
            },
            {
              tabName: t('FAVORITE'),
              id: 'favoriteSetting',
              component: FavSetting,
            },
            {
              tabName: t('DOWNLOAD_SETTINGS'),
              id: 'downloadSetting',
              component: DownloadSetting,
            },
            {
              tabName: t('SELECTION_SETTINGS'),
              id: 'selectionSetting',
              component: SelectionSetting,
            },
            {
              tabName: t('STORE_SETTINGS'),
              id: 'storeSetting',
              component: StoreSetting,
            },
          ]
        : [
            {
              tabName: t('COLLECTION_SETTINGS'),
              id: 'collectionSetting',
              component: CollectionSetting,
            },
            {
              tabName: 'Download',
              id: 'downloadSetting',
              component: DownloadSetting,
            },
            {
              tabName: 'Design',
              id: 'DesignSetting',
              component: DesignSetting,
            },
            {
              tabName: 'Store',
              id: 'storeSetting',
              component: StoreSetting,
            },
          ],
    };
  }

  componentDidMount() {
    const { boundProjectActions, data } = this.props;

    const template_id = data.get('template_id');
    if (template_id) {
      boundProjectActions.queryGalleryPreset(template_id).then(() => {
        this.setName();
      });
    } else {
      boundProjectActions.createGalleryPreset().then(() => {
        this.setName();
      });
    }
  }

  setName = () => {
    const { collectionPresetSettings } = this.props;
    const templateName = collectionPresetSettings.get('template_name');
    console.log('templateName: ', templateName);
    this.setState({
      templateName,
    });
  };

  changeNav = i => {
    this.setState({
      curTab: i,
    });
  };

  changeName = name => {
    const { boundGlobalActions } = this.props;
    const nameReg = __isCN__ ? NAME_CN_REG : NAME_REG;

    const isLegal = nameReg.test(name);
    if (!isLegal) {
      boundGlobalActions.addNotification({
        message: t('CREATE_COLLECTION_ILLEGAL_TIP'),
        level: 'error',
        autoDismiss: 3,
      });
      return;
    }
    this.setState({
      templateName: name.slice(0, 20),
    });
  };

  modifyName = () => {
    const { boundProjectActions, urls, collectionPresetSettings } = this.props;
    const template_id = collectionPresetSettings.get('template_id');
    const template_name = collectionPresetSettings.get('template_name');
    const { templateName } = this.state;
    const galleryBaseUrl = urls.get('galleryBaseUrl');
    const bodyParams = {
      template_id,
      template_name: templateName || template_name,
    };
    this.setState({
      editorStatus: false,
      templateName: templateName || template_name,
    });
    boundProjectActions.renamePreset({ galleryBaseUrl, bodyParams });
  };

  render() {
    const { data, collectionPresetSettings } = this.props;
    const { templateName, editorStatus } = this.state;
    const collection_setting = collectionPresetSettings.get('collection_setting');
    const template_name = collectionPresetSettings.get('template_name');
    const { settingsCollect, curTab } = this.state;
    const Comp = settingsCollect[curTab].component;
    const onClose = data.get('onClose');
    const collectionsSettings = fromJS({
      collection_uid: '',
      collection_setting: collection_setting
        ? collection_setting.merge(collectionPresetSettings.get('store_setting'))
        : collection_setting,
      download_setting: collectionPresetSettings.get('download_setting'),
      collection_rule_setting: collectionPresetSettings.get('rule_setting'),
      favorite: collectionPresetSettings.get('favorites_setting'),
      design_setting: collectionPresetSettings.get('design_setting'),
      // collectionsSettings: collectionPresetSettings,
      store_setting: collectionPresetSettings.get('store_setting'),
      can_download_with_high_resolution: collectionPresetSettings.get(
        'can_download_with_high_resolution'
      ),
    });

    return (
      <XModal className="collectionPresetModalWrapper" opened={true} onClosed={onClose}>
        <XButton
          className="confirmBtn"
          onClick={() => {
            window.logEvent.addPageEvent({
              name: 'GalleryPhotos_PresetPop_Click_Confirm',
            });
            onClose();
          }}
        >
          {__isCN__ ? t('CONFIRM') : t('CONFIRMDONE')}
        </XButton>
        <div className="header">
          {editorStatus ? (
            <XInput
              className="nameInput"
              autoFocus={true}
              value={templateName}
              onChange={e => this.changeName(e.target.value)}
              onBlur={this.modifyName}
            />
          ) : (
            <span>{templateName || template_name}</span>
          )}
          <img
            src={editorPng}
            onClick={() => {
              this.setState({ editorStatus: true });
            }}
          />
        </div>
        <div className="presetContainer">
          <div className="navWrapper">
            {settingsCollect.map((item, i) => (
              <div
                className={`navItem ${curTab === i ? 'cur' : ''}`}
                key={item.id}
                onClick={() => this.changeNav(i)}
              >
                {item.tabName}
              </div>
            ))}
          </div>
          <div className="settingWrapper">
            <Comp {...this.props} presetState={true} collectionsSettings={collectionsSettings} />
          </div>
        </div>
      </XModal>
    );
  }
}

export default CollectionPresetModal;
