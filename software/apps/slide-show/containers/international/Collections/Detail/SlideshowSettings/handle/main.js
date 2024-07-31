import React from 'react';
import { merge, get } from 'lodash';
import { isImmutable, fromJS, is } from 'immutable';
import { SPACE_REG } from '@resource/lib/constants/reg';
import { occupiedSlug } from '@resource/lib/constants/strings';
import { checkUrlSlug, validateUrlSlug } from '@common/servers/subdomain';

const handleSlideshowPwdSettings = that => {
  const {
    boundGlobalActions,
    boundProjectActions,
    match: {
      params: { id }
    }
  } = that.props;
  const { getSlideshowPwdSettings } = boundProjectActions;

  getSlideshowPwdSettings({ project_id: id }).then(res => {
    const { data, ret_code } = res;
    if (ret_code === 200000) {
      const { slideshow_password, slideshow_password_switch, url_slug, domain_name, segment_name } = data;
      that.setState({
        slideshow_password,
        slideshow_password_switch,
        url_slug,
        slugValue: url_slug,
        domain_name,
        segment_name,
      });
    }
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
};

const slugReg = /^[a-zA-Z0-9_-]+$/;

const onSaveSlug = async that => {
  const { slugValue } = that.state;
  const { 
    urls, 
    collectionsSettings, 
    match: {
      params: { id: project_id }
    } 
  } = that.props;
  const baseUrl = urls.get('baseUrl');
  const isLegal = slugReg.test(slugValue);
  const isEmptyStr = SPACE_REG.test(slugValue);
  let checkUniqueValue = true;
  let slugTipContent = '';
  if (isEmptyStr || !slugValue) {
    slugTipContent = t('CREATE_SLIDESHOW_REQUIRED_TIP');
  } else if (!isLegal) {
    slugTipContent = t('CREATE_SLIDESHOW_ILLEGAL_TIP_NEW');
  }
  if (occupiedSlug.includes(slugValue)) {
    slugTipContent = t('SLIDESHOW_SLUG_REPEATED');
    checkUniqueValue = false;
  }
  if (!slugTipContent) {
    checkUniqueValue = await validateUrlSlug({ baseUrl, project_id, url_slug: slugValue });
    if (!checkUniqueValue) {
      slugTipContent = t('SLIDESHOW_SLUG_REPEATED');
    }
  }

  that.setState({
    slugShowSuffix: false,
    slugShowTip: slugValue && isLegal && !isEmptyStr && checkUniqueValue ? false : true,
    slugTipContent,
  });
  if (!isEmptyStr && slugValue && isLegal && checkUniqueValue) {
    updateSettings(that, { url_slug: slugValue.trim() }, t('SLIDESHOW_SLUG'));
  }
};

const renderSuffix = (that, isSlug) => {
  return (
    <div className="btn-wrap">
      <span className="cancel" onClick={() => onCancel(that, isSlug)}>
        {t('CANCEL')}
      </span>
      <span className="save" onClick={() => onSaveSlug(that)}>
        {t('SAVE')}
      </span>
    </div>
  );
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

const getSlideshowUrlProps = that => {
  const { slugValue, slugShowSuffix, slugShowTip, slugTipContent } = that.state;
  const slideshowUrlProps = {
    className: 'settings-slideshow-slug',
    value: slugValue,
    placeholder: t('COLLECTION_SLUG_PLACEHOLDER'),
    // onFocus: () => onInputFocus(that),
    onChange: e => onChangeSlug(that, e),
    hasSuffix: true,
    isShowSuffix: slugShowSuffix,
    isShowTip: slugShowTip,
    tipContent: slugTipContent || '',
    suffixIcon: renderSuffix(that, true),
  };
  return slideshowUrlProps;
};

/**
 * 更新 settings
 * @param {*} that
 * @param {*} settingItem
 */
const updateSettings = (that, slideshowSettings, setting, notiReplace = false) => {
  const {
    boundGlobalActions,
    boundProjectActions,
    match: {
      params: { id }
    }
  } = that.props;

  const { slideshow_password_switch, slugValue } = that.state

  const { addNotification } = boundGlobalActions;
  const { updateSlideshowSettings } = boundProjectActions;

  const params = {
    project_id: id,
    slideshow_password_switch,
    url_slug: slugValue,
    ...slideshowSettings
  };

  updateSlideshowSettings(params).then(
    res => {
      const { data, ret_code } = res;
      if (ret_code === 200000) {
        const { slideshow_password, slideshow_password_switch, url_slug } = data;
        handleSlideshowPwdSettings(that)
      }
    },
    error => {
      console.log(error);
      addNotification({
        message: `${setting} update failed.`,
        level: 'error',
        autoDismiss: 2
      });
    }
  );
};

const onSwitchPassword = (that, checked) => {
  window.logEvent.addPageEvent({
    name: 'SlideshowSettings_Click_SlideshowPassword',
    checked: checked ? 'On' : 'Off'
  });
  that.setState({
    slideshow_password_switch: checked
  });

  const checkedText = checked ? 'on' : 'off';
  updateSettings(
    that,
    { slideshow_password_switch: checked },
    `Slideshow Password ${checkedText}`,
    true
  );
};

const getPasswordSwitchProps = that => {
  const { slideshow_password_switch } = that.state;
  const switchProps = {
    onSwitch: checked => onSwitchPassword(that, checked),
    checked: slideshow_password_switch
  };
  return switchProps;
};

const resetPassword = that => {
  window.logEvent.addPageEvent({
    name: 'SlideshowPassword_Click_Reset'
  });

  const {
    boundGlobalActions: { showConfirm, hideConfirm, addNotification },
    boundProjectActions: { resetSlideshowSettings }
  } = that.props;
  const hideOk = () => {
    window.logEvent.addPageEvent({
      name: 'SlideshowPasswordPopup_Click_Reset'
    });
    const {
      match: {
        params: { id }
      }
    } = that.props;
    resetSlideshowSettings({ project_id: id }).then(res => {
      const { ret_code, data } = res;
      if (ret_code === 200000) {
        const pwd = data;
        that.setState({
          slideshow_password: pwd
        });
        addNotification({
          message: t('RESET_PASSWORD_SUCCESSFULLY'),
          level: 'success',
          autoDismiss: 2
        });
      }
    });
  };
  const hideCacel = () => {
    window.logEvent.addPageEvent({
      name: 'SlideshowPasswordPopup_Click_Cancel'
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
        onClick: hideCacel
      },
      {
        text: t('RESET_PASSWORD'),
        onClick: hideOk
      }
    ]
  };
  showConfirm(data);
};

const didMount = that => {
  handleSlideshowPwdSettings(that);
};

/**
 * componentWillReceiveProps
 * @param {*} that
 * @param {*} nextProps
 */
const willReceiveProps = (that, nextProps = null) => {
  if (!nextProps) {
    // didMount();
  }
};

export default {
  didMount,
  willReceiveProps,
  getPasswordSwitchProps,
  getSlideshowUrlProps,
  resetPassword
};
