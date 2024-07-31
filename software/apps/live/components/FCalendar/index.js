import React, { useState, useRef, useMemo, useLayoutEffect, useEffect } from 'react';
import styled from 'styled-components';
import DatePicker from '@apps/gallery/components/DatePicker';
import FInput from '@apps/live/components/FInput';
import dayjs from 'dayjs';

const Container = styled.div`
  position: relative;
  .react-calendar__tile--hasActive {
    color: #fff;
  }
`;

const DatePickerContainer = styled.div`
  position: absolute;
  z-index: 1;
  overflow: hidden;
  transition: height, width 0.3s;
  box-shadow: 1px 1px 11px -1px #555;
  &.hidden {
    height: 0;
    opacity: 0;
  }
`;

export default function FCalendar(porps) {
  const { value, onChange, placeholder } = porps;
  const count = useRef(1);
  const [dateVisible, setDateVisible] = useState(false);
  const [date, setDate] = useState([0, 0]);
  const timer = useRef(null);
  const inputRef = useRef(null);

  function datePickerChange(d) {
    const [d1, d2] = date;
    if (d1 === 0) {
      date[0] = dayjs(d).startOf('day');
    } else {
      date[1] = dayjs(d).startOf('day');
    }

    let isChange = true;
    for (let time of date) {
      if (time === 0) {
        isChange = false;
      }
    }

    isChange && onChange([...date]);
    setDate([...date]);
    if (count.current % 2 === 0) {
      count.current = 0;
      onBlur();
    }
    count.current++;
  }
  function onFocus(e) {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    setDateVisible(true);
  }

  function onBlur() {
    timer.current = setTimeout(() => {
      setDateVisible(false);
      inputRef.current.blur();
    }, 100);
  }

  function onClear() {
    count.current = 1;
    onFocus();
    setDate([0, 0]);
    onChange([]);
  }

  function onDateClose() {
    setTimeout(() => {
      onBlur();
    }, 0);
  }

  function onToday() {
    const start = dayjs().startOf('day'),
      end = start;
    setDate([start, end]);
    onChange([start, end]);
    onDateClose();
  }

  const inputValue = useMemo(() => {
    let text = '';
    if (Array.isArray(value)) {
      value?.forEach((time, index) => {
        if (index === 1) {
          text += '-' + dayjs(time).format('YYYY/MM/DD');
        } else {
          text += dayjs(time).format('YYYY/MM/DD');
        }
      });
    }

    return text;
  }, [value]);

  // function documentClick(e) {
  //   setDateVisible(false);
  // }
  // function boxClick(e) {
  //   e.stopPropagation();
  //   e.nativeEvent.stopImmediatePropagation();
  // }

  function click() {
    inputRef.current.focus();
    onFocus();
  }
  function onMouseDown() {
    setTimeout(() => {
      inputRef.current.focus();
      onFocus();
    }, 0);
  }
  return (
    <Container id="FCalendar">
      <FInput
        value={inputValue}
        onFocus={onFocus}
        onBlur={onBlur}
        // width={400}
        ref={inputRef}
        placeholder={placeholder}
      />
      <DatePickerContainer
        onClick={click}
        onMouseDown={onMouseDown}
        className={dateVisible ? '' : 'hidden'}
      >
        <DatePicker
          date={date}
          onChange={datePickerChange}
          onDateClose={onDateClose}
          onDateClear={onClear}
          onToday={onToday}
        />
      </DatePickerContainer>
    </Container>
  );
}
