import React, { memo, useEffect, useMemo, useRef, useState } from 'react';

import { areaCodeList } from '@common/servers/payWeChat';

import { useWatch } from '@apps/live/components/Form';

import { bankAccountType, bankList } from '../../config';
import { PayDate, PayField, PayInputField, PayUploadField, SelectDown } from '../index';

import './index.scss';

const BankAccountInfo = props => {
  const { baseUrl, form } = props;
  const [areaList, setAreaList] = useState([]);
  const [provinceList, setProvinceList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  //监听字段值改变控制UI变化
  const { bank_address_code } = useWatch(['bank_address_code'], form);
  useEffect(() => {
    areaCodeList({ baseUrl }).then(res => {
      setAreaList(res);
    });
  }, []);
  const getAreaCode = (txtArr, onChange) => {
    txtArr.unshift('中国');
    const textJoin = txtArr.join(',');
    let res = {};
    if (txtArr.length === 3) {
      // 当数组长度为3时 比如[中国,天津市,天津市]或者[中国,北京市,北京市] 此时需要查找上一级编码[中国,北京市]
      const filterRes = areaList.some(item => {
        if (item.area_name === textJoin) {
          res = item;
          return true;
        }
      });
      if (!filterRes) {
        const tempTextJoin = txtArr.slice(0, 2).join();
        areaList.some(item => {
          if (item.area_name === tempTextJoin) {
            res = item;
            return true;
          }
        });
      }
    } else {
      areaList.some(item => {
        if (item.area_name === textJoin) {
          res = item;
          return true;
        }
      });
    }
    res.area_code && onChange(res.area_code);
  };
  const areaListArr = useMemo(() => {
    let provinceList = new Set();
    const areaListRes = areaList.map(item => {
      const res = item.area_name.split(',').slice(1);
      provinceList.add(res[0]);
      return res;
    });
    setProvinceList(Array.from(provinceList).map(item => ({ label: item, value: item })));
    return areaListRes;
  }, [areaList]);
  const cityArr = useMemo(() => {
    let cityTempArr = new Set();
    const areaListRes = [];
    areaListArr.forEach(item => {
      if (item[0] === province && item[1]) {
        cityTempArr.add(item[1]);
        areaListRes.push(item);
      }
    });
    cityTempArr.size &&
      setCityList(Array.from(cityTempArr).map(item => ({ label: item, value: item })));

    return areaListRes;
  }, [province]);
  useEffect(() => {
    let districtTempArr = new Set();
    cityArr.forEach(item => {
      if (item[1] === city && item[2]) {
        districtTempArr.add(item[2]);
      }
    });
    districtTempArr.size &&
      setDistrictList(Array.from(districtTempArr).map(item => ({ label: item, value: item })));
  }, [city]);
  useEffect(() => {
    if (bank_address_code && areaList.length) {
      const findItem = areaList.find(item => item.area_code === bank_address_code);
      const findItemArr = findItem['area_name'].split(',');
      findItemArr[1] && setProvince(findItemArr[1]);
      findItemArr[2] && setCity(findItemArr[2]);
      findItemArr[3] && setDistrict(findItemArr[3]);
    }
  }, [areaList]);
  const changeArea = (type, value, onChange) => {
    // 处理开户地
    if (type === 0) {
      setProvince(value);
      setCity('');
      setDistrict('');
      setDistrictList([]);
      getAreaCode([value], onChange);
    } else if (type === 1) {
      setCity(value);
      setDistrict('');
      getAreaCode([province, value], onChange);
    } else {
      setDistrict(value);
      getAreaCode([province, city, value], onChange);
    }
  };
  return (
    <div className="payFormSection bankAccountInfo">
      <div className="title">
        <div>结算账户信息</div>
        <div className="titleDesc">结算账户是您提现收款时的银行账户信息</div>
      </div>
      <PayField
        {...props}
        name="bank_account_type"
        rules={[{ required: true, message: '账户类型为空！' }]}
        label="账户类型"
        // defaultValue={bankAccountType[0]['value']}
        child={(value, onChange) => {
          return (
            <div style={{ width: '7.38rem' }}>
              <SelectDown
                // defaultSelect={bankAccountType[0]}
                defaultSelect={{}}
                selectValue={value}
                onChange={onChange}
                dropdownList={bankAccountType}
              />
            </div>
          );
        }}
        required
      />
      <PayInputField
        {...props}
        name="account_name"
        rules={[{ required: true, message: '开户人名称为空！' }]}
        label="开户人名称"
        required
        desc={[
          '首次申请开户人需要与超级管理员身份保持一致，申请通过后可自行前往“微信商家助手”更换结算账户',
        ]}
      />
      <PayField
        {...props}
        name="account_bank"
        label="开户银行"
        rules={[{ required: true, message: '开户银行为空！' }]}
        child={(value, onChange) => {
          return (
            <div style={{ width: '7.38rem' }}>
              <SelectDown onChange={onChange} selectValue={value} dropdownList={bankList} />
            </div>
          );
        }}
        required
      />
      <PayField
        {...props}
        name="bank_address_code"
        label="开户地"
        rules={[{ required: true, message: '开户地为空！' }]}
        child={(value, onChange) => {
          return (
            <div className="areaBox">
              <div className="areaList">
                <SelectDown
                  placeholder="省份"
                  defaultSelect={{}}
                  selectValue={province}
                  onChange={value => changeArea(0, value, onChange)}
                  dropdownList={provinceList}
                />
              </div>
              <div className="areaList">
                <SelectDown
                  placeholder="城市"
                  defaultSelect={{}}
                  selectValue={city}
                  onChange={value => changeArea(1, value, onChange)}
                  dropdownList={cityList}
                />
              </div>
              <div className="areaList">
                <SelectDown
                  placeholder="地区"
                  defaultSelect={{}}
                  selectValue={district}
                  onChange={value => changeArea(2, value, onChange)}
                  dropdownList={districtList}
                />
              </div>
            </div>
          );
        }}
        required
      />
      <PayInputField
        {...props}
        name="account_number"
        rules={[{ required: true, message: '银行账号为空！' }]}
        label="银行账号"
        required
      />
    </div>
  );
};

export default memo(BankAccountInfo);
