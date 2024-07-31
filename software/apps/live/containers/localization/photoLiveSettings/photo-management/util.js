export const getIds = list => {
  if (!list.length) return [];
  const arr = [];
  list.forEach(element => {
    if (!!element['checked']) {
      arr.push(element?.customer_id);
    }
  });
  return arr.join(',');
};

export const getRandomId = () => {
  return Math.random().toString(16).slice(2);
};

// 获取文件名后缀
function getFileExtension(filename) {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
}

// 获取文件名
function removeFileExtension(filename) {
  return filename.replace(/\.[^/.]+$/, '');
}

// image文件名对比
export const isSameFile = (file1, file2) => {
  const extensions = ['jpg', 'jpeg', 'JPG', 'JPEG'];
  const ext1 = getFileExtension(file1);
  const ext2 = getFileExtension(file2);

  if (extensions.includes(ext1) && extensions.includes(ext2)) {
    const fileName1 = removeFileExtension(file1);
    const fileName2 = removeFileExtension(file2);
    return fileName1 === fileName2;
  }

  return false;
};

// 手机号中间4位加密
export function encryptPhoneNumber(phoneNumber) {
  // if (phoneNumber.length !== 11) {
  //   // 手机号长度不正确
  //   return 'Invalid phone number';
  // }

  if (!phoneNumber) return 'Invalid phone number';

  const encryptedPart = phoneNumber.substring(3, 7); // 获取中间四位数字
  const encryptedPhoneNumber = phoneNumber.replace(encryptedPart, '****'); // 将中间四位数字替换为 ****

  return encryptedPhoneNumber;
}

export const columnsOptions = intl => [
  {
    label: `4${intl.tf('LP_ROWS')}`,
    value: 4,
  },
  {
    label: `6${intl.tf('LP_ROWS')}`,
    value: 6,
  },
  {
    label: `8${intl.tf('LP_ROWS')}`,
    value: 8,
  },
];

export const uploadTimeOptions = intl => [
  {
    label: intl.tf('LP_REVERSE'),
    value: 2,
  },
  {
    label: intl.tf('LP_SEQUENCE'),
    value: 1,
  },
  {
    label: intl.tf('LP_REVERSE_TIME'),
    value: 4,
  },
  {
    label: intl.tf('LP_SEQUENCE_TIME'),
    value: 3,
  },
  {
    label: intl.tf('LP_TITLE_A_Z'),
    value: 5,
  },
  {
    label: intl.tf('LP_TITLE_Z_A'),
    value: 6,
  },
];

export const showStatusOptions = intl => [
  {
    label: intl.tf('LP_ALL'),
    value: 'all',
  },
  {
    label: intl.tf('LP_SHOWN'),
    value: 1,
  },
  {
    label: intl.tf('LP_NOT_SHOWN'),
    value: 0,
  },
];

export const retouchStatusOptions = intl => [
  {
    label: intl.tf('LP_ALL'),
    value: 'all',
  },
  {
    label: intl.tf('LP_REPLACED'),
    value: 1,
  },
  {
    label: intl.tf('LP_REPLACE'),
    value: 0,
  },
];

/**
 * 分类筛选项options
 * 兼容老数据，没有分类的，显示无
 * @param {object} intl 国际化
 * @param {Array} categoryOptions 接口数据
 */
export const categoryStatusOptions = (intl, categoryOptions = []) => {
  const rest = categoryOptions.map(item => ({
    ...item,
    label: item.category_name,
    value: item.id,
  }));
  const noneInfo = {
    label: intl.tf('LP_PHOTO_NONE'),
    value: null,
  };
  if (categoryOptions.length === 0) {
    return [noneInfo];
  }
  return rest;
};

/**
 * 筛选出二级分类
 * @param {Array} categoryOptions 原始数据
 * @param {boolean} isMove 是否是移动图片
 */
export const filterSecondCategoryOptions = (categoryOptions, isMove = true) => {
  if (!isMove) {
    return categoryOptions.map(item => ({
      ...item,
      label: item.category_name,
      value: item.id,
    }));
  }
  return categoryOptions
    .filter(({ category_type }) => category_type === 2) // 现在显示所有的一二级分类
    .map(item => ({
      ...item,
      label: item.category_name,
      value: item.id,
    }));
};

/**
 * 默认选中全部照片
 * category_type=1
 * @param {Array} categoryOptions 分类options
 */
export const defaultCategoryStatus = (categoryOptions = []) => {
  const findItem = categoryOptions.find(({ category_type }) => category_type === 1);
  if (findItem) {
    return findItem.id;
  }
  return categoryOptions[0].id;
};

/**
 * 挑图筛选options
 */
export const selectStatusOptions = [
  { label: '所有', value: 'all' },
  { label: '挑图已通过', value: 2 },
  { label: '挑图未通过', value: 3 },
];

/**
 * 挑图状态 0-不挑图 1-挑图中 2-挑图通过 3-挑图未通过
 * @param {Object} data 图片数据
 * @param {boolean} isBtn 是否是按钮文字
 */
export const getPickerStatus = (data, isBtn = false) => {
  const { select_status = 0 } = data;
  const selectStatusArray = [
    [() => select_status === 1, { label: isBtn ? '挑图' : '待挑图', className: 'todo-picker' }],
    [
      () => select_status === 2 || select_status === 0,
      { label: isBtn ? '挑图\n已通过' : '', className: 'success-picker' },
    ],
    [
      () => select_status === 3,
      { label: isBtn ? '挑图\n未通过' : '挑图未通过', className: 'fail-picker' },
    ],
  ];
  return selectStatusArray.find(item => item[0]())[1];
};

/*
 * 支持通过基础设置-排列方式控制审查与修图的默认排列方式
 * 当基础设置-排列方式设置为【拍摄时间排序】时，审查与修图默认按照【按拍摄时间逆序】排列
 * 当基础设置-排列方式设置为【上传时间排序】时，审查与修图默认按照【按上传时间逆序】排列
 */
export const defaultSort = res => {
  const { sort_type = 1 } = res || {};
  if (sort_type === 1) {
    return 2;
  }
  return 4;
};
