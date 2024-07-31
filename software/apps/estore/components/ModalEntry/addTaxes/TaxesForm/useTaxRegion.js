import { useCallback, useEffect, useMemo, useState } from 'react';
import taxesService from '../../../../constants/service/taxes';
import useEnv from '../../../../hooks/useEnv';

// 只有以下地区让选子地区
const needSubRegionCountryCodes = ['US', 'CA'];
const filterRegions = ({ regions = [] }) => {
  return regions.map(r => {
    // const { id, region_type, region_code, region_name, parent_id, sequence_no, child_regions } = r;
    const newR = { ...r };
    // 含有子地区 但需求不让选子地区 过滤掉子地区
    if (r.child_regions?.length && !needSubRegionCountryCodes.includes(r.region_code)) {
      newR.child_regions = null;
      // 1为没有子地区 2为有子地区 此处使用中台的即可
      // newR.region_type = 1;
    }
    return newR;
  });
};

// excludesCountryDashSubRegionCodes countryCode-subRegionCode 的形式 以避免多个国家之前地区code重复

// 转换到select option
const transformRegionOptions = ({
  regions,
  excludesCountryCodes,
  excludesCountryDashSubRegionCodes,
  isSubRegion = false,
  parentRegionCode = ''
}) => {
  return regions
    .filter(r => {
      if (!isSubRegion && !parentRegionCode) {
        return !excludesCountryCodes.includes(r.region_code);
      }
      const countryDashSubRegionCode = [parentRegionCode, r.region_code].join('-');
      return !excludesCountryDashSubRegionCodes.includes(countryDashSubRegionCode);
    })
    .map(r => {
      const {
        id,
        region_type,
        region_code,
        region_name,
        parent_id,
        sequence_no,
        child_regions
      } = r;
      return {
        key: id,
        value: region_code,
        label: region_name,
        subOptions:
          child_regions && !isSubRegion
            ? transformRegionOptions({
                regions: child_regions,
                excludesCountryCodes,
                excludesCountryDashSubRegionCodes,
                isSubRegion: true,
                parentRegionCode: region_code
              })
            : [],
        data: r
      };
    });
};

const findRegionOption = ({ regionOptions, regionCode }) => {
  if (!regionOptions?.length) {
    return null;
  }
  const find = regionOptions.find(r => r.value === regionCode);
  return find;
};

// 传入国家编号（默认US） 子地区编号（默认国家字地区的第一个）可在初始时选中相应option  excludesCodes 将这些地区code从regionOptions中排除
const useTaxRegion = ({
  onSubRegionOptionChange,
  countryRegionCode = 'US',
  subRegionCode,
  excludesCountryCodes = [],
  excludesCountryDashSubRegionCodes = []
}) => {
  const [currentCountryOption, setCurrentCountryOption] = useState(null);
  const [currentSubRegionOption, setCurrentSubRegionOption] = useState(null);

  const { baseUrl, estoreInfo, estoreBaseUrl } = useEnv();

  // 中台原始数据
  const [originRegions, setOriginRegions] = useState([]);
  // 特殊处理后的数据 （需要对一些地区特殊处理 如只有美国、加拿大保留子地区
  const [regions, setRegions] = useState([]);

  const initData = useCallback(async () => {
    try {
      const data = await taxesService.getTaxCountryAndProvince({
        baseUrl: estoreBaseUrl,
        store_id: estoreInfo?.id
      });

      console.log('getTaxCountryAndProvinceData', data);
      if (data?.data) {
        setOriginRegions(data.data);
        setRegions(filterRegions({ regions: data.data }));
      }
    } catch (e) {
      console.error(e);
    }
  }, [baseUrl, estoreInfo]);

  const regionOptions = useMemo(() => {
    if (!regions?.length) return [];
    const r = transformRegionOptions({
      regions,
      excludesCountryCodes,
      excludesCountryDashSubRegionCodes
    });
    console.log('去重后: ', {
      regions,
      excludesCountryCodes,
      excludesCountryDashSubRegionCodes,
      result: r
    });
    // 为currentCountryOption设置默认值
    !currentCountryOption &&
      setCurrentCountryOption(
        findRegionOption({ regionOptions: r, regionCode: countryRegionCode }) || r[0]
      );
    return r;
  }, [regions, countryRegionCode, excludesCountryCodes, excludesCountryDashSubRegionCodes]);

  // 默认选中子地区
  const { subRegionOptions } = useMemo(() => {
    const subRegionOptions = currentCountryOption?.subOptions || null;
    // 第一个子地区
    const firstSubOption = subRegionOptions ? subRegionOptions[0] : null;
    // 有指定子地区时查找该地区
    const findSubOption =
      subRegionCode &&
      findRegionOption({
        regionOptions: subRegionOptions,
        regionCode: subRegionCode
      });
    setCurrentSubRegionOption(findSubOption || firstSubOption);
    onSubRegionOptionChange(findSubOption || firstSubOption);
    return {
      subRegionOptions
    };
  }, [currentCountryOption, subRegionCode]);

  useEffect(() => {
    initData();
  }, []);

  return {
    originRegions,
    regions,
    regionOptions,
    currentCountryOption,
    setCurrentCountryOption,
    subRegionOptions,
    currentSubRegionOption,
    setCurrentSubRegionOption
  };
};
export default useTaxRegion;
