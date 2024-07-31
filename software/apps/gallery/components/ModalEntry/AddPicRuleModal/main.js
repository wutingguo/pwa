import React, { useEffect, useState } from 'react';

const useGetSelectionNumProps = (inputValue, setInputValue, isShowTip, tipContent) => {
  // const { inputValue, isShowSuffix, isShowTip, tipContent } = that.state;
  const selectionNumProps = {
    className: 'settings-collection-free',
    value: inputValue,
    placeholder: t('SELECTION_NUM_PLACEHOLDER'),
    hasSuffix: true,
    // isShowSuffix,
    isShowTip,
    tipContent,
    type: 'number',
    onChange: e => {
      if (e.target.value !== '' && e.target.value < 1) return;
      setInputValue(e.target.value);
      // that.setState({
      //     inputValue: e.target.value,
      //     isShowSuffix: true,
      //     isShowTip: e.target.value ? false : true,
      //     tipContent: e.target.value ? '' : tipContent,
      // });
    },
  };
  return selectionNumProps;
};

const useGetSelectionAddChargeProps = (inputValueCharge, setInputValueCharge, tipContent) => {
  // const { inputValueCharge, isShowSuffixCharge, isShowTipCharge, tipContentCharge } = that.state;
  const selectionAddChargeProps = {
    className: 'settings-collection-price',
    value: inputValueCharge,
    placeholder: t('SELECTION_ADD_CHARGE_PLACEHOLDER'),
    hasSuffix: true,
    // isShowSuffix: isShowSuffixCharge,
    // isShowTip,
    tipContent,
    type: 'number',
    onChange: e => {
      if (e.target.value !== '' && e.target.value < 1) return;
      setInputValueCharge(e.target.value);
      // that.setState({
      //     inputValueCharge: e.target.value,
      //     isShowSuffixCharge: true,
      //     isShowTipCharge: e.target.value ? false : true,
      //     tipContentCharge: e.target.value ? '' : tipContentCharge,
      // });
    },
  };
  return selectionAddChargeProps;
};
const updateSettings = (props, collection_rule_setting, settingMassage = '加片规则设置') => {
  const { collectionsSettings, boundProjectActions, boundGlobalActions, match, presetState, onPresetSave } = props;
  const id = match.getIn(['params', 'id']);
  const addNotification = boundGlobalActions.get('addNotification');
  const updateCollectionsSettings = boundProjectActions.get('updateCollectionsSettings');
  const getCollectionsSettings = boundProjectActions.get('getCollectionsSettings');
  const collectionUid = collectionsSettings.get('enc_collection_uid');

  const params = {
    collection_uid: collectionUid,
    setting_type: 5,
    collection_rule_setting,
  };
  if (presetState) {
    onPresetSave(params)
  } else {
    updateCollectionsSettings(params).then(
      res => {
        if (res.ret_code === 200000) {
          settingMassage &&
            addNotification({
              message: `${settingMassage} 成功`,
              level: 'success',
              autoDismiss: 2,
            });
          getCollectionsSettings(id);
        }
      },
      error => {
        console.log(error);
        addNotification({
          message: `${settingMassage} 失败`,
          level: 'error',
          autoDismiss: 2,
        });
      }
    );
  }
};
const comboVoild = (comboList, setErrorTip) => {
  const temp = [...comboList];
  const emptyNum = temp.some(item => !item['gallery_image_num']);
  const emptyPrice = temp.some(item => !item['price']);
  if (!temp.length) {
    setErrorTip('套餐数量不可为空');
    return true;
  }
  if (emptyNum || emptyPrice) {
    emptyNum && setErrorTip('套餐加片数量不可为空');
    emptyPrice && setErrorTip('套餐价格不可为空');
    return true;
  }
  const nums = [];
  const prices = [];
  const tempObj = {};
  temp.forEach(item => {
    nums.push(item['gallery_image_num']);
    prices.push(item['price']);
    tempObj[item['gallery_image_num']] = item['price'];
  });

  const setLength = arr => new Set(arr).size;
  if (nums.length !== setLength(nums)) {
    setErrorTip('不同套餐加片张数不可相同');
    return true;
  }
  if (prices.length !== setLength(prices)) {
    setErrorTip('不同套餐价格不可相同');
    return true;
  }

  const arrNum = Object.keys(tempObj);

  return temp.some(itm => {
    const currentIndex = arrNum.findIndex(
      item => Number(item) === Number(itm['gallery_image_num'])
    );
    const min = tempObj[arrNum[currentIndex - 1]] || 0;
    const max = tempObj[arrNum[currentIndex + 1]] || 9007199254740991;
    if (itm['price'] <= min || itm['price'] >= max) {
      setErrorTip('套餐价格不匹配，请检查当前套餐价格');
      return true;
    }
  });
};
export { updateSettings, useGetSelectionNumProps, useGetSelectionAddChargeProps, comboVoild };
