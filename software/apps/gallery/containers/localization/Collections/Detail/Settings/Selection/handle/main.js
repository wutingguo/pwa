import React from 'react';

import { int0_9999, int9999 } from '@resource/lib/constants/reg';

/**
 * 更新 settings
 * @param {*} that
 * @param {*} settingItem
 */
const updateSettings = (that, collection_rule_setting, settingMassage) => {
  const {
    collectionsSettings,
    boundProjectActions,
    boundGlobalActions,
    match: {
      params: { id },
    },
  } = that.props;

  const { addNotification } = boundGlobalActions;
  const { updateCollectionsSettings, getCollectionsSettings } = boundProjectActions;
  const collectionUid = collectionsSettings.get('enc_collection_uid');

  const params = {
    collection_uid: collectionUid,
    setting_type: 5,
    collection_rule_setting,
  };
  updateCollectionsSettings(params).then(
    res => {
      if (res.ret_code === 200000) {
        addNotification({
          message: `${settingMassage}`,
          level: 'success',
          autoDismiss: 2,
        });
        getCollectionsSettings(id);
      }
    },
    error => {
      console.log(error);
      addNotification({
        message: `${settingMassage} ${t('COLLECTIOIN_SETTINGS_FAILED_TOAST')}`,
        level: 'error',
        autoDismiss: 2,
      });
    }
  );
};

const getSwitchProps = that => {
  const { presetState } = that.props;
  const { collectSettingCheck } = that.state;
  const switchProps = {
    checked: collectSettingCheck,
    onSwitch: checked => {
      window.logEvent.addPageEvent({
        name: 'GallerySelectionSet_Click_SelectionSwitch',
        checked,
      });
      that.setState({
        collectSettingCheck: checked,
      });
      // if (!checked) {
      if (presetState) {
        that.instantUpdate('gallery_rule_switch', !!checked);
      } else {
        updateSettings(
          that,
          { gallery_rule_switch: checked },
          checked ? '选片规则已打开' : t('SELECTION_SETTING_CLOSE')
        );
      }
      // }
    },
  };
  return switchProps;
};

const willReceiveProps = (that, nextProps) => {
  const { collectionsSettings, collectionPresetSettings, presetState } = nextProps || that.props;
  const settings = presetState ? collectionPresetSettings : collectionsSettings;
  if (settings && settings.size) {
    const selectionSetting =
      settings.get('collection_rule_setting') || settings.get('rule_setting');
    const inputValue = selectionSetting.get('gallery_image_num');
    const inputValueCharge = selectionSetting.get('gallery_image_extra') || '';
    const collectSettingCheck = selectionSetting.get('gallery_rule_switch');
    that.setState({
      inputValue,
      inputValueCharge,
      collectSettingCheck: Boolean(collectSettingCheck),
      selectionSetting,
    });
  }
};

const onSave = that => {
  window.logEvent.addPageEvent({
    name: 'GallerySelectionSet_Click_Save',
  });

  const { presetState, boundGlobalActions } = that.props;
  // const sets = collectionDetail.get('sets');
  // const imageTotal = sets.reduce((pre, cur) => pre + Number(cur.get('photo_count')), 0);
  const { inputValue, inputValueCharge, collectSettingCheck } = that.state;

  let isShowTip = false,
    isShowTipCharge = false;
  let tipContent = '',
    tipContentCharge = '';

  if (!int0_9999.test(inputValue)) {
    isShowTip = true;
    tipContent = t('INT_0_9999_TIP');
  } else if (!inputValue && inputValue !== 0) {
    isShowTip = true;
    tipContent = t('SELECTION_NUM_TIP_EMPTY');
  }
  //  else if (inputValue > imageTotal) {
  //   isShowTip = true;
  //   tipContent = t('SELECTION_NUM_TIP_MAX');
  // }

  if (!inputValueCharge) {
    isShowTipCharge = true;
    tipContentCharge = t('SELECTION_ADD_CHARGE_TIP_EMPTY');
  } else if (!int9999.test(inputValueCharge)) {
    isShowTipCharge = true;
    tipContentCharge = t('INT_9999_TIP');
  }

  that.setState({
    isShowSuffix: false,
    isShowTip,
    tipContent,

    isShowSuffixCharge: false,
    isShowTipCharge,
    tipContentCharge,
  });

  if (!isShowTip && !isShowTipCharge) {
    const params = {
      gallery_image_num: Number(inputValue),
      gallery_image_extra: Number(inputValueCharge),
      gallery_rule_switch: collectSettingCheck,
    };
    if (presetState) {
      that.instantUpdate('', params, () => {
        boundGlobalActions.addNotification({
          message: '加片规则设置成功',
          level: 'success',
          autoDismiss: 2,
        });
      });
    } else {
      updateSettings(that, params, t('SELECTION_SETTING_OPEN'));
    }
  }
};

export default {
  willReceiveProps,
  getSwitchProps,
  onSave,
};
