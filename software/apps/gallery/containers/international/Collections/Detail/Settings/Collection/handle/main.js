import moment from 'moment';
import React from 'react';

import { NAME_CN_REG, NAME_REG, SPACE_REG } from '@resource/lib/constants/reg';
import { occupiedSlug } from '@resource/lib/constants/strings';

import { checkUrlSlug } from '@common/servers/subdomain';

const slugReg = /^[a-zA-Z0-9_-]+$/;

/**
 * 更新 settings
 * @param {*} that
 * @param {*} settingItem
 */
const updateSettings = (that, collection_setting, setting, notiReplace = false) => {
  const {
    collectionsSettings,
    boundProjectActions,
    boundGlobalActions,
    match: {
      params: { id: encCollectionId },
    },
  } = that.props;

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

      if (setting === t('AUTO_EXPIRY')) {
        window.getGalleryCollectionDetail && window.getGalleryCollectionDetail(encCollectionId);
      }

      const notificationText = notiReplace
        ? setting
        : `${t('COLLECTIOIN_SETTINGS_SUCCESSED_TOAST')} ${setting}`;
      addNotification({
        message: notificationText,
        level: 'success',
        autoDismiss: 2,
      });
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

const onChangeSlug = (that, e) => {
  const { tipContent } = that.state;
  const slug = e.target.value;
  that.setState({
    slugValue: slug,
    slugShowSuffix: true,
    slugShowTip: slug ? false : true,
    slugTipContent: slug ? '' : tipContent,
  });
};

const onCancel = (that, isSlug) => {
  const { defaultSlugValue, defaultValue } = that.state;
  if (isSlug) {
    that.setState({
      slugValue: defaultSlugValue,
      slugShowSuffix: false,
    });
    return;
  }
  that.setState({
    inputValue: defaultValue,
    isShowSuffix: false,
  });
};

const onSave = that => {
  const { inputValue } = that.state;

  // const nameReg = __isCN__ ? NAME_CN_REG : NAME_REG;
  // http://zentao.xiatekeji.com:99/execution-storyView-1279-189.html  【新增】【公共】【Gallery&Slideshow】Gallery + Slideshow 命名放开特殊字符限制与重复命名限制
  // const isLegal = nameReg.test(inputValue);
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
    updateSettings(that, { collection_name: inputValue.trim() }, t('COLLECTION_NAME'));
    that.setState({
      inputValue: inputValue.trim(),
    });
  }
};

const onSaveSlug = async that => {
  const { slugValue } = that.state;
  const { urls, collectionsSettings } = that.props;
  const collection_uid = collectionsSettings.get('enc_collection_uid');
  const galleryBaseUrl = urls.get('galleryBaseUrl');
  const isLegal = slugReg.test(slugValue);
  const isEmptyStr = SPACE_REG.test(slugValue);
  let checkUniqueValue = true;
  let slugTipContent = '';
  if (isEmptyStr || !slugValue) {
    slugTipContent = t('CREATE_COLLECTION_SLUG_REQUIRED_TIP');
  } else if (!isLegal) {
    slugTipContent = t('CREATE_COLLECTION_SLUG_ILLEGAL_TIP');
  }
  if (occupiedSlug.includes(slugValue)) {
    slugTipContent = t('COLLECTION_SLUG_REPEATED');
    checkUniqueValue = false;
  }
  if (!slugTipContent) {
    checkUniqueValue = await checkUrlSlug({ galleryBaseUrl, collection_uid, url_slug: slugValue });
    if (!checkUniqueValue) {
      slugTipContent = t('COLLECTION_SLUG_REPEATED');
    }
  }

  that.setState({
    slugShowSuffix: false,
    slugShowTip: slugValue && isLegal && !isEmptyStr && checkUniqueValue ? false : true,
    slugTipContent,
  });
  if (!isEmptyStr && slugValue && isLegal && checkUniqueValue) {
    updateSettings(that, { url_slug: slugValue.trim() }, t('COLLECTION_SLUG'));
  }
};

const renderSuffix = (that, isSlug) => {
  return (
    <div className="btn-wrap">
      <span className="cancel" onClick={() => onCancel(that, isSlug)}>
        {t('CANCEL')}
      </span>
      <span className="save" onClick={() => (isSlug ? onSaveSlug(that) : onSave(that))}>
        {t('SAVE')}
      </span>
    </div>
  );
};

const getCollectionNameProps = that => {
  const { inputValue, isShowSuffix, isShowTip, tipContent } = that.state;
  // console.log('inputValue: ', inputValue);
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

const getCollectionSlugProps = that => {
  const { slugValue, slugShowSuffix, slugShowTip, slugTipContent } = that.state;
  const collectionNameProps = {
    className: 'settings-collection-slug',
    value: slugValue,
    placeholder: t('COLLECTION_SLUG_PLACEHOLDER'),
    // onFocus: () => onInputFocus(that),
    onChange: e => onChangeSlug(that, e),
    hasSuffix: true,
    isShowSuffix: slugShowSuffix,
    isShowTip: slugShowTip,
    tipContent: slugTipContent,
    suffixIcon: renderSuffix(that, true),
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
    updateSettings(that, { event_time: moment(date).valueOf() }, ' Event Date');
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
    updateSettings(that, { event_time: 946742399000 }, ' Event Date');
    return;
  }
  that.setState({
    autoExpiryDate: undefined,
    convertAutoExpiryDate: undefined,
  });
};

const onDateClose = that => {
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
    placeholder: type === 'EventDate' ? 'Optional' : '',
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
  window.logEvent.addPageEvent({
    name: 'GallerySettings_Click_EmailRegistration',
    EmailRegistration: checked ? 'On' : 'Off',
  });

  that.setState({
    emailRegistration: checked,
  });

  updateSettings(that, { is_login_email: +checked }, t('EMAIL_REGISTRATION'));
};
const onViewImg = (that, checked) => {
  // window.logEvent.addPageEvent({
  //   name: 'GallerySettings_Click_EmailRegistration',
  //   EmailRegistration: checked ? 'On' : 'Off',
  // });

  that.setState({
    isOpenViewImg: checked,
  });

  updateSettings(that, { image_name_enabled: +checked }, t('FAVORITE_VIEW_IMAGE'));
};
const onShareMedia = (that, checked) => {
  // window.logEvent.addPageEvent({
  //   name: 'GallerySettings_Click_EmailRegistration',
  //   EmailRegistration: checked ? 'On' : 'Off',
  // });

  that.setState({
    isOpenShareMedia: checked,
  });

  updateSettings(that, { social_sharing_enabled: +checked }, 'Social Sharing');
};
const getSwitchProps = that => {
  const { emailRegistration } = that.state;
  const switchProps = {
    onSwitch: checked => onSwitch(that, checked),
    checked: emailRegistration,
  };
  return switchProps;
};
const getViewImgSwitchProps = that => {
  const { isOpenViewImg } = that.state;
  const viewImgSwitchProps = {
    checked: isOpenViewImg,
    onSwitch: checked => onViewImg(that, checked),
  };
  return viewImgSwitchProps;
};
const getShareSwitchProps = that => {
  const { isOpenShareMedia } = that.state;
  const shareMediaSwitchProps = {
    checked: isOpenShareMedia,
    onSwitch: checked => onShareMedia(that, checked),
  };
  return shareMediaSwitchProps;
};
const updateState = (that, collectionsSettings) => {
  const collectionName = collectionsSettings.getIn(['collection_setting', 'collection_name']);
  const expireTime = collectionsSettings.getIn(['collection_setting', 'expire_time']);
  const event_time = collectionsSettings.getIn(['collection_setting', 'event_time']);
  const url_slug = collectionsSettings.getIn(['collection_setting', 'url_slug']);
  const isLoginEmail = collectionsSettings.getIn(['collection_setting', 'is_login_email']);
  const isOpenViewImg = collectionsSettings.getIn(['collection_setting', 'image_name_enabled']);
  const isOpenShareMedia = collectionsSettings.getIn([
    'collection_setting',
    'social_sharing_enabled',
  ]);
  const showOnPortfolio = collectionsSettings.getIn(['collection_setting', 'portfolio_show']);
  const galleryPasswordSwitch = collectionsSettings.getIn([
    'collection_setting',
    'gallery_password_switch',
  ]);
  const galleryPassword = collectionsSettings.getIn(['collection_setting', 'gallery_password']);
  that.setState({
    inputValue: collectionName,
    defaultValue: collectionName,
    defaultSlugValue: url_slug,
    slugValue: url_slug,
    autoExpiryDate: expireTime ? new Date(expireTime) : null,
    convertAutoExpiryDate: expireTime ? moment(expireTime).format('YYYY-MM-DD') : null,
    eventDate: event_time === 946742399000 ? null : new Date(event_time),
    convertEventDate: event_time === 946742399000 ? null : moment(event_time).format('YYYY-MM-DD'),
    emailRegistration: Boolean(isLoginEmail),
    isOpenViewImg: Boolean(isOpenViewImg),
    isOpenShareMedia: Boolean(isOpenShareMedia),
    showOnPortfolio: Boolean(showOnPortfolio),
    galleryPasswordSwitch: Boolean(galleryPasswordSwitch),
    galleryPassword,
  });
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

const willReceiveProps = (that, nextProps) => {
  document.addEventListener(
    'click',
    e => {
      // const parentNode = document.querySelector('.date-picker-wrap');
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
    updateState(that, collectionsSettings);
  }
};

const willUnmount = that => {
  document.removeEventListener('click', () => {});
};

const onSwitchPassword = (that, checked) => {
  window.logEvent.addPageEvent({
    name: 'GalleryCollectionSettings_Click_CollectionPassword',
    checked: checked ? 'On' : 'Off',
  });
  that.setState({
    galleryPasswordSwitch: checked,
  });

  const checkedText = checked ? 'on' : 'off';
  updateSettings(
    that,
    { gallery_password_switch: +checked },
    `${t('GALLERY_CLIENT_PASSWORD')} ${checkedText}`,
    true
  );
};

const getPasswordSwitchProps = that => {
  const { galleryPasswordSwitch } = that.state;
  const switchProps = {
    onSwitch: checked => onSwitchPassword(that, checked),
    checked: galleryPasswordSwitch,
  };
  return switchProps;
};

const handleViewLink = that => {
  const {
    collectionsSettings,
    boundProjectActions,
    userAuth: { customerId },
    urls,
  } = that.props;
  const galleryBaseUrl = urls.get('galleryBaseUrl');
  const domainName = collectionsSettings.getIn(['collection_setting', 'domain_name']);
  boundProjectActions.getPortfolioConfig({ customer_id: customerId, galleryBaseUrl }).then(res => {
    const { data = {} } = res;
    if (!data?.portfolio_status) {
      that.props.history.push({
        pathname: '/software/gallery/settings',
        state: {
          tab: 0,
        },
      });
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

const resetGalleryPassword = that => {
  window.logEvent.addPageEvent({
    name: 'GalleryCollectionPassword_Click_Reset',
  });

  const {
    boundGlobalActions: { showConfirm, hideConfirm, addNotification },
    boundProjectActions: { postResetGalleryPassword, getCollectionsSettings },
  } = that.props;
  const hideOk = () => {
    window.logEvent.addPageEvent({
      name: 'CollectionPasswordPopup_Click_Reset',
    });
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
          message: t('RESET_PASSWORD_SUCCESSFULLY'),
          level: 'success',
          autoDismiss: 2,
        });
      }
    });
  };
  const hideCacel = () => {
    window.logEvent.addPageEvent({
      name: 'CollectionPasswordPopup_Click_Cancel',
    });
    hideConfirm();
  };
  const data = {
    close: hideCacel,
    title: t('ARE_YOU_SURE'),
    message: <div style={{ textAlign: 'left' }}>{t('RESET_PASSWORD_CONFIRM')}</div>,
    buttons: [
      {
        className: 'white',
        text: t('CANCEL'),
        onClick: hideCacel,
      },
      {
        text: t('RESET_PASSWORD'),
        onClick: hideOk,
      },
    ],
  };
  showConfirm(data);
};

export default {
  willReceiveProps,
  willUnmount,
  getCollectionNameProps,
  getCollectionSlugProps,
  getAutoExpiryProps,
  getDatePickerProps,
  getSwitchProps,
  getViewImgSwitchProps,
  getShareSwitchProps,
  getPasswordSwitchProps,
  resetGalleryPassword,
  getPortfolioProps,
  handleViewLink,
};
