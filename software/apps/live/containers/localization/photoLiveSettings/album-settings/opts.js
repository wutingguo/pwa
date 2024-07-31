// CN-直播 默认拍摄城市
export const defaultFormCity = { province: '上海', city: '上海市', area: '松江区' };

// /**
//  * 默认的配置
//  */
// export const defaultwrapCol = {
//   labelCol: 6,
//   textCol: 18,
// };

/**
 * CN-直播 处理城市数据
 * @param {Object} form_city
 */
export const transferFormCity = form_city => {
  const { province, city, area } = form_city;
  if (area) {
    return `${province}-${city}-${area}`;
  }
  if (city) {
    return `${province}-${city}`;
  }
  return `${province}`;
};

/**
 * 直播间排序方式的选项区分CN、US
 * @param {boolean} isCN 是否是CN-直播
 */
export const sortTypeOptions = (isCN = true) => {
  if (isCN) {
    return [
      { label: '上传时间排序', value: 1 },
      { label: '拍摄时间排序', value: 2 },
    ];
  }
  return [
    { label: 'Upload Time', value: 1 },
    { label: 'Date Taken', value: 2 },
  ];
};
