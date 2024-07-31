import moment from 'moment';
import React, { memo, useEffect, useRef, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';

import DatePicker from '@apps/gallery/components/DatePicker';

import { FInput } from '../index';

import './index.scss';

const PayDate = props => {
  const { onChange, selectDay, ...reset } = props;
  const [datePickerView, setView] = useState(false);
  const addEventListenerFn = e => {
    const parentNode = document.querySelector('.payForm-date-picker-wrap');
    const childNode = e.target;
    //点击空白处关闭时间选择弹窗
    if (datePickerView && parentNode && parentNode.contains(childNode)) {
      setView(false);
    } else {
      setView(true);
    }
  };
  useEffect(() => {
    document.addEventListener('click', addEventListenerFn);
    return () => {
      document.removeEventListener('click', addEventListenerFn);
    };
  }, [datePickerView]);
  const toggle = e => {
    console.log('e', e);
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setView(!datePickerView);
  };
  const onDateChange = value => {
    const time = moment(value).format('YYYY-MM-DD');
    onChange(time);
    setView(false);
  };
  const onDateClear = () => {
    onChange('');
    setView(false);
  };
  const onDateClose = () => {
    setView(false);
  };

  return (
    <div className="dateBox">
      <FInput readOnly value={selectDay || ''} onClick={toggle} />
      {datePickerView && (
        <div className="payForm-date-picker-wrap">
          <DatePicker
            onDateChange={onDateChange}
            onDateClear={onDateClear}
            onDateClose={onDateClose}
            onDateToday={() => {}}
            {...reset}
          />
        </div>
      )}
    </div>
  );
};

export default memo(PayDate);
