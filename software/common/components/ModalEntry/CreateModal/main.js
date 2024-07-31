import moment from 'moment';
import React from 'react';

import { NAME_CN_REG, NAME_REG, SPACE_REG } from '@resource/lib/constants/reg';

// Auto Expiry
const onDateChange = (that, date) => {
  that.setState({
    autoExpiryDate: date,
    convertAutoExpiryDate: moment(date).format('YYYY-MM-DD'),
  });

  // updateSettings(that, { expire_time: moment(date).valueOf() }, t('AUTO_EXPIRY'));

  onDateClose(that);
};

const onDateToday = () => {};

const onDateClear = that => {
  that.setState({
    autoExpiryDate: undefined,
    convertAutoExpiryDate: undefined,
  });
};

const onDateClose = that => {
  that.setState({
    closeDatePicker: true,
  });
};

const onOpenDatePicker = that => {
  that.setState({
    closeDatePicker: false,
  });
};

const getDatePickerProps = that => {
  const { autoExpiryDate } = that.state;
  const datePickerProps = {
    date: autoExpiryDate,
    minDate: '',
    onDateChange: date => onDateChange(that, date),
    onDateToday: () => onDateToday(),
    onDateClear: () => onDateClear(that),
    onDateClose: () => onDateClose(that),
  };
  return datePickerProps;
};
const getAutoExpiryProps = that => {
  const { convertAutoExpiryDate } = that.state;
  const autoExpiryProps = {
    value: convertAutoExpiryDate,
    className: 'auto-expiry-input',
    onFocus: () => onOpenDatePicker(that),
    // onBlur: () => onDateChange(that),
  };
  return autoExpiryProps;
};
const willReceiveProps = that => {
  document.addEventListener(
    'click',
    e => {
      const parentNode = document.querySelector('.date-picker-wrap');
      const autoExpiryInput = document.querySelector('.auto-expiry-input');
      const childNode = e.target;
      const closeDatePicker = !(
        (parentNode && parentNode.contains(childNode)) ||
        e.target === autoExpiryInput
      );
      that.setState({
        closeDatePicker: closeDatePicker,
      });
    },
    true
  );
};
export default {
  willReceiveProps,
  // willUnmount,
  // getCollectionNameProps,
  getAutoExpiryProps,
  getDatePickerProps,
  // getSwitchProps,
  // getPasswordSwitchProps,
  // resetGalleryPassword,
  // editLoginSettingCustomName,
  // updateLoginSetting,
};
