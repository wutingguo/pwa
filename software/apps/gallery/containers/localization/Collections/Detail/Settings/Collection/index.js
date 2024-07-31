import moment from 'moment';
import React, { Component, Fragment } from 'react';

import equals from '@resource/lib/utils/compare';

import { NAME_CN_REG, NAME_REG, SPACE_REG } from '@resource/lib/constants/reg';

import deleteIcon from '@resource/static/icons/delete2.png';

import { XButton, XCheckBox, XIcon, XInput, XPureComponent, XRadio } from '@common/components';

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
      isShowSuffix: false,
      isShowTip: false,
      tipContent: '',
      autoExpiryDate: new Date(),
      convertAutoExpiryDate: moment(new Date()).format('YYYY-MM-DD'),
      eventDate: '',
      convertEventDate: '',
      closeEventDatePicker: true,
      closeDatePicker: true,
      emailRegistration: false,
      showOnPortfolio: false,
      galleryPasswordSwitch: false,
      galleryPassword: '',
      addLabelProcess: false,
      labelName: '',
      deadlineDays: 1,
      login_information_config: {},
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

  componentWillUnmount() {
    this.willUnmount();
  }

  willUnmount = () => mainHandler.willUnmount(this);
  willReceiveProps = nextProps => mainHandler.willReceiveProps(this, nextProps);

  getCollectionNameProps = () => mainHandler.getCollectionNameProps(this);
  getAutoExpiryProps = type => mainHandler.getAutoExpiryProps(this, type);
  getDatePickerProps = type => mainHandler.getDatePickerProps(this, type);
  getPortfolioProps = () => mainHandler.getPortfolioProps(this);
  getSwitchProps = () => mainHandler.getSwitchProps(this);
  getPasswordSwitchProps = () => mainHandler.getPasswordSwitchProps(this);
  resetGalleryPassword = () => mainHandler.resetGalleryPassword(this);
  handleViewLink = () => mainHandler.handleViewLink(this);
  updateLoginSetting = item => mainHandler.updateLoginSetting(this, item);
  editLoginSettingCustomName = item => mainHandler.editLoginSettingCustomName(this, item);
  instantUpdate = (key, value, msg) => {
    const { collectionPresetSettings, boundProjectActions, envUrls, boundGlobalActions } =
      this.props;
    const galleryBaseUrl = envUrls.get('galleryBaseUrl');
    const template_id = collectionPresetSettings.get('template_id');
    const template_name = collectionPresetSettings.get('template_name');
    const collection_setting = collectionPresetSettings.get('collection_setting').toJS();
    const setting_type = collection_setting.setting_type;
    const bodyParams = {
      template_id,
      template_name,
      collection_setting: {
        ...collection_setting,
        [key]: value,
      },
    };
    console.log('bodyParams: ', bodyParams);
    boundProjectActions
      .presetSettingUpdate({ bodyParams, type: setting_type, galleryBaseUrl })
      .then(res => {
        if (msg && res.data) {
          boundGlobalActions.addNotification({
            message: `已成功更新${msg}`,
            level: 'success',
            autoDismiss: 2,
          });
        }
      });
  };

  changeDeadline = e => {
    const value = e.target.value.replace(/\D/g, '');
    this.setState({
      deadlineDays: value < 1 ? 1 : value,
    });
  };

  deleteLabel = name => {
    const { boundGlobalActions } = this.props;
    const { set_names = [] } = this.state;
    console.log('set_names: ', set_names);
    if (set_names.size === 1) {
      boundGlobalActions.addNotification({
        message: t('LEAST_ONE_LEFT'),
        level: 'error',
        autoDismiss: 2,
      });
      return;
    }
    this.setState(
      {
        set_names: set_names.filter(item => item !== name),
      },
      () => {
        const msg = t('DELETE_PHOTO_SET_SUCCESSED', { setName: name });
        this.instantUpdate('set_names', this.state.set_names, msg);
      }
    );
  };

  setPinName = item => {
    this.setState({
      currentItem: item,
      pinName: item,
    });
  };

  changeItemLabel = () => {
    const { currentItem, set_names, pinName } = this.state;
    const checkIn = this.checkLabeName(currentItem, false);
    if (!checkIn) {
      this.setState({
        currentItem: '',
        pinName: '',
      });
      return;
    }
    this.setState(
      {
        set_names: set_names.map(item => {
          if (pinName === item) {
            return currentItem;
          }
          return item;
        }),
        tipContent: '',
      },
      () => {
        const msg = t('ADD_PHOTO_SET_SUCCESSED', { setName: currentItem });
        this.instantUpdate('set_names', this.state.set_names, msg);
      }
    );
    this.setState({
      currentItem: '',
      pinName: '',
    });
  };

  changeItemLabeName = name => {
    this.setState({
      currentItem: name,
    });
  };

  startAddLabel = status => {
    this.setState({
      addLabelProcess: status,
    });
  };

  checkLabeName = (labelName, checkRepetition = true) => {
    const { boundGlobalActions } = this.props;
    const { set_names } = this.state;
    const nameReg = __isCN__ ? NAME_CN_REG : NAME_REG;
    const isEmptyStr = SPACE_REG.test(labelName);
    const isLegal = nameReg.test(labelName);
    const tempSetName = set_names.map(item => item.toString());

    if (tempSetName.includes(labelName)) {
      if (!checkRepetition) {
        return false;
      }
      boundGlobalActions.addNotification({
        message: t('DUPLICATE_NAME_TIPS'),
        level: 'error',
        autoDismiss: 2,
      });
      return false;
    }
    if (!isLegal || isEmptyStr) {
      const tipContent = t('CREATE_COLLECTION_ILLEGAL_TIP');
      this.setState({
        tipContent,
      });
      return false;
    }
    return true;
  };

  addLabel = () => {
    const { labelName, set_names } = this.state;
    const checkIn = this.checkLabeName(labelName);
    if (!checkIn) return;

    if (!labelName) {
      this.startAddLabel(false);
    } else {
      this.setState(
        {
          set_names: set_names.concat(labelName.toString()),
          tipContent: '',
        },
        () => {
          const msg = t('ADD_PHOTO_SET_SUCCESSED', { setName: labelName });
          this.instantUpdate('set_names', this.state.set_names, msg);
        }
      );
      this.startAddLabel(false);
    }
    this.setState({
      labelName: '',
    });
  };

  inputLabelName = e => {
    const value = e.target.value;
    this.setState({
      labelName: value,
    });
  };

  setDeadline = () => {
    const { deadlineDays } = this.state;
    const msg = `${t('COLLECTIOIN_SETTINGS_SUCCESSED_TOAST')} ${t('AUTO_EXPIRY')}`;
    this.instantUpdate('validity_length', deadlineDays, msg);
  };

  renderSetLabels = () => {
    const { set_names = [], currentItem, pinName } = this.state;
    return set_names.map(item => (
      <div className="itemlabel">
        {pinName === item ? (
          <XInput
            className="item itemInput"
            value={currentItem}
            onChange={e => this.changeItemLabeName(e.target.value)}
            onBlur={this.changeItemLabel}
            autoFocus={true}
          />
        ) : (
          <span className="item" title={item} onClick={() => this.setPinName(item)}>
            {item}
          </span>
        )}
        <img src={deleteIcon} className="delete" onClick={() => this.deleteLabel(item)} />
      </div>
    ));
  };

  render() {
    const {
      history,
      match: { params },
      collectionPreviewUrl,
      collectionsSettings,
      presetState,
    } = this.props;

    const {
      closeDatePicker,
      galleryPasswordSwitch,
      galleryPassword,
      deadlineDays = 1,
      addLabelProcess,
      labelName,
      tipContent,
      login_information_config,
      closeEventDatePicker,
    } = this.state;
    const { collect_type, setting_details } = login_information_config || {};
    // settings header
    const { id } = params;
    const headerProps = {
      history,
      collectionPreviewUrl,
      collectionId: id,
      title: t('COLLECTION_SETTINGS'),
      hasHandleBtns: false,
    };
    const hideAdvance = !__isCN__ && presetState
    const preRender = () => {
      if (presetState) {
        return (
          <Fragment>
            <div className="settings-item">
              <div className="item-name">{t('PHOTO_SETS')}</div>
              <div className="item-content row">
                <div className="labels">
                  {this.renderSetLabels()}
                  {addLabelProcess ? (
                    <XInput
                      className={`addition ${tipContent ? 'tips' : ''}`}
                      autoFocus={true}
                      value={labelName}
                      onChange={e => this.inputLabelName(e)}
                      onBlur={this.addLabel}
                    />
                  ) : null}
                </div>
                <div className="addLabelBtn" onClick={() => this.startAddLabel(true)}>
                  + {t('ADD_SET_LABEL')}
                </div>
                {tipContent && <div className="errMsg">{tipContent}</div>}
              </div>
            </div>
            <div className="settings-item">
              <div className="item-name">{t('AUTO_EXPIRY')}</div>
              <div className="item-content inputWithText">
                <span>{t('AFTER')}</span>
                <XInput
                  value={deadlineDays}
                  type="number"
                  onChange={this.changeDeadline}
                  onBlur={this.setDeadline}
                />
                <span>{t('DAYS')}</span>
              </div>
              <div className="tip-msg" title={t('AUTO_EXPIRY_TIP_1')}>
                {t('AUTO_EXPIRY_TIP_1')}
              </div>
            </div>
          </Fragment>
        );
      }
      console.log('convertEventDate', this.getAutoExpiryProps('EventDate'));
      return (
        <Fragment>
          <div className="settings-item">
            <div className="item-name">{t('COLLECTION_NAME')}</div>
            <div className="item-content">
              <XInput {...this.getCollectionNameProps()} />
              <span className="tip-msg" title={t('COLLECTION_NAME_TIP')}>
                {t('COLLECTION_NAME_TIP')}
              </span>
            </div>
          </div>
          <div className="settings-item">
            <div className="item-name">事件日期</div>
            <div className="item-content">
              <XInput {...this.getAutoExpiryProps('EventDate')} />
              {closeEventDatePicker ? null : (
                <div className="date-picker-wrap date-picker-wrap1">
                  <DatePicker {...this.getDatePickerProps('EventDate')} minDate="" />
                </div>
              )}
              <span className="tip-msg" title={t('AUTO_EXPIRY_TIP')}>
                选择选片库的事件日期，如婚礼日期。
              </span>
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
              <span className="tip-msg" title={t('AUTO_EXPIRY_TIP')}>
                {t('AUTO_EXPIRY_TIP')}
              </span>
            </div>
          </div>
        </Fragment>
      );
    };

    return (
      <Fragment>
        <div
          className={`gllery-collection-detail-collection-settings ${
            presetState ? 'presetWrapper' : ''
          }`}
        >
          {/* 主渲染区域. */}
          <div className="content">
            {/* settings header */}
            {!presetState && <CollectionDetailHeader {...headerProps} />}

            {/* collection settings 区域 */}
            {collectionsSettings && collectionsSettings.size ? (
              <div className="collection-settings-wrap">
                {preRender()}
                {/* <div className="settings-item">
                  <div className="item-name">{t('EMAIL_REGISTRATION')}</div>
                  <div className="item-content">
                    <Switch {...this.getSwitchProps()} />
                    <div className="tip-wrap">
                      <span className="tip-msg" title={t('EMAIL_REGISTRATION_TIP_1')}>
                        {t('EMAIL_REGISTRATION_TIP_1')}
                      </span>
                    </div>
                  </div>
                </div> */}
                <div className="settings-item">
                  <div className="item-name">{t('GALLERY_CLIENT_PASSWORD')}</div>
                  <div className="item-content">
                    <div className="flex-switch">
                      <Switch {...this.getPasswordSwitchProps()} />
                      {galleryPasswordSwitch && !!galleryPassword && (
                        <div className="extra">
                          <span>
                            {t('GALLERY_CLIENT_PASSWORD')}: {galleryPassword}
                          </span>
                          <XButton className="reset-password" onClicked={this.resetGalleryPassword}>
                            {t('RESET_PIN')}
                          </XButton>
                        </div>
                      )}
                    </div>
                    <div className="tip-wrap">
                      <span
                        className="tip-msg"
                        title={t(
                          presetState
                            ? 'GALLERY_CLIENT_PASSWORD_TIP_1'
                            : 'GALLERY_CLIENT_PASSWORD_TIP'
                        )}
                      >
                        {t(
                          presetState
                            ? 'GALLERY_CLIENT_PASSWORD_TIP_1'
                            : 'GALLERY_CLIENT_PASSWORD_TIP'
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Collection Preset */}
                {
                  !__isCN__ && <div className="settings-item" style={{ marginBottom: '20px'}}>
                  <div className="item-name">{t('SHOW_ON_PORTFOLIO')}</div>
                  <div className="item-content">
                    <Switch {...this.getPortfolioProps()} />
                    <div className="tip-wrap">
                      <span className="tip-msg ellipsis" title={t('SHOW_ON_PORTFOLIO_TIP_A')}>
                        {t('SHOW_ON_PORTFOLIO_TIP_A')} 
                      </span>
                    </div>
                  </div>
                </div>
                }
                
                {!hideAdvance && (
                  <div className="settings-item">
                    <div className="item-name">{t('客户信息收集')}</div>
                    <div className="item-content">
                      <div className="tip-wrap">
                        <span className="tip-msg">
                          {t('您将收集客户的以下信息，并统计在选片反馈中')}
                        </span>
                      </div>
                      <div className="setting-login-info-container">
                        {setting_details &&
                          setting_details.map(item => {
                            const {
                              information_name,
                              is_choose,
                              information_id,
                              can_edit,
                              is_required,
                            } = item;
                            return (
                              <div className="setting-login-info-item" key={information_id}>
                                <div className="checkbox-container">
                                  <XCheckBox
                                    checked={is_choose}
                                    className={'black-theme'}
                                    subText={information_name}
                                    value={information_id}
                                    onClicked={() => this.updateLoginSetting({ information_id })}
                                    checkboxDisabled={information_id === 1}
                                  />
                                  {can_edit && (
                                    <XIcon
                                      type="edit"
                                      iconHeight={10}
                                      iconWidth={10}
                                      className={'edit-icon'}
                                      onClick={() => this.editLoginSettingCustomName(item)}
                                    ></XIcon>
                                  )}
                                </div>
                                {is_choose && (
                                  <XRadio
                                    skin="black-theme"
                                    checked={is_required}
                                    text={'必填'}
                                    onClicked={() =>
                                      this.updateLoginSetting({ information_id, isRadio: 1 })
                                    }
                                    className="login-info-radio"
                                  />
                                )}
                                {information_id !== 1 && is_choose && (
                                  <XRadio
                                    skin="black-theme"
                                    checked={!is_required}
                                    text={'选填'}
                                    onClicked={() =>
                                      this.updateLoginSetting({ information_id, isRadio: 2 })
                                    }
                                  />
                                )}
                              </div>
                            );
                          })}
                      </div>
                      <div className="setting-info-before-or-after">
                        您希望在何时收集客户信息：
                        <div className="setting-info-before">
                          <XRadio
                            skin="black-theme"
                            checked={collect_type === 1}
                            text={'进入选片库'}
                            value={collect_type}
                            onClicked={() => this.updateLoginSetting({ collectTypeRadio: 1 })}
                          />
                        </div>
                        <div className="setting-info-after">
                          <XRadio
                            skin="black-theme"
                            checked={collect_type === 2}
                            text={'产生选片记录'}
                            value={collect_type}
                            onClicked={() => this.updateLoginSetting({ collectTypeRadio: 2 })}
                          />
                        </div>
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
