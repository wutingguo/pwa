import moment from 'moment';
import React from 'react';

import { NAME_CN_REG, NAME_REG, SPACE_REG } from '@resource/lib/constants/reg';

import * as localModalTypes from '@apps/gallery/constants/modalTypes';
import { EDIT_MODAL } from '@apps/gallery/constants/modalTypes';

/**
 * 更新 settings
 * @param {*} that
 * @param {*} settingItem
 */
const updateSettings = (that, collection_setting, setting) => {
  const { collectionsSettings, boundProjectActions, boundGlobalActions } = that.props;

  const { addNotification } = boundGlobalActions;
  const { updateCollectionsSettings, updateCollectionNameInDetail } = boundProjectActions;

  const collectionUid = collectionsSettings.get('enc_collection_uid');
  const settingType = collectionsSettings.getIn(['collection_setting', 'setting_type']);

  const params = {
    collection_uid: collectionUid,
    setting_type: settingType,
    collection_setting,
  };

  updateCollectionsSettings(params).then(
    res => {
      if (setting === t('COLLECTION_NAME')) {
        updateCollectionNameInDetail(collection_setting);
      }
      if (res.ret_code === 200000) {
        addNotification({
          message: `${t('COLLECTIOIN_SETTINGS_SUCCESSED_TOAST')}${setting} `,
          level: 'success',
          autoDismiss: 2,
        });
      }
    },
    error => {
      console.log(error);
      addNotification({
        message: `${setting} ${t('COLLECTIOIN_SETTINGS_FAILED_TOAST')}`,
        level: 'error',
        autoDismiss: 2,
      });
    }
  );
};

// Collection Name
const onInputFocus = that => {
  const { inputValue } = that.state;
  that.setState({
    isShowSuffix: inputValue ? true : false,
  });
};

const onInputChange = (that, e) => {
  const { tipContent } = that.state;
  that.setState({
    inputValue: e.target.value,
    isShowSuffix: true,
    isShowTip: e.target.value ? false : true,
    tipContent: e.target.value ? '' : tipContent,
  });
};

const onCancel = that => {
  const { defaultValue } = that.state;
  that.setState({
    inputValue: defaultValue,
    isShowSuffix: false,
  });
};

const onSave = that => {
  const { inputValue } = that.state;

  // const nameReg = __isCN__ ? NAME_CN_REG : NAME_REG;
  // const isLegal = nameReg.test(inputValue);
  // http://zentao.xiatekeji.com:99/execution-storyView-1279-189.html  【新增】【公共】【Gallery&Slideshow】Gallery + Slideshow 命名放开特殊字符限制与重复命名限制
  const isLegal = true;
  const isEmptyStr = SPACE_REG.test(inputValue);
  let tipContent = '';
  if (isEmptyStr || !inputValue) {
    tipContent = t('CREATE_COLLECTION_REQUIRED_TIP');
  } else if (!isLegal) {
    tipContent = t('CREATE_COLLECTION_ILLEGAL_TIP');
  }

  that.setState({
    isShowSuffix: false,
    isShowTip: inputValue && isLegal && !isEmptyStr ? false : true,
    tipContent,
  });

  if (!isEmptyStr && inputValue && isLegal) {
    console.log('inputValue.trim(): *******', inputValue.trim());
    updateSettings(that, { collection_name: inputValue.trim() }, t('COLLECTION_NAME'));
    that.setState({
      inputValue: inputValue.trim(),
    });
  }
};

const renderSuffix = that => {
  return (
    <div className="btn-wrap">
      <span className="cancel" onClick={() => onCancel(that)}>
        {t('CANCEL')}
      </span>
      <span className="save" onClick={() => onSave(that)}>
        {t('SAVE')}
      </span>
    </div>
  );
};

const getCollectionNameProps = that => {
  const { inputValue, isShowSuffix, isShowTip, tipContent } = that.state;
  const collectionNameProps = {
    className: 'settings-collection-name',
    value: inputValue,
    placeholder: t('COLLECTION_NAME_PLACEHOLDER'),
    // onFocus: () => onInputFocus(that),
    onChange: e => onInputChange(that, e),
    hasSuffix: true,
    isShowSuffix,
    isShowTip,
    tipContent,
    suffixIcon: renderSuffix(that),
  };
  return collectionNameProps;
};

// Auto Expiry
const onDateChange = (that, date, type) => {
  if (type === 'EventDate') {
    that.setState({
      eventDate: date,
      convertEventDate: moment(date).format('YYYY-MM-DD'),
    });
    updateSettings(that, { event_time: moment(date).valueOf() }, '事件日期');
    onDateClose(that);
    return;
  }
  window.logEvent.addPageEvent({
    name: 'GallerySettings_Click_ExpiryDate',
    ExpiryDate: moment(date).format('YYYY-MM-DD'),
  });

  that.setState({
    autoExpiryDate: date,
    convertAutoExpiryDate: moment(date).format('YYYY-MM-DD'),
  });

  updateSettings(that, { expire_time: moment(date).valueOf() }, t('AUTO_EXPIRY'));

  onDateClose(that);
};

const onDateToday = () => {};

const onDateClear = (that, type) => {
  if (type === 'EventDate') {
    that.setState({
      eventDate: undefined,
      convertEventDate: undefined,
    });
    updateSettings(that, { event_time: 946742399000 }, '事件日期');
    return;
  }
  that.setState({
    autoExpiryDate: undefined,
    convertAutoExpiryDate: undefined,
  });
};

const onDateClose = (that, type) => {
  that.setState({
    closeEventDatePicker: true,
    closeDatePicker: true,
  });
};

const onOpenDatePicker = (that, type) => {
  if (type === 'EventDate') {
    that.setState({
      closeEventDatePicker: false,
    });
    return;
  }
  that.setState({
    closeDatePicker: false,
  });
};

const getDatePickerProps = (that, type) => {
  const { autoExpiryDate, eventDate } = that.state;
  const datePickerProps = {
    date: type === 'EventDate' ? eventDate : autoExpiryDate,
    onclick: e => e.stopPropagation(),
    onDateChange: date => onDateChange(that, date, type),
    onDateToday: () => onDateToday(),
    onDateClear: () => onDateClear(that, type),
    onDateClose: () => onDateClose(that, type),
  };
  return datePickerProps;
};

const getAutoExpiryProps = (that, type) => {
  const { convertAutoExpiryDate, convertEventDate } = that.state;
  const autoExpiryProps = {
    value: type === 'EventDate' ? convertEventDate || '' : convertAutoExpiryDate,
    placeholder: type === 'EventDate' ? '选填' : '',
    className:
      type === 'EventDate'
        ? 'auto-expiry-input auto-expiry-input1'
        : 'auto-expiry-input auto-expiry-input2',
    onFocus: () => onOpenDatePicker(that, type),
    // onBlur: () => onDateChange(that),
  };
  return autoExpiryProps;
};

// Email Registration
const onSwitch = (that, checked) => {
  const { presetState } = that.props;
  window.logEvent.addPageEvent({
    name: 'GallerySettings_Click_EmailRegistration',
    EmailRegistration: checked ? 'On' : 'Off',
  });

  that.setState({
    emailRegistration: checked,
  });
  if (presetState) {
    const msg = `${t('COLLECTIOIN_SETTINGS_SUCCESSED_TOAST')} ${t('EMAIL_REGISTRATION')}`;
    that.instantUpdate('is_login_email', !!checked, msg);
  } else {
    updateSettings(that, { is_login_email: +checked }, t('EMAIL_REGISTRATION'));
  }
};

const onSwitchPassword = (that, checked) => {
  const { presetState } = that.props;
  that.setState({
    galleryPasswordSwitch: checked,
  });
  if (presetState) {
    const msg = `${t('GALLERY_CLIENT_PASSWORD')} ${t(!!checked ? 'SWITCH_ON' : 'SWITCH_OFF')}`;
    that.instantUpdate('gallery_password_switch', !!checked, msg);
  } else {
    updateSettings(that, { gallery_password_switch: +checked }, t('GALLERY_CLIENT_PASSWORD'));
  }
};

const getSwitchProps = that => {
  const { emailRegistration } = that.state;
  const switchProps = {
    onSwitch: checked => onSwitch(that, checked),
    checked: emailRegistration,
  };
  return switchProps;
};

const getPasswordSwitchProps = that => {
  const { galleryPasswordSwitch } = that.state;
  const switchProps = {
    onSwitch: checked => onSwitchPassword(that, checked),
    checked: galleryPasswordSwitch,
  };
  return switchProps;
};

// PortfolioProps
const onPortfolioSwitch = (that, checked) => {
  const { presetState } = that.props;
  window.logEvent.addPageEvent({
    name: checked
      ? 'Gallery_Collection_Click_ShowOnPortfolio'
      : 'Gallery_Collection_Click_HideFromPortfolio',
  });

  that.setState({
    showOnPortfolio: checked,
  });

  if (presetState) {
    const msg = `${t('SHOW_ON_PORTFOLIO')} ${t(!!checked ? 'SWITCH_ON' : 'SWITCH_OFF')}`;
    that.instantUpdate('portfolio_show', !!checked, msg);
  } else {
    updateSettings(that, { portfolio_show: checked }, t('SHOW_ON_PORTFOLIO'));
  }
};

const getPortfolioProps = that => {
  const { showOnPortfolio } = that.state;
  const switchProps = {
    onSwitch: checked => onPortfolioSwitch(that, checked),
    checked: showOnPortfolio,
  };
  return switchProps;
};

const handleViewLink = that => {
  const { showOnPortfolio } = that.state;
  const {
    collectionsSettings,
    boundProjectActions,
    boundGlobalActions,
    urls,
    userAuth: { customerId },
  } = that.props;

  const galleryBaseUrl = urls.get('galleryBaseUrl');
  const domainName = collectionsSettings.getIn(['collection_setting', 'portfolio_link']);
  boundProjectActions.getPortfolioConfig({ customer_id: customerId, galleryBaseUrl }).then(res => {
    const { data = {} } = res;
    if (!data?.portfolio_status) {
      boundGlobalActions.hideModal(localModalTypes.SHOW_COLLECTION_PRESET_MODAL);
      // self.props.history.push({
      //   pathname: '/software/gallery/settings',
      //   state: {
      //     tab: 1
      //   }
      // });
      return false;
    }
    const link =
      domainName && domainName.startsWith('https://')
        ? domainName
        : `${window.location.protocol}//${domainName}`;
    if (data?.portfolio_status && domainName) {
      window.open(link, '_blank');
    }
  });
};

const willReceiveProps = (that, nextProps) => {
  document.addEventListener(
    'click',
    e => {
      const parentNode = document.querySelector('.date-picker-wrap');
      const parentNode1 = document.querySelector('.date-picker-wrap1');
      const parentNode2 = document.querySelector('.date-picker-wrap2');
      const eventInput = document.querySelector('.auto-expiry-input1');
      const autoExpiryInput = document.querySelector('.auto-expiry-input2');
      const childNode = e.target;
      // const closeEventDatePicker = !(
      //   (parentNode && parentNode.contains(childNode)) ||
      //   e.target === eventInput
      // );
      // const closeDatePicker = !(
      //   (parentNode && parentNode.contains(childNode)) ||
      //   e.target === autoExpiryInput
      // );
      if (e.target === eventInput) {
        that.setState({
          closeEventDatePicker: false,
          closeDatePicker: true,
        });
      } else if (e.target === autoExpiryInput) {
        that.setState({
          closeEventDatePicker: true,
          closeDatePicker: false,
        });
      } else {
        if (parentNode1 && parentNode1.contains(childNode)) {
          // debugger
          that.setState({
            closeEventDatePicker: false,
            closeDatePicker: true,
          });
        } else if (parentNode2 && parentNode2.contains(childNode)) {
          that.setState({
            closeEventDatePicker: true,
            closeDatePicker: false,
          });
        } else {
          that.setState({
            closeEventDatePicker: true,
            closeDatePicker: true,
          });
        }
      }
    },
    true
  );
  const { collectionsSettings } = nextProps || that.props;
  if (collectionsSettings && collectionsSettings.size) {
    const collectionName = collectionsSettings.getIn(['collection_setting', 'collection_name']);
    const expireTime = collectionsSettings.getIn(['collection_setting', 'expire_time']);
    const event_time = collectionsSettings.getIn(['collection_setting', 'event_time']);
    const isLoginEmail = collectionsSettings.getIn(['collection_setting', 'is_login_email']);
    const showOnPortfolio = collectionsSettings.getIn(['collection_setting', 'portfolio_show']);
    const galleryPasswordSwitch = collectionsSettings.getIn([
      'collection_setting',
      'gallery_password_switch',
    ]);
    const galleryPassword = collectionsSettings.getIn(['collection_setting', 'gallery_password']);
    const deadlineDays = collectionsSettings.getIn(['collection_setting', 'validity_length']);
    const set_names = collectionsSettings.getIn(['collection_setting', 'set_names']) || [];
    const login_information_config = collectionsSettings.getIn([
      'collection_setting',
      'login_information_config',
    ]);
    that.setState({
      inputValue: collectionName,
      defaultValue: collectionName,
      autoExpiryDate: new Date(expireTime),
      convertAutoExpiryDate: moment(expireTime).format('YYYY-MM-DD'),
      eventDate: event_time === 946742399000 ? null : new Date(event_time),
      convertEventDate:
        event_time === 946742399000 ? null : moment(event_time).format('YYYY-MM-DD'),
      showOnPortfolio: Boolean(showOnPortfolio),
      emailRegistration: Boolean(isLoginEmail),
      galleryPasswordSwitch: Boolean(galleryPasswordSwitch),
      galleryPassword,
      deadlineDays,
      set_names,
      login_information_config: login_information_config?.toJS(),
    });
  }
};

const resetGalleryPassword = that => {
  const {
    boundGlobalActions: { showConfirm, hideConfirm, addNotification },
    boundProjectActions: { postResetGalleryPassword, getCollectionsSettings },
  } = that.props;
  const hideOk = () => {
    const encId = that.props.collectionDetail.get('enc_collection_uid');
    postResetGalleryPassword(encId).then(res => {
      const { ret_code } = res;
      if (ret_code === 200000) {
        const {
          match: {
            params: { id },
          },
        } = that.props;
        getCollectionsSettings(id);
        addNotification({
          message: `${t('COLLECTIOIN_SETTINGS_SUCCESSED_TOAST')}${t('GALLERY_CLIENT_PASSWORD')}`,
          level: 'success',
          autoDismiss: 2,
        });
      }
    });
  };
  const data = {
    close: hideConfirm,
    message: (
      <div>
        {t('RESET_PASSWORD_CONFIRM')}
        <br />
        {t('RESET_PASSWORD_CONFIRM_TIP')}
      </div>
    ),
    buttons: [
      {
        className: 'white',
        text: t('CANCEL'),
        onClick: hideConfirm,
      },
      {
        text: t('OK'),
        onClick: hideOk,
      },
    ],
  };
  showConfirm(data);
};

const willUnmount = that => {
  document.removeEventListener('click', () => {});
};

const editLoginSettingCustomName = (that, item) => {
  const { collectionsSettings, boundGlobalActions, boundProjectActions, presetState } = that.props;

  const { showModal, hideModal, addNotification } = boundGlobalActions;
  const { information_name, is_choose, information_id, can_edit, is_required } = item;

  const { login_information_config } = that.state;
  const { collect_type, setting_details } = login_information_config;
  let newSetting_details = [];
  const data = {
    initialValue: information_name,
    title: '自定义客户信息收集',
    message: '自定义收集名称',
    requiredTip: '名称为必填项',
    illegalTip: t('CREATE_COLLECTION_ILLEGAL_TIP'),
    maxLength: 20,
    handleSave: inputValue => {
      newSetting_details = setting_details.map(setting => {
        if (setting.information_id === information_id) {
          return {
            ...setting,
            information_name: inputValue,
          };
        }
        return setting;
      });
      that.setState(
        {
          login_information_config: {
            ...login_information_config,
            setting_details: newSetting_details,
          },
        },
        () => {
          if (presetState) {
            that.instantUpdate('login_information_config', {
              ...login_information_config,
                setting_details: newSetting_details,
            }, t('客户信息收集'))
          } else {
            updateSettings(
              that,
              {
                login_information_config: {
                  ...login_information_config,
                  setting_details: newSetting_details,
                },
              },
              t('客户信息收集')
            );
          }
          hideModal(EDIT_MODAL);
        }
      );
    },
    handleCancel: () => {
      hideModal(EDIT_MODAL);
    },
    close: () => {
      hideModal(EDIT_MODAL);
    },
  };

  showModal(EDIT_MODAL, data);
};
const updateLoginSetting = (that, item) => {
  const { userInfo, presetState, data } = that.props;
  const { login_information_config } = that.state;
  const { collect_type, setting_details } = login_information_config;
  const { isRadio, information_id, collectTypeRadio } = item;
  const presetUidPk = data && data.toJS()?.userInfo?.uidPk || ''
  let newSetting_details = [];
  if (information_id === 1) return;
  if (collectTypeRadio) {
    that.setState(
      {
        login_information_config: {
          ...login_information_config,
          collect_type: collectTypeRadio,
        },
      },
      () => {
        if (presetState) {
          that.instantUpdate('login_information_config', {
            ...login_information_config,
            collect_type: collectTypeRadio,
          }, t('已成功更新客户信息收集'))
        } else {
          updateSettings(
            that,
            {
              login_information_config: {
                ...login_information_config,
                collect_type: collectTypeRadio,
              },
            },
            t('客户信息收集')
          );
        }
      }
    );
    const tagLog = collectTypeRadio === 1 ? { 进入选片库: 'before' } : { 产生选片记录: 'after' };
    
    window.logEvent.addPageEvent({
      name: 'GalleryPhotos_Access_ChooseTime',
      UserID: userInfo?.get('uidPk') || presetUidPk,
      ...tagLog,
    });
    return;
  }
  if (isRadio) {
    let is_required = isRadio === 1;
    newSetting_details = setting_details.map(setting => {
      if (setting.information_id === information_id) {
        return {
          ...setting,
          is_required,
        };
      }
      return setting;
    });

    const logNameArr = [
      'phone',
      'email',
      'userName',
      setting_details.find(setting => setting.information_id === 4).information_name,
    ];
    const logName = logNameArr[information_id - 1];
    let logEventParams = {};
    logEventParams[logName] = is_required ? 'required' : 'optional';
    window.logEvent.addPageEvent({
      name: 'GalleryPhotos_Access_ClientInfo',
      UserID: userInfo?.get('uidPk') || presetUidPk,
      ...logEventParams,
    });
  } else {
    newSetting_details = setting_details.map(setting => {
      if (setting.information_id === information_id) {
        return {
          ...setting,
          is_choose: !setting.is_choose,
        };
      }
      return setting;
    });
  }
  that.setState(
    {
      login_information_config: {
        ...login_information_config,
        setting_details: newSetting_details,
      },
    },
    () => {
      if (presetState) {
        that.instantUpdate('login_information_config', {
          ...login_information_config,
          setting_details: newSetting_details,
        }, t('客户信息收集'))
      } else {
        updateSettings(
          that,
          {
            login_information_config: {
              ...login_information_config,
              setting_details: newSetting_details,
            },
          },
          t('客户信息收集')
        );
      }
    }
  );
};

export default {
  willReceiveProps,
  willUnmount,
  getCollectionNameProps,
  getAutoExpiryProps,
  getDatePickerProps,
  getSwitchProps,
  getPasswordSwitchProps,
  resetGalleryPassword,
  editLoginSettingCustomName,
  updateLoginSetting,
  getPortfolioProps,
  handleViewLink,
};
