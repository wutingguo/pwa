import classNames from 'classnames';
import React, { Fragment } from 'react';

import { checkSubscription } from '@resource/lib/utils/checkSubscription';
import equals from '@resource/lib/utils/compare';

import { saasProducts } from '@resource/lib/constants/strings';

import { XPureComponent } from '@common/components';
import { XCheckBox, XIcon, XRadio } from '@common/components';

import Switch from '@apps/gallery/components/Switch';

import CollectionDetailHeader from '@gallery/components/CollectionDetailHeader';

import mainHandler from './handle/main';

import './index.scss';

class SettingsDownload extends XPureComponent {
  constructor(props) {
    super(props);
    const { presetState } = props;
    this.state = {
      tabs: (!__isCN__ && presetState)
        ? [
          {
            id: 1,
            name: t('SETTINGS'),
          },
        ]
        : [
          {
            id: 1,
            name: t('SETTINGS'),
          },
          {
            id: 2,
            name: t('ADVANCED_OPTIONS', '高级选项'),
          },
        ],
      currentTabId: 1,
      //全局下载设置配置，具体初始化在handle/main.js中的updateSettingGroups方法中
      settingGroups: [],
      //高级下载设置配置，具体初始化在handle/main.js中的updateAdvancedOptions方法中
      advancedOptions: {},
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

  instantUpdate = (key, value, msg, cb) => {
    const { collectionPresetSettings, boundProjectActions, envUrls, boundGlobalActions } =
      this.props;
    const galleryBaseUrl = envUrls.get('galleryBaseUrl');
    const template_id = collectionPresetSettings.get('template_id');
    const template_name = collectionPresetSettings.get('template_name');
    const download_setting = collectionPresetSettings.get('download_setting').toJS();
    const setting_type = download_setting.setting_type;
    const bodyParams = {
      template_id,
      template_name,
      download_setting: {
        ...download_setting,
        [key]: value,
      },
    };
    boundProjectActions
      .presetSettingUpdate({ bodyParams, type: setting_type, galleryBaseUrl })
      .then(res => {
        cb && cb();
        if (msg && res.data) {
          boundGlobalActions.addNotification({
            message: msg,
            level: 'success',
            autoDismiss: 2,
          });
        }
      });
  };

  getRenderItem(item) {
    const {
      key,
      type,
      title,
      desc,
      text,
      pin,
      status,
      onChanged,
      isShow = true,
      serviceConfig,
    } = item;
    const { presetState } = this.props;
    let html = null;
    const formCompTypes = mainHandler.formCompTypes;
    switch (type) {
      case formCompTypes.SWITCH: {
        const switchProps = {
          id: key,
          checked: status,
          onSwitch: checked => onChanged(this, checked),
        };
        html = (
          <div className="switch-container">
            <p className="title">{title}</p>
            <Switch {...switchProps} />
            {key === 'DOWNLOAD_PIN' && !presetState && status && (
              <div className="pin-content-container">
                <span className="pin-desc">{t('PIN', '密码')}</span>
                <span className="pin">{pin}</span>
                <span className="reset-pin-btn" onClick={() => mainHandler.resetPin(this)}>
                  {t('RESET_PIN', '重置密码')}
                </span>
              </div>
            )}
            {desc && <p className="desc">{desc}</p>}
          </div>
        );
        break;
      }
      case formCompTypes.RADIO: {
        const radioProps = {
          className: '',
          skin: 'black-theme',
          onClicked: () => onChanged(this, true),
          checked: status,
          text,
          value: key,
        };

        if (!isShow) {
          html = null;
          return;
        }
        html = (
          <div className="switch-container">
            <XRadio {...radioProps} />
          </div>
        );
        break;
      }
      case formCompTypes.CHECKBOX: {
        const checkboxProps = {
          className: 'black-theme',
          onClicked: valueObj => {
            const { resolution_id } = serviceConfig;
            if (resolution_id === 1 && __isCN__) {
              // 高分辨率需要检测 订阅状态
              const { boundGlobalActions, urls, mySubscription } = this.props;
              const params = {
                boundGlobalActions,
                urls,
                mySubscription,
                className: 'creat-gallery-limit-modal',
                upgradTip: t('GALLERY_DOWNLOAD_UPGRADE_TIP'),
                upgradBtn: t('SLIDESHOW_UPGRADE_BTN'),
                productName: saasProducts.gallery,
              };

              if (valueObj.checked && !checkSubscription(params)) {
                return;
              }
            }
            onChanged(this, valueObj.checked);
          },
          checked: status,
          text,
          value: key,
          key: `${key}_${Math.random()}`,
          transkeyProps: `${key}_${Math.random()}`,
        };
        console.log('status: ------', status);
        html = (
          <div className="checkbox-container" key={key}>
            <XCheckBox {...checkboxProps} />
          </div>
        );
        break;
      }
      case formCompTypes.TEXT: {
        html = <div className="text-container title">{text}</div>;
        break;
      }
    }
    return html;
  }

  getRenderGroup(group) {
    const { key, className, type, title, groupDesc, desc, text, status, items, onChanged } = group;
    const newGroupClassName = classNames('setting-group', className);
    const subItemClassName = classNames('sub-item-wrapper', {
      hidden: key === 'DOWNLOAD_STATUS' && !status,
      photoSize: key.startsWith('resolution_type_'),
    });
    let html = (
      <div className={newGroupClassName}>
        {this.getRenderItem(group)}
        {items && items.length && (
          <div className={subItemClassName}>{items.map(i => this.getRenderGroup(i))}</div>
        )}
        {groupDesc && <p className="desc">{groupDesc}</p>}
      </div>
    );
    return html;
  }

  getCommonSettingsHtml = () => {
    const { settingGroups } = this.state;
    if (!settingGroups.length) return null;

    const html = (
      <div className="common-download-settings-container">
        {settingGroups.map(g => this.getRenderGroup(g))}
      </div>
    );

    return html;
  };

  getAdvanceOptionsHtml = () => {
    const { advancedOptions } = this.state;
    const { setsSettings } = advancedOptions;
    const emptyHtml = <div className="empty-content-tip">{t('TIPS_EMPTY_SETS')}</div>;
    if (!setsSettings || !setsSettings.length) {
      return null;
    }
    const html = (
      <div className="advanced-options-container">
        <div className="download-sets-container">
          <p className="download-sets-title">{t('DOWNLOAD_SETS_TITLE')}</p>
          <div className="set-item-list">
            {setsSettings.map((set, index) => {
              const { set_uid, set_name, download_status, selected_download_status } = set;
              const radioProps = {
                skin: 'black-theme',
                onClicked: value =>
                  mainHandler.onSetDownloadStatusSwitch(this, value, {
                    download_status: true,
                    selected_download_status: 0,
                  }, index),
                checked: download_status && !selected_download_status,
                text: t('AVAILABLE'),
                value: set_uid,
              };
              const unavailRadioOptions = {
                ...radioProps,
                onClicked: value =>
                  mainHandler.onSetDownloadStatusSwitch(this, value, {
                    download_status: false,
                    selected_download_status: 0,
                  }, index),
                text: t('UNAVAILABLE'),
                checked: !download_status && !selected_download_status,
              };
              const selectRatio = {
                ...radioProps,
                onClicked: value =>
                  mainHandler.onSetDownloadStatusSwitch(this, value, {
                    selected_download_status: 1,
                  }, index),
                text: t('SELECTED_IMG_DOWNLOAD'),
                checked: selected_download_status,
              };
              return (
                <div className="set-item" key={set_uid}>
                  <span className="set-name">{set_name}</span>
                  <XRadio {...selectRatio} />
                  <XRadio {...radioProps} />
                  <XRadio {...unavailRadioOptions} />
                </div>
              );
            })}
          </div>
          <p className="desc">{t('DOWNLOAD_SETS_DESC')}</p>
        </div>
      </div>
    );
    return html;
  };

  changeTab = tabId => {
    const { settingGroups } = this.state;
    const { boundGlobalActions } = this.props;
    const { addNotification } = boundGlobalActions;
    if (settingGroups[0] && settingGroups[0].status === false && __isCN__) {
      addNotification({
        message: t('请先开启下载状态'),
        level: 'success',
        autoDismiss: 2,
      });
      return;
    }
    this.setState({
      currentTabId: tabId,
    });
  };

  render() {
    const {
      history,
      match: { params },
      collectionPreviewUrl,
      presetState,
    } = this.props;

    // settings header
    const { id } = params;
    const headerProps = {
      history,
      collectionPreviewUrl,
      collectionId: id,
      title: t('DOWNLOAD_SETTINGS'),
      hasHandleBtns: false,
    };
    const { tabs, currentTabId, advancedOptions } = this.state;
    const hideAdvance = !__isCN__ && presetState

    return (
      <Fragment>
        <div
          className={`gllery-collection-detail-settings-download ${
            presetState ? 'presetWrapper' : ''
          }`}
        >
          {/* 主渲染区域. */}
          <div className="content">
            {/* settings header */}
            {!hideAdvance && (
              <Fragment>
                { !presetState &&
                  <div className="download-setting-header-wrapper">
                    <CollectionDetailHeader {...headerProps} />
                    <XIcon
                      className="collection-detail-header-activities"
                      type="activitie"
                      theme="black"
                      text={t('DOWNLOAD_ACTIVITIES')}
                      status="active"
                      onClick={() => mainHandler.jumpToDownloadActivity(this)}
                    />
                  </div>
                }
                <div className="tab-layout">
                  {tabs.map(tab => {
                    return (
                      <span
                        className={tab.id === currentTabId ? 'tab-item active' : 'tab-item'}
                        onClick={() => this.changeTab(tab.id)}
                      >
                        {tab.name}
                      </span>
                    );
                  })}
                </div>
              </Fragment>
            )}
            {currentTabId === tabs[0].id && this.getCommonSettingsHtml()}
            {!hideAdvance && currentTabId === tabs[1].id && this.getAdvanceOptionsHtml()}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default SettingsDownload;
