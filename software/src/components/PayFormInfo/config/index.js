// 主体身份 登记证书类型

export const organizeCardType = {
  SUBJECT_TYPE_GOVERNMENT: [
    {
      value: 'CERTIFICATE_TYPE_2388',
      label: '事业单位法人证书',
    },
  ],
  SUBJECT_TYPE_OTHERS: [
    {
      value: 'CERTIFICATE_TYPE_2389',
      label: '统一社会信用代码证书',
    },
  ],
  SUBJECT_TYPE_INSTITUTIONS: [
    {
      value: 'CERTIFICATE_TYPE_2389',
      label: '统一社会信用代码证书',
    },
    {
      value: 'CERTIFICATE_TYPE_2394',
      label: '社会团体法人登记证书',
    },
    {
      value: 'CERTIFICATE_TYPE_2395',
      label: '民办非企业单位登记证书',
    },
    {
      value: 'CERTIFICATE_TYPE_2396',
      label: '基金会法人登记证书',
    },
    {
      value: 'CERTIFICATE_TYPE_2520',
      label: '执业许可证/执业证',
    },
    {
      value: 'CERTIFICATE_TYPE_2521',
      label: '基层群众性自治组织特别法人统一社会信用代码证',
    },
    {
      value: 'CERTIFICATE_TYPE_2522',
      label: '农村集体经济组织登记证',
    },
    {
      value: 'CERTIFICATE_TYPE_2399',
      label: '宗教活动场所登记证',
    },
    {
      value: 'CERTIFICATE_TYPE_2400',
      label: '政府部门下发的其他有效证明文件',
    },
  ],
};

export const submitTypeList = [
  {
    value: 'SUBJECT_TYPE_INDIVIDUAL',
    label: '个体工商户',
    desc: '营业执照上的主体类型一般为个体户、个体工商户、个体经营',
  },
  {
    value: 'SUBJECT_TYPE_ENTERPRISE',
    label: '企业',
    desc: '营业执照上的主体类型一般为有限公司、有限责任公司',
  },
  // {
  //     value: 'SUBJECT_TYPE_GOVERNMENT',
  //     label: '事业单位',
  //     desc: '包括国内各类事业单位，如：医疗、教育、学校等单位'
  // },
  // {
  //     value: 'SUBJECT_TYPE_INSTITUTIONS',
  //     label: '社会组织',
  //     desc: '包括社会团体、民办非企业、基金会、基层群众性自治组织、农村集体经济组织等组织'
  // },
  // {
  //     value: 'SUBJECT_TYPE_OTHERS',
  //     label: '政府机关',
  //     desc: '包括国内各级、各类政府机关，如：机关党委、税务、民政、人社、工商、商务、市监等'
  // },
];
export const idCardType = [
  {
    value: 'IDENTIFICATION_TYPE_IDCARD',
    label: '中国大陆居民--身份证',
  },
  // {
  //     value: 'IDENTIFICATION_TYPE_HONGKONG_PASSPORT',
  //     label: '中国香港居民--来往内地通行证'
  // },
  // {
  //     value: 'IDENTIFICATION_TYPE_MACAO_PASSPORT',
  //     label: '中国澳门居民--来往内地通行证',
  // },
  // {
  //     value: 'IDENTIFICATION_TYPE_TAIWAN_PASSPORT',
  //     label: '中国台湾居民--来往大陆通行证'
  // },
  // {
  //     value: 'IDENTIFICATION_TYPE_HONGKONG_MACAO_RESIDENT',
  //     label: '中国港澳居民--港澳居住证',
  // },
  // {
  //     value: 'IDENTIFICATION_TYPE_TAIWAN_RESIDENT',
  //     label: '中国台湾居民--台湾居住证',
  // },
  // {
  //     value: 'IDENTIFICATION_TYPE_OVERSEA_PASSPORT',
  //     label: '其他国家或地区居民--护照'
  // },
  // {
  //     value: 'IDENTIFICATION_TYPE_FOREIGN_RESIDENT',
  //     label: '其他国家或地区居民--外国人居留证'
  // },
];

export const bankAccountType = [
  {
    value: 'BANK_ACCOUNT_TYPE_CORPORATE',
    label: '对公银行账户',
  },
  {
    value: 'BANK_ACCOUNT_TYPE_PERSONAL',
    label: '经营者个人银行卡',
  },
];

export const contact_type = [
  {
    value: 'LEGAL',
    label: '经营者/法人',
  },
  // {
  //     value: 'SUPER',
  //     label: '经办人'
  // },
];

export const bankList = [
  {
    value: '工商银行',
    label: '工商银行',
  },
  {
    value: '交通银行',
    label: '交通银行',
  },
  {
    value: '招商银行',
    label: '招商银行',
  },
  {
    value: '民生银行',
    label: '民生银行',
  },
  {
    value: '中信银行',
    label: '中信银行',
  },
  {
    value: '浦发银行',
    label: '浦发银行',
  },
  {
    value: '兴业银行',
    label: '兴业银行',
  },
  {
    value: '光大银行',
    label: '光大银行',
  },
  {
    value: '广发银行',
    label: '广发银行',
  },
  {
    value: '平安银行',
    label: '平安银行',
  },
  {
    value: '北京银行',
    label: '北京银行',
  },
  {
    value: '华夏银行',
    label: '华夏银行',
  },
  {
    value: '农业银行',
    label: '农业银行',
  },
  {
    value: '建设银行',
    label: '建设银行',
  },
  {
    value: '邮政储蓄银行',
    label: '邮政储蓄银行',
  },
  {
    value: '中国银行',
    label: '中国银行',
  },
  {
    value: '宁波银行',
    label: '宁波银行',
  },
  // {
  //     value: '其他银行',
  //     label: '其他银行',
  // },
];

export const areaList = [
  {
    code: '110000',
    name: '中国,北京市',
  },
  {
    code: '110101',
    name: '中国,北京市,北京市,东城区',
  },
  {
    code: '110102',
    name: '中国,北京市,北京市,西城区',
  },
  {
    code: '120000',
    name: '中国,天津市',
  },
  {
    code: '120001',
    name: '中国,天津市,天津市,和平区',
  },
  {
    code: '120002',
    name: '中国,天津市,天津市,河东区',
  },
  {
    code: '130000',
    name: '中国,河北省',
  },
  {
    code: '130100',
    name: '中国,河北省,石家庄市',
  },
  {
    code: '130102',
    name: '中国,河北省,石家庄市,长安区',
  },
];

// 申请单状态码
// export const applymentState ={
//     APPLYMENT_STATE_EDITTING:{
//         code
//     }
// }
export const applymentStateCode = [
  'APPLYMENT_STATE_EDITTING', // 编辑中
  'APPLYMENT_STATE_AUDITING', // 审核中
  'APPLYMENT_STATE_REJECTED', // 已驳回
  'APPLYMENT_STATE_TO_BE_CONFIRMED', // 待账户验证
  'APPLYMENT_STATE_TO_BE_SIGNED', //待签约
  'APPLYMENT_STATE_SIGNING', //开通权限中
  'APPLYMENT_STATE_FINISHED', //已完成
  'APPLYMENT_STATE_CANCELED', //已作废
];
