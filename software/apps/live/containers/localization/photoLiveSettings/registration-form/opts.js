export const wrapCol = {
  labelCol: 'none',
  textCol: 'auto',
};

export const editFormCol = {
  labelCol: 6,
  textCol: 18,
};

// 默认每页显示条数
export const PAGE_SIZE = 10;

/**
 * 登记表单默认值
 */
export const defaultRegisterForm = {
  enabled: false, // 客资收集开关，默认关闭
  popup_type: 1, // 客资收集时机，默认访问相册时
  banner_enabled: false, // 顶部宣传图，默认打开
  title: '请填写信息以继续观看直播', // 标题
  field_config: [], // 设置客资信息收集项
  button_text: '立即提交', // 按钮文案
};

/**
 * 删除收集项提示
 */
export const deleteMessage =
  '删除该收集项，会同时删除客资名单中该收集项的信息，请谨慎操作。建议将已收集到的客资信息【导出为Excel】，备份后再删除该收集项';

/**
 * 收集项表单默认值
 */
export const defaultFieldConfig = {
  field_name: '', // 收集项名称
  field_length: 1, // 收集内容长度
  field_type: 1, // 收集内容类型
  required: 1, // 收集项是否必填
};

/**
 * 自定义校验收集项
 * @param {Array} value 收集项的值
 */
export const validitorFieldConfig = (value = []) => value.length > 0;

/**
 * 初始化表单数据
 * @param {Object} data 接口数据
 */
export const getFieldData = data => {
  const { enabled, popup_type, banner_enabled, title, field_config, button_text } = data || {};
  return {
    enabled: enabled || defaultRegisterForm.enabled,
    popup_type: popup_type || defaultRegisterForm.popup_type,
    banner_enabled: banner_enabled || defaultRegisterForm.banner_enabled,
    title: title || defaultRegisterForm.title,
    field_config: (field_config || defaultRegisterForm.field_config).map((item, index) => ({
      ...item,
      id: index + 1,
    })),
    button_text: button_text || defaultRegisterForm.button_text,
  };
};

/**
 * 找出最大id的一项，然后加1
 * @param {Array} data 数组对象
 */
export const findMaxSettingId = data => {
  const maxId = data.reduce((max, current) => {
    return current.id > max ? current.id : max;
  }, 0);

  return maxId + 1;
};

/**
 * 对查看客资名单接口数据进行改造
 * 以适配列表格式
 * @param {Object} registerFormInfo
 */
export const modifyRegisterFormInfo = registerFormInfo => {
  const { submit_detail_info } = registerFormInfo;
  // 构造列表数据
  const tableData = submit_detail_info?.map(item => {
    const { field_map, record_id, submit_time } = item;
    return {
      record_id,
      submit_time,
      ...field_map,
    };
  });

  return { ...registerFormInfo, tableData };
};

/**
 * 字符串超过指定长度截取
 * @param {string} str 字符串
 * @param {number} limit 限制长度
 */
export const truncateWithRegex = (str, limit = 10) => {
  if (!str || str.length <= limit) {
    return str;
  }
  return str.substring(0, limit) + '...';
};

/**
 * 校验收集项名称重复
 * @param {Array} field_config 所有收集项
 * @param {string} field_name 收集项名称
 * @param {Object} record 当前数据项
 */
export const validitorFieldName = (field_config, field_name, record) => {
  if (!record) {
    // 如果是新增则判断field_name数组中是否包含field_name
    return field_config.every(item => item.field_name !== field_name);
  }
  // 如果是编辑，则判断field_name数组中除了当前项，是否包含field_name
  const { id } = record;
  const restFieldConfig = field_config.filter(item => item.id !== id);
  return restFieldConfig.every(item => item.field_name !== field_name);
};
