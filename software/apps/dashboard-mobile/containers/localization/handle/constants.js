const gallery_rule_type_options = [
  {
    name: 0,
    label: '按张计算',
  },
  {
    name: 1,
    label: '套餐模式',
  },
];

const setsSettings = [
  {
    value: 1,
    name: '下载“已选”照片',
  },
  {
    value: 0,
    name: '下载全部照片',
  },
  {
    value: 2,
    name: '不支持下载',
  },
];

const settingList = [
  {
    name: '基础设置',
    url: '/software/gallery/gallery-setting',
  },
  {
    name: '选片设置',
    url: '/software/gallery/favorite-setting/',
  },
  {
    name: '下载设置',
    url: '/software/gallery/download-setting',
  },
  {
    name: '加片设置',
    url: '/software/gallery/adding-tablets',
  },
];
const feedbackList = [
  {
    name: '选片反馈信息',
    url: '/software/gallery/favorite/',
  },

  {
    name: '下载记录',
    url: '/software/gallery/download/',
  },
];

const optionalType = [
  {
    label: '必填',
    name: true,
  },
  {
    label: '选填',
    name: false,
  },
];

const collect_type_options = [
  {
    label: '进入选片库',
    name: 1,
  },
  {
    label: '产生选片记录',
    name: 2,
  },
];

export {
  gallery_rule_type_options,
  setsSettings,
  settingList,
  feedbackList,
  collect_type_options,
  optionalType,
};
