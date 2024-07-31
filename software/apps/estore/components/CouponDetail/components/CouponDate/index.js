import moment from 'moment';
import React, { memo, useEffect, useRef, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';

import DatePicker from '@apps/gallery/components/DatePicker';

import timeIcon from '../../img/time.png';
import { FInput } from '../index';

import './index.scss';

const CouponDate = props => {
  const { onChange, value, defaultValue, type, placeholder, ...reset } = props;
  const [datePickerView, setView] = useState(false);
  const addEventListenerFn = e => {
    const parentNode = document.querySelector('.coupon-date-picker-wrap');
    const childNode = e.target;
    //点击空白处关闭时间选择弹窗
    if (datePickerView && parentNode && parentNode.contains(childNode)) {
      setView(true);
    } else {
      setView(false);
    }
  };
  useEffect(() => {
    document.addEventListener('click', addEventListenerFn);
    return () => {
      document.removeEventListener('click', addEventListenerFn);
    };
  }, [datePickerView]);

  const toggle = e => {
    setView(!datePickerView);
  };
  const onDateChange = value => {
    if (type === 'start') {
      onChange(value.setHours(0, 0, 0, 0));
    } else {
      //结束时间 追加一天的时间 1000*60*24*60-1
      onChange(value.setHours(23, 59, 59, 999));
    }
    setView(false);
  };
  const onDateClear = () => {
    onChange('');
    setView(false);
  };
  const onDateClose = () => {
    setView(false);
  };
  const stopEvent = e => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };
  return (
    <div className="dateBox">
      <div className="timeBox" onClick={stopEvent}>
        <FInput
          readOnly
          placeholder={placeholder}
          value={value ? moment(value).format('YYYY-MM-DD') : ''}
          onClick={toggle}
          ontherDom={`<img src=${timeIcon} alt="" />`}
        />
      </div>

      {datePickerView && (
        <div className="coupon-date-picker-wrap">
          <DatePicker
            onDateChange={onDateChange}
            onDateClear={onDateClear}
            onDateClose={onDateClose}
            onDateToday={() => {}}
            date={value ? new Date(value) : ''}
            {...reset}
          />
        </div>
      )}
    </div>
  );
};

export default memo(CouponDate);
