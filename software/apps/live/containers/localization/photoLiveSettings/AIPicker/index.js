import React, { useEffect, useState } from 'react';

import XButton from '@resource/components/XButton';
import XSelect from '@resource/components/XSelect';

import { useMessage } from '@common/hooks';

import FCheckBox from '@apps/live/components/FCheckBox';
import FGroupRadio, { FRadio } from '@apps/live/components/FGroupRadio';
import FSwitch from '@apps/live/components/FSwitch';
import WithHeaderComp from '@apps/live/components/WIthHeaderComp';
import {
  check_re_open,
  get_AIPicker_config,
  save_AIPicker_config,
} from '@apps/live/services/photoLiveSettings';

import TipsModal from './TipsModal';
import {
  ModalCodes,
  TIPS_1,
  TIPS_2,
  TIPS_3,
  contrastRangeOptions,
  maxPeopleNumOptions,
  onError,
  transferGetConfig,
  transferSaveConfig,
} from './opts';

import './index.scss';

/**
 * AI挑图师
 */
const AIPicker = props => {
  const { urls, baseInfo } = props;
  // 相册加密id
  const enc_album_id = baseInfo?.enc_album_id;
  // baseUrl
  const baseUrl = urls.get('saasBaseUrl');
  // 消息提示
  const [placeholder, message] = useMessage();
  // AI挑图师配置
  const [config, setConfig] = useState(null);
  // 提示弹窗
  const [tipsVisible, setTipsVisible] = useState(false);
  const [tips, setTips] = useState('');

  /**
   * 获取挑图配置
   */
  const getAIPickerConfig = async () => {
    try {
      const params = {
        baseUrl,
        enc_album_id,
      };
      const res = await get_AIPicker_config(params);
      const newConfig = transferGetConfig(res);
      setConfig(newConfig);
    } catch (error) {
      const errMsg = onError(error);
      message.error(errMsg);
    }
  };

  /**
   * 保存挑图配置
   * 开启后点击保存校验：至少选择一个调图设置中的【自动隐藏】
   * 校验范围：闭眼、模糊、欠曝、过爆、重复至少选择一项
   */
  const saveAIPickerConfig = async () => {
    try {
      const newConfig = transferSaveConfig(config);
      // 校验
      if (!newConfig) {
        message.error('至少选择一个挑图设置中的【自动隐藏】');
        return;
      }
      const params = {
        baseUrl,
        ...newConfig,
      };
      await save_AIPicker_config(params);
      message.success('保存成功');
      getAIPickerConfig();
    } catch (error) {
      const { ret_code } = error;
      const errMsg = onError(error);
      if (ModalCodes.includes(ret_code)) {
        setTipsVisible(true);
        setTips(errMsg);
        return;
      }
      message.error(errMsg);
    }
  };

  /**
   * 初始化
   */
  useEffect(() => {
    if (enc_album_id) {
      getAIPickerConfig(); // 获取配置信息
    }
  }, [enc_album_id]);

  /**
   * 更改配置事件
   * @param {string} type 配置类型
   * @param {number} value 配置值
   */
  const handleChange = (type, value) => {
    setConfig({ ...config, [type]: value });
  };

  /**
   * switch改变事件
   * 1、判断相册创建是否超过30天
   * 2、AI挑图师在开启后48小时内有效，在首次开启的48小时后，AI挑图师功能结束使用，无法再次开启
   */
  const changeSwitch = async value => {
    try {
      if (!value) {
        handleChange('setting_status', value);
        return;
      }
      const params = {
        baseUrl,
        id: config?.id,
      };
      const res = await check_re_open(params);
      // 相册是否过期
      if (res?.album_is_expired) {
        setTipsVisible(true);
        setTips(TIPS_1);
        return;
      }
      // 超过48小时无法再次开启
      if (!res?.can_re_open) {
        setTipsVisible(true);
        setTips(TIPS_2);
        return;
      }
      handleChange('setting_status', value);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * 照片合影人数选中事件
   * @param {'item_not_test'|'is_open'} type 键类型
   * @param {boolean|number} value 选中的值
   */
  const changeCloseEyeSetting = (type, value) => {
    const newSetting = {
      ...config?.close_eye_setting,
      [type]: value,
    };
    handleChange('close_eye_setting', newSetting);
  };

  /**
   * 闭眼的labelText
   */
  const closeEyeLabelText = (
    <div className="commonLabel">
      <span>照片合影人数超过</span>
      <XSelect
        className="common-select"
        value={config?.close_eye_setting?.item_not_test}
        onChange={item => changeCloseEyeSetting('item_not_test', item.value)}
        options={maxPeopleNumOptions}
      />
      <span>的照片</span>
    </div>
  );

  return (
    <WithHeaderComp title="AI挑图师">
      <section className="AI__picker__container">
        {/* 表单 */}
        <div className="AI__picker__content">
          {/* AI挑图师开关 */}
          <div className="item switch">
            <span className="label">AI挑图师开关</span>
            <FSwitch
              value={config?.setting_status}
              disabled={config?.disable_status}
              onChange={changeSwitch}
            />
          </div>
          {/* 文案提示 */}
          <div className="AI__picker__tips">
            <p>{TIPS_2}</p>
            <p>{TIPS_3}</p>
          </div>
          {/* 挑图设置 */}
          <div className="AI__picker__setting">
            <div className="header-title">
              <span>挑图设置</span>
              <span>自动隐藏</span>
            </div>
            {/* 闭眼 */}
            <div className="item">
              <span className="label">闭眼</span>
              <FCheckBox
                checked={config?.flg_close_eye}
                onChange={value => handleChange('flg_close_eye', value)}
                labelText=""
              />
            </div>
            <div className="item-content">
              <p>符合以下条件的照片不检查闭眼</p>
              {/* 这一期暂时不做大笑的照片 */}
              {/* <FCheckBox labelText="大笑的照片" /> */}
              <FCheckBox
                style={{ marginTop: 16 }}
                checked={config?.close_eye_setting?.is_open}
                onChange={value => changeCloseEyeSetting('is_open', value)}
                labelText={closeEyeLabelText}
              />
            </div>
            {/* 模糊 */}
            <div className="item">
              <span className="label">模糊</span>
              <FCheckBox
                checked={config?.flg_blurry}
                onChange={value => handleChange('flg_blurry', value)}
                labelText=""
              />
            </div>
            {/* 欠曝 */}
            <div className="item">
              <span className="label">欠曝</span>
              <FCheckBox
                checked={config?.flg_under_exposure}
                onChange={value => handleChange('flg_under_exposure', value)}
                labelText=""
              />
            </div>
            <div className="item-content">
              <p style={{ marginBottom: 6 }}>检测敏感度</p>
              <FGroupRadio
                value={config?.under_exposure_value}
                onChange={value => handleChange('under_exposure_value', value)}
              >
                <FRadio value={1}>弱</FRadio>
                <FRadio value={2}>中</FRadio>
                <FRadio value={3}>强</FRadio>
              </FGroupRadio>
            </div>
            {/* 过曝 */}
            <div className="item">
              <span className="label">过曝</span>
              <FCheckBox
                checked={config?.flg_over_exposure}
                onChange={value => handleChange('flg_over_exposure', value)}
                labelText=""
              />
            </div>
            <div className="item-content">
              <p style={{ marginBottom: 6 }}>检测敏感度</p>
              <FGroupRadio
                value={config?.over_exposure_value}
                onChange={value => handleChange('over_exposure_value', value)}
              >
                <FRadio value={1}>弱</FRadio>
                <FRadio value={2}>中</FRadio>
                <FRadio value={3}>强</FRadio>
              </FGroupRadio>
            </div>
            {/* 重复照片择优展示 */}
            <div className="item">
              <span className="label">重复照片择优展示</span>
              <FCheckBox
                checked={config?.flg_repeat_photo}
                onChange={value => handleChange('flg_repeat_photo', value)}
                labelText=""
              />
            </div>
            <div className="item-content">
              <div className="commonLabel">
                <span>对比范围：与前</span>
                <XSelect
                  className="common-select contrast-range"
                  value={config?.repeat_photo_value}
                  onChange={item => handleChange('repeat_photo_value', item.value)}
                  options={contrastRangeOptions}
                />
                <span>内拍摄的照片对比</span>
              </div>
            </div>
          </div>
        </div>
        {/* 保存设置操作按钮 */}
        <div className="AI__picker__footer">
          <XButton width={200} height={40} onClicked={saveAIPickerConfig}>
            保存设置
          </XButton>
        </div>
        {/* 提示弹窗 */}
        {tipsVisible && <TipsModal content={tips} onClose={() => setTipsVisible(false)} />}
        {/* 消息提示 */}
        {placeholder}
      </section>
    </WithHeaderComp>
  );
};

export default AIPicker;
