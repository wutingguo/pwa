import { addDays, isBefore } from 'date-fns';

/**
 * 提示文案1
 */
export const TIPS_1 = '相册创建超过30天，无法使用AI挑图师';

/**
 * 提示文案2
 */
export const TIPS_2 =
  'AI挑图师在开启后48小时内有效，在首次开启的48小时后，AI挑图师功能结束使用，无法再次开启';

/**
 * 提示文案3
 */
export const TIPS_3 = '仅支持对 JPG、JEPG格式图片挑图';

/**
 * 判断是否超过30天
 * @param {Object} baseInfo 基础信息
 * @returns {boolean} 是否超过30天
 */
export const isOver30Days = baseInfo => {
  const { create_time } = baseInfo;
  const afterDay = addDays(new Date(create_time), 30);
  return isBefore(afterDay, new Date());
};

/**
 * 合影人数options
 */
export const maxPeopleNumOptions = [
  { label: '2人', value: 2 },
  { label: '3人', value: 3 },
  { label: '4人', value: 4 },
  { label: '5人', value: 5 },
  { label: '6人', value: 6 },
  { label: '7人', value: 7 },
  { label: '8人', value: 8 },
  { label: '9人', value: 9 },
  { label: '10人及以上', value: 10 },
];

/**
 * 对比范围options
 */
export const contrastRangeOptions = [
  { label: '1分钟', value: 1 },
  { label: '5分钟', value: 5 },
  { label: '10分钟', value: 10 },
  { label: '15分钟', value: 15 },
];

/**
 * 错误信息返回
 * @param {Object} err
 */
export const onError = err => {
  const { ret_code } = err;
  const messageArrs = [
    { code: 400342, message: '相册不存在' },
    { code: 403000, message: '只有管理员才能操作' },
    { code: 405000, message: '相册创建超过30天，无法使用AI挑图师' },
    {
      code: 408003,
      message:
        'AI挑图师在开启后48小时内有效，在首次开启的48小时后，AI挑图师功能结束使用，无法再次开启',
    },
  ];
  return messageArrs.find(item => item.code === ret_code)?.message;
};

/**
 * 弹窗code
 */
export const ModalCodes = [405000, 408003];

/**
 * 转换config中0 1为false true
 * @param {Object} config 接口配置
 */
export const transferGetConfig = config => {
  const {
    setting_status,
    flg_close_eye,
    flg_blurry,
    flg_under_exposure,
    flg_over_exposure,
    flg_repeat_photo,
  } = config;
  return {
    ...config,
    setting_status: setting_status === 1,
    flg_close_eye: flg_close_eye === 1,
    flg_blurry: flg_blurry === 1,
    flg_under_exposure: flg_under_exposure === 1,
    flg_over_exposure: flg_over_exposure === 1,
    flg_repeat_photo: flg_repeat_photo === 1,
  };
};

/**
 * 转换config中false true为0 1
 * 开启后点击保存校验：至少选择一个调图设置中的【自动隐藏】
 * 校验范围：闭眼、模糊、欠曝、过爆、重复至少选择一项
 * @param {Object} config 保存配置
 */
export const transferSaveConfig = config => {
  const {
    setting_status,
    flg_close_eye,
    flg_blurry,
    flg_under_exposure,
    flg_over_exposure,
    flg_repeat_photo,
  } = config;
  // 开启校验
  const isOpen =
    flg_close_eye || flg_blurry || flg_under_exposure || flg_over_exposure || flg_repeat_photo;
  if (setting_status && !isOpen) {
    return false;
  }
  return {
    ...config,
    setting_status: setting_status ? 1 : 0,
    flg_close_eye: flg_close_eye ? 1 : 0,
    flg_blurry: flg_blurry ? 1 : 0,
    flg_under_exposure: flg_under_exposure ? 1 : 0,
    flg_over_exposure: flg_over_exposure ? 1 : 0,
    flg_repeat_photo: flg_repeat_photo ? 1 : 0,
  };
};
