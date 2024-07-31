import React, { useEffect, useState } from 'react';
import { TagsInput } from 'react-tag-input-component';

import { noHyphenGuid } from '@resource/lib/utils/math';

import { NAME_CN_REG, NAME_REG } from '@resource/lib/constants/reg';

import { XInput } from '@common/components';

import * as localModalTypes from '@apps/estore/constants/modalTypes';

import CommonModal from '../commonModal/index';

import './index.scss';

const EditProductOptionsModal = props => {
  const [options, setOptions] = useState({
    display_name: '',
    values: [],
  });
  const [invalidTips, setInvalidTips] = useState({
    nameTips: '',
  });
  const { urls, data, boundGlobalActions } = props;
  const pushOption = data.get('pushOption');
  const existedOpt = data.get('existedOpt');
  const close = data.get('close');
  const allNames = data.get('allNames') ? data.get('allNames').toJS() : [];

  const nameReg = __isCN__ ? NAME_CN_REG : NAME_REG;

  useEffect(() => {
    if (existedOpt) {
      console.log('existedOpt: ', existedOpt.toJS());
      setOptions({
        ...existedOpt.toJS(),
      });
    }
  }, []);

  const changeName = e => {
    const val = e.target.value;
    const isValid = nameReg.test(val);
    setOptions({
      ...options,
      display_name: val,
    });
    if (!val) {
      setInvalidTips({
        nameTips: __isCN__ ? '名称是必需的。' : 'Name is required.',
      });
      return;
    }
    if (!isValid) {
      setInvalidTips({
        nameTips: t('CREATE_COLLECTION_ILLEGAL_TIP'),
      });
      return;
    }
    if (allNames.includes(val)) {
      setInvalidTips({
        nameTips: __isCN__ ? '名称不能重复。' : 'Name must be unique.',
      });
      return;
    }
    setInvalidTips({
      nameTips: '',
    });
  };

  const changeValues = value => {
    console.log('value: ', value, value.length);
    if (value.length > 15) {
      boundGlobalActions.addNotification({
        message: __isCN__ ? '最多可以添加15个值!' : 'Up to 15 values can be added!',
        level: 'error',
        autoDismiss: 2,
      });
      setOptions({
        ...options,
        values: options.values.slice(0, 15),
      });
    } else {
      const newValue = value.map(item => {
        const findVal = options.values.find(sub => sub.value === item);
        if (findVal) {
          return findVal;
        }
        return {
          value: item,
          key: noHyphenGuid(),
        };
      });
      setOptions({
        ...options,
        values: newValue,
      });
    }
  };

  const modalProps = {
    okText: t('SAVE'),
    title: t('EDIT_PRODUCT_OPTIONS'),
    noCancel: true,
    errInfo: invalidTips.nameTips || !options.values.length || !options.display_name,
    onOk: () => {
      pushOption({
        ...options,
        key: options.key || noHyphenGuid(),
      });
      window.logEvent.addPageEvent({
        name: 'Estore_Products_CustomizeSPUEditOptionsPop_Click_Save',
      });
      boundGlobalActions.hideModal(localModalTypes.EDIT_PRODUCT_OPTIONS);
    },
  };
  const tagsValue = options.values.map(item => item.value);
  return (
    <CommonModal className="editProductOptions" {...props} {...modalProps}>
      <div className="inputWrapper">
        <div className="label">{__isCN__ ? '名称' : 'Name'}</div>
        <div className="controlWrapper">
          <XInput
            placeholder={__isCN__ ? '如：尺寸，颜色' : 'e.g. Size, Color'}
            value={options.display_name}
            onChange={changeName}
          />
          {invalidTips.nameTips ? <div className="errText">{invalidTips.nameTips}</div> : null}
        </div>
      </div>
      <div className="inputWrapper">
        <div className="label">{__isCN__ ? '选项' : 'Values'}</div>
        <div className="controlWrapper">
          <TagsInput
            placeHolder={
              __isCN__ ? '用逗号来分割选项，如：8x8，10x10' : 'Separate options with a comma'
            }
            separators={['Enter', ',']}
            // onKeyUp={(e) => {
            //   console.log('e: ', e.target.value);
            // }}
            value={tagsValue}
            onChange={changeValues}
          />
        </div>
      </div>
    </CommonModal>
  );
};

export default EditProductOptionsModal;
