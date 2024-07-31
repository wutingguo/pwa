/**
 * 表单项的配置
 */
export const faceFormConfigs = [
  {
    name: 'full_name',
    label: 'Full Name',
    rules: [
      {
        required: true,
        message: 'Name is required',
      },
    ],
  },
  {
    name: 'phone_number',
    label: 'Phone Number',
    rules: [
      {
        required: true,
        message: 'Phone is required',
      },
    ],
  },
  {
    name: 'email',
    label: 'Email',
    rules: [
      {
        required: true,
        message: 'Email is required',
      },
    ],
  },
];

/**
 * 上传的图片格式
 */
export const uploadAccetps = ['.png', '.jpg', '.jpeg'];

/**
 * 判断图片的后缀符合[.png, .jpg, .jpeg]
 * @param {File} file 文件
 */
export const judgeImageSuffix = file => {
  const acceptSuffix = ['png', 'jpg', 'jpeg'];
  const suffix = file.name.split('.').pop();
  return !acceptSuffix.includes(suffix.toLocaleLowerCase());
};

/**
 * 图片上传大小
 */
export const MAXSIZE = 5 * 1024 * 1024;
