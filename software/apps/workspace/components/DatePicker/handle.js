import classNames from 'classnames';
import React from 'react';

export const getDayNameItems = dayStrings => {
  const dayNameItems = [];
  dayStrings.forEach(dayName => {
    dayNameItems.push(<div className="day-name">{dayName}</div>);
  });
  return dayNameItems;
};

const getPrefixDays = (year, month, firstDayOfMonth) => {
  const prefixDays = [];
  const lastDateOfPrevMonth = new Date(year, month, 0);
  const numOfPrevMonthDays = lastDateOfPrevMonth.getDate();
  for (let i = 0; i < firstDayOfMonth; i += 1) {
    const date = numOfPrevMonthDays - i;
    prefixDays.push(<div className="date-item disabled">{date}</div>);
  }
  prefixDays.reverse();
  return prefixDays;
};

const getExtralDays = (year, month, extralDayNum) => {
  const extralDays = [];
  for (let i = 1; i <= extralDayNum; i += 1) {
    extralDays.push(<div className="date-item disabled">{i}</div>);
  }
  return extralDays;
};

export const getSelectedDate = selected => {
  const today = new Date();
  const selectedDate = {
    year: today.getFullYear(),
    month: today.getMonth(),
    date: today.getDate()
  };
  if (typeof selected === 'string') {
    const reg = /\d*[./-]+\s*\d*/;
    const match = reg.exec(selected);
    const matchTag = match[0].replace(/\d/g, '');
    const result = selected.split(matchTag);
    selectedDate.year =
      result[0].length < 4 ? 2000 + Number(result[0]) : Number(result[0]);
    selectedDate.month = Number(result[1]) - 1;
    selectedDate.date = Number(result[2]);
  }
  return selectedDate;
};

export const getMonthDates = that => {
  const { year, month, today } = that.state;
  const { onSelect, selected } = that.props;
  const selectedDate = getSelectedDate(selected);
  let dateItems = [];
  const lastDateOfMonth = new Date(year, month + 1, 0);
  const monthDateNums = lastDateOfMonth.getDate();
  const firstDayOfMonth = new Date(year, month, 0).getDay();
  const prefixDays = getPrefixDays(year, month, firstDayOfMonth);
  dateItems = dateItems.concat(prefixDays);

  for (let i = 1; i <= monthDateNums; i += 1) {
    const isSlectedDate =
      year === selectedDate.year &&
      month === selectedDate.month &&
      i === selectedDate.date;
    const isToday =
      year === today.year && month === today.month && i === today.date;
    const className = classNames('date-item', {
      selected: isSlectedDate,
      today: isToday && !isSlectedDate,
      normal: !isSlectedDate && !isToday
    });
    const itemData = {
      year,
      month,
      date: i,
      dateTime: new Date(year, month, i)
    };
    dateItems.push(
      <div className={className} onClick={() => onSelect(itemData)}>
        {i}
      </div>
    );
  }

  const extralDayNum = 42 - dateItems.length;
  const extralDays = getExtralDays(year, month, extralDayNum);
  dateItems = dateItems.concat(extralDays);

  return dateItems;
};
