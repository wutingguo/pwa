import { addDays, subDays } from 'date-fns';
import zhCN from 'date-fns/locale/zh-CN';
import dayjs from 'dayjs';
// 日历组件
import moment from 'moment';
import React, { forwardRef, useEffect, useState } from 'react';
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams } from 'react-router-dom';

// 导入中文语言包
import './index.scss';

__isCN__ && registerLocale('zh-CN', zhCN);
__isCN__ && setDefaultLocale('zh-CN');

const getUnixFn = update => {
  return update?.map(item => (item ? Date.parse(new Date(item)) : null));
};

export default function FCalendar(porps) {
  const { value, onChange, placeholderTexts = [], timeType } = porps;

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    if (Array.isArray(value)) {
      let timeArr = [];
      value.forEach((time, index) => {
        timeArr[index] = time ? new Date(dayjs(time).valueOf()) : null;
      });

      setStartDate(timeArr[0]);
      setEndDate(timeArr[1]);
    } else {
      const currentMinute = dayjs().format('m');
      let startTime = '';
      if (currentMinute > 30) {
        startTime = dayjs().format('YYYY/MM/DD HH') + ':30';
      } else {
        startTime = dayjs().format('YYYY/MM/DD HH') + ':00';
      }
      setStartDate(new Date(dayjs(startTime)));

      setEndDate(new Date(dayjs(startTime).add(8, 'h')));
      if (timeType === 'end') {
        onChange(getUnixFn([null, new Date(dayjs(startTime).add(8, 'h'))]));
      } else {
        onChange(getUnixFn([new Date(dayjs(startTime)), null]));
      }
    }
  }, [value]);
  const handleDateChange = (o, type) => {
    if (o) {
      if (type === 'end') {
        setEndDate(o);
        onChange(getUnixFn([startDate, o]));
      } else {
        setStartDate(o);
        onChange(getUnixFn([o, endDate]));
      }
    } else {
      if (type === 'end') {
        setEndDate(null);
        if (!id || id === 'create') {
          onChange(getUnixFn([startDate, null]));
        }
      } else {
        setStartDate(null);
        if (!id || id === 'create') {
          onChange(getUnixFn([null, endDate]));
        }
      }
    }
  };
  const CustomInput = forwardRef(({ value, onClick, className, placeholder }, ref) => (
    <input
      type="text"
      value={value}
      onClick={onClick}
      placeholder={placeholder}
      ref={ref}
      className={className}
    />
  ));
  return (
    <div className="ftime-form-item-select" style={{ display: 'flex' }}>
      {timeType === 'start' && (
        <DatePicker
          className="ftime-date-picker"
          selected={startDate}
          onChange={o => handleDateChange(o, 'start')}
          // onCalendarClose={() => onCalendarClose('start')}
          // excludeDateIntervals={[
          //   {
          //     start: subDays(new Date(endDate), 0),
          //     end: addDays(new Date(endDate), 10000),
          //   },
          // ]}
          placeholderText={placeholderTexts[0]}
          startDate={startDate}
          endDate={endDate}
          showTimeSelect
          fixedHeight
          customInput={<CustomInput />}
          timeFormat="HH:mm"
          isClearable
          dateFormat={__isCN__ ? 'yyyy/MM/dd HH:mm' : 'MMMM d yyyy, h:mm:ss a'}
        ></DatePicker>
      )}
      {timeType === 'end' && (
        <DatePicker
          className="ftime-date-picker endTime"
          selected={endDate}
          onChange={o => handleDateChange(o, 'end')}
          // excludeDateIntervals={[
          //   {
          //     start: subDays(new Date(startDate), 10000),
          //     end: addDays(new Date(startDate), 0),
          //   },
          // ]}
          isClearable
          placeholderText={placeholderTexts[1]}
          startDate={startDate}
          endDate={endDate}
          showTimeSelect
          fixedHeight
          customInput={<CustomInput />}
          timeFormat="HH:mm"
          dateFormat={__isCN__ ? 'yyyy/MM/dd HH:mm' : 'MMMM d yyyy, h:mm:ss a'}
        ></DatePicker>
      )}
    </div>
  );
}
