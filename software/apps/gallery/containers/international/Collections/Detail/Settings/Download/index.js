import classNames from 'classnames';
import React, { Fragment } from 'react';

import equals from '@resource/lib/utils/compare';

import { XPureComponent } from '@common/components';
import { XCheckBox, XIcon, XInput, XRadio } from '@common/components';

import Switch from '@apps/gallery/components/Switch';

import CollectionDetailHeader from '@gallery/components/CollectionDetailHeader';

import mainHandler from './handle/main';

import './index.scss';

class SettingsDownload extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabs: [
        {
          id: 1,
          name: t('SETTINGS'),
        },
        {
          id: 2,
          name: t('ADVANCED_OPTIONS'),
        },
      ],
      currentTabId: 1,
      //全局下载设置配置，具体初始化在handle/main.js中的updateSettingGroups方法中
      settingGroups: [],
      //高级下载设置配置，具体初始化在handle/main.js中的updateAdvancedOptions方法中
      advancedOptions: {},
      download_limited_num: null,
      clientWhiteList: [],
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
  handleDownloadLimited = (key, status, changeNum) =>
    mainHandler.handleDownloadLimited(this, key, status, changeNum);
  handleManageClients = () => mainHandler.handleManageClients(this);
  setDownloadLimitNum = e => {
    let limited_num = e.target.value.replace(/\D/g, '');
    if (limited_num > 10000) {
      limited_num = 10000;
    }
    this.setState({
      download_limited_num: limited_num < 1 ? 1 : limited_num,
    });
  };
  getRenderItem(item) {
    const { download_limited_num, advancedOptions } = this.state;
    const { key, type, title, desc, text, pin, status, onChanged, isShow = true } = item;
    const { client_restricted } = advancedOptions;
    let html = null;
    const formCompTypes = mainHandler.formCompTypes;
    switch (type) {
      case formCompTypes.SWITCH: {
        const switchProps = {
          id: key,
          checked: status,
          onSwitch: checked => onChanged(this, checked),
        };
        const XInputProps = {
          value: download_limited_num,
          onBlur: () => this.handleDownloadLimited(key, status, true),
          type: 'number',
          // placeholder: '请输入数字',
          onChange: e => this.setDownloadLimitNum(e),
          className: 'download-limited',
          hasSuffix: true,
          isShowSuffix: true,
          suffixIcon: client_restricted ? 'photos per client' : 'photos',
          step: '1',
          min: '1',
          max: '10000',
          inputContainerStyle: {
            width: client_restricted ? '210px' : '130px',
          },
        };
        html = (
          <div className="switch-container">
            <p className="title">{title}</p>
            <Switch {...switchProps} />
            {key === 'DOWNLOAD_PIN' && status && (
              <div className="pin-content-container">
                <span className="pin-desc">{t('PIN')}</span>
                <span className="pin">{pin}</span>
                <span className="reset-pin-btn" onClick={() => mainHandler.resetPin(this)}>
                  {t('RESET_PIN')}
                </span>
              </div>
            )}
            {key === 'LIMIT_PHOTO_DOWNLOAD' && status && <XInput {...XInputProps} />}
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
          onClicked: valueObj => onChanged(this, valueObj.checked),
          checked: status,
          text,
          value: key,
          key: `${key}_${Math.random()}`,
        };
        html = (
          <div className="checkbox-container">
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
    const { key, className, type, title, groupDesc, text, status, items, onChanged } = group;
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
    const { advancedOptions, clientWhiteList } = this.state;
    const { setsSettings, downloadNumGroups, client_restricted } = advancedOptions;
    const emptyHtml = <div className="empty-content-tip">{t('TIPS_EMPTY_SETS')}</div>;
    if (!setsSettings || !setsSettings.length) {
      return null;
    }
    const html = (
      <div className="advanced-options-container">
        <div className="download-sets-container">
          <p className="download-sets-title">{t('DOWNLOAD_SETS_TITLE')}</p>
          <div className="set-item-list">
            {setsSettings.map(set => {
              const { set_uid, set_name, download_status } = set;
              const radioProps = {
                skin: 'black-theme',
                onClicked: value => mainHandler.onSetDownloadStatusSwitch(this, value, true),
                checked: download_status,
                text: t('AVAILABLE'),
                value: set_uid,
              };
              const unavailRadioOptions = {
                ...radioProps,
                onClicked: value => mainHandler.onSetDownloadStatusSwitch(this, value, false),
                text: t('UNAVAILABLE'),
                checked: !download_status,
              };
              return (
                <div className="set-item" key={set_uid}>
                  <span className="set-name">{set_name}</span>
                  <XRadio {...radioProps} />
                  <XRadio {...unavailRadioOptions} />
                </div>
              );
            })}
          </div>
          <p className="desc">{t('DOWNLOAD_SETS_DESC')}</p>
        </div>
        <div className="limit-photo-downloads">
          {downloadNumGroups &&
            downloadNumGroups.length &&
            downloadNumGroups.map(i => this.getRenderGroup(i))}
        </div>
        {client_restricted ? (
          <div className="client-restricted-list">
            <div className="client-restricted-title">{t('Collection Clients')}</div>
            <div className="client-list">
              {clientWhiteList.length ? (
                clientWhiteList.map(item => {
                  return (
                    <div className="client-item" key={item.client_email}>
                      {item.client_email}
                    </div>
                  );
                })
              ) : (
                <div className="client-empty"> No collection clients yet!</div>
              )}
            </div>
            <div className="manage-clients" onClick={() => this.handleManageClients()}>
              Manage Clients
            </div>
          </div>
        ) : null}
      </div>
    );
    return html;
  };

  changeTab = tabId => {
    this.setState({
      currentTabId: tabId,
    });
  };

  render() {
    const {
      history,
      match: { params },
      collectionPreviewUrl,
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
    const { tabs, currentTabId, common_download_status } = this.state;
    return (
      <Fragment>
        <div className="gllery-collection-detail-settings-download">
          {/* 主渲染区域. */}
          <div className="content">
            {/* settings header */}
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
            <div className="tab-layout">
              {tabs.map(tab => {
                if (tab.id === 2 && !common_download_status) {
                  return null;
                }
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
            {currentTabId === tabs[0].id && this.getCommonSettingsHtml()}
            {currentTabId === tabs[1].id && this.getAdvanceOptionsHtml()}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default SettingsDownload;
