import React, { useEffect, useState } from 'react';

import { RcRadioGroup } from '@resource/components/XRadio';

import { int0_9999, int9999 } from '@resource/lib/constants/reg';

import { XButton, XInput, XModal } from '@common/components';
import { XIcon } from '@common/components';

import {
  comboVoild,
  updateSettings,
  useGetSelectionAddChargeProps,
  useGetSelectionNumProps,
} from './main';

import './index.scss';

const comboInputConfig = {
  num: {
    className: 'comboInput',
    placeholder: '输入张数',
    type: 'number',
  },
  price: {
    className: 'comboInput',
    placeholder: '输入金额',
    type: 'number',
  },
};
export default function RuleModal(props) {
  const data = props.data.toJSON();
  const { onClosed, settings } = data;
  const initComboList = settings.get('add_image_packages')
    ? settings.get('add_image_packages').toJS()
    : [{}];
  const [modeType, setModeType] = useState(String(settings.get('gallery_rule_type')));
  const [comboList, setComboList] = useState(
    initComboList.sort((a, b) => a['gallery_image_num'] - b['gallery_image_num'])
  );
  const [errorTip, setErrorTip] = useState('');
  const [inputValueCharge, setInputValueCharge] = useState(
    settings.get('gallery_image_extra') || ''
  );
  const [inputValue, setInputValue] = useState(settings.get('gallery_image_num'));
  const [freeInfo, setFreeInfo] = useState({ isShowTip: false, tipContent: '' });
  const [priceInfo, setPriceInfo] = useState({ isShowTip: false, tipContent: '' });
  const comboDelete = index => {
    const temp = [...comboList];
    temp.splice(index, 1);
    setComboList(temp);
  };
  const comboInput = (e, type, index) => {
    if (e.target.value !== '' && e.target.value < 1) return;
    const tempComboList = [...comboList];
    const temp = tempComboList[index];
    if (type === 'num') {
      if (e.target.value > 9999) return;
      temp['gallery_image_num'] = e.target.value === '' ? '' : parseInt(e.target.value);
      setComboList(tempComboList);
    } else {
      if (e.target.value > 9999) return;
      temp['price'] = e.target.value === '' ? '' : Number(e.target.value);
      setComboList(tempComboList);
    }
  };
  const onSortCombo = () => {
    const temp = [...comboList].sort((a, b) => a['gallery_image_num'] - b['gallery_image_num']);
    setComboList(temp);
  };
  const comboAdd = () => {
    if (comboList.length === 4) {
      setErrorTip('最多创建4个');
      return;
    }
    setComboList([...comboList, {}]);
  };
  useEffect(() => {
    if (comboList.length < 4) {
      setErrorTip('');
    }
  }, [comboList]);
  const onCancleRule = () => {
    if (settings.get('gallery_rule_type') === 0) {
      !settings.get('gallery_image_extra') &&
        updateSettings(data, { gallery_rule_switch: false }, '');
    } else {
      !initComboList.length && updateSettings(data, { gallery_rule_switch: false }, '');
    }
    onClosed();
  };
  const onSaveRule = () => {
    if (!int0_9999.test(inputValue)) {
      setFreeInfo({
        isShowTip: true,
        tipContent: t('INT_0_9999_TIP'),
      });
      return;
    } else if (!inputValue && inputValue !== 0) {
      setFreeInfo({
        isShowTip: true,
        tipContent: t('SELECTION_NUM_TIP_EMPTY'),
      });
      return;
    }
    //  else if (inputValue > imageTotal) {
    //   isShowTip = true;
    //   tipContent = t('SELECTION_NUM_TIP_MAX');
    // }
    if (modeType === '0') {
      if (inputValueCharge === '') {
        setPriceInfo({
          isShowTip: true,
          tipContent: t('SELECTION_ADD_CHARGE_TIP_EMPTY'),
        });
        return;
      } else if (!int9999.test(inputValueCharge)) {
        setPriceInfo({
          isShowTip: true,
          tipContent: t('INT_9999_TIP'),
        });
        return;
      }
      updateSettings(data, {
        gallery_image_num: Number(inputValue),
        // add_image_packages: comboList,
        gallery_rule_type: Number(modeType),
        gallery_image_extra: Number(inputValueCharge),
      });
    } else {
      const res = comboVoild(comboList, setErrorTip);
      if (res) return;
      updateSettings(data, {
        gallery_image_num: Number(inputValue),
        add_image_packages: comboList,
        gallery_rule_type: Number(modeType),
      });
    }
    onClosed();
  };
  const getSelectionNumProps = {
    className: 'settings-collection-free',
    value: inputValue,
    placeholder: t('SELECTION_NUM_PLACEHOLDER'),
    ...freeInfo,
    type: 'number',
    onChange: e => {
      if (e.target.value !== '' && e.target.value < 0) return;
      setInputValue(e.target.value);
      setFreeInfo({
        isShowTip: e.target.value ? false : true,
      });
    },
  };
  const getSelectionAddChargeProps = {
    className: 'settings-collection-price',
    value: inputValueCharge,
    placeholder: t('SELECTION_ADD_CHARGE_PLACEHOLDER'),
    ...priceInfo,
    type: 'number',
    onChange: e => {
      if (e.target.value !== '' && e.target.value < 1) return;
      setInputValueCharge(e.target.value);
      setPriceInfo({
        isShowTip: e.target.value ? false : true,
      });
    },
  };
  const max = 9007199254740991;
  return (
    <XModal className="ruleModal" opened={true} onClosed={onCancleRule} isHideIcon={false}>
      <div className="ruleModalContainer">
        <div className="title">编辑加片规则</div>
        <div className="commonFlex ruleItem onther" style={{ marginBottom: '0.67rem' }}>
          <label>免费张数</label>
          <XInput {...getSelectionNumProps} />
        </div>
        <div className="commonFlex ruleItem" style={{ marginBottom: '0.42rem' }}>
          <label>加片模式</label>
          <RcRadioGroup
            wrapperClass="znoRadio"
            // disabled={!currentImg?.enc_image_id}
            onChange={e => setModeType(e.target.value)}
            value={modeType}
            options={[
              {
                value: '0',
                label: '按张计费',
              },
              {
                value: '1',
                label: '套餐模式',
              },
            ]}
          />
        </div>
        {modeType === '0' && (
          <div className="ruleDetail">
            <div className="commonFlex onther" style={{ justifyContent: 'center' }}>
              <label>超过免费选片张数，每加片1张 收费</label>
              <XInput {...getSelectionAddChargeProps} />
              <label>元</label>
            </div>
          </div>
        )}
        {modeType === '1' && (
          <div className="comboLists">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {comboList.map((item, index) => (
                <div
                  className="commonFlex comboList"
                  // style={{ order: item['gallery_image_num'] || max }}
                  key={`${index}${item.uidpk}`}
                >
                  <div className="commonFlex comboListLeft">
                    <div className="commonFlex" style={{ justifyContent: 'center' }}>
                      <span>客户加片</span>
                      <XInput
                        {...comboInputConfig.num}
                        value={item['gallery_image_num']}
                        onChange={e => comboInput(e, 'num', index)}
                        onBlur={onSortCombo}
                      />
                      <span>张</span>
                    </div>
                    <div className="commonFlex" style={{ justifyContent: 'center' }}>
                      <span>套餐价格</span>
                      <XInput
                        {...comboInputConfig.price}
                        value={item['price']}
                        onChange={e => comboInput(e, 'price', index)}
                      />
                      <span>元</span>
                    </div>
                  </div>
                  <div className="commonFlex ruleListDel" onClick={() => comboDelete(index)}>
                    <XIcon type="delete" iconWidth={'0.3rem'} iconHeight={'0.33rem'} />
                  </div>
                </div>
              ))}
            </div>
            {!!errorTip && (
              <div style={{ position: 'relative' }}>
                <div className="errorTip">{errorTip}</div>
              </div>
            )}
            <div className="commonFlex addCombo" onClick={() => comboAdd()}>
              <span className="addIcon">+</span>添加套餐
            </div>
          </div>
        )}
        <div className="commonFlex ruleBtn" style={{ justifyContent: 'center' }}>
          <XButton className="ruleCancle" onClicked={onCancleRule}>
            取消
          </XButton>
          <XButton className="ruleSave" onClicked={onSaveRule}>
            保存
          </XButton>
        </div>
      </div>
    </XModal>
  );
}
