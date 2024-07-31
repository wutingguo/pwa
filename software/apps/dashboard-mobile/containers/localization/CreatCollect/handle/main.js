import moment from 'moment';
import React from 'react';

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
    minDate: null,
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
    // onFocus: () => onOpenDatePicker(that),
    // onBlur: () => onDateChange(that),
  };
  return autoExpiryProps;
};
const init = async that => {
  const { boundProjectActions, boundGlobalActions, urls } = that.props;

  const user = await boundGlobalActions.getUserInfo();
  boundProjectActions
    .getPresetList({
      customer_id: user.uidPk,
      galleryBaseUrl: urls.get('galleryBaseUrl'),
      businessLine: 'YX_SAAS',
      platform: 'PWA',
    })
    .then(res => {
      const { presetOption } = that.state;
      const optionres = presetOption.concat(
        res.data.map(item => ({ text: item.template_name, value: item.template_id }))
      );
      that.setState({
        presetOption: optionres,
      });
    });
  boundProjectActions.getCollectionList('', 1).then(res => {
    that.setState({
      maxOrdering: res.data.records[0] && res.data.records[0]['ordering'] + 1,
    });
  });
};
export default {
  getAutoExpiryProps,
  getDatePickerProps,
  init,
};
