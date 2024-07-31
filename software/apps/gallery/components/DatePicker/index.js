import moment from 'moment';
import Proptypes from 'prop-types';
import React, { Component } from 'react';
import Calendar from 'react-calendar';

import { XPureComponent } from '@common/components';

import './index.scss';

class DatePicker extends XPureComponent {
  constructor(props) {
    super(props);
  }

  onChange = date => {
    // console.log('date: ', date);
    const { onDateChange } = this.props;
    onDateChange && onDateChange(new Date(date));
  };

  onToday = () => {
    this.onChange(new Date());
    this.props.onToday && this.props.onToday();
  };

  onClear = () => {
    const { onDateClear } = this.props;
    onDateClear && onDateClear();
  };

  onClose = () => {
    const { onDateClose } = this.props;
    onDateClose && onDateClose();
  };

  render() {
    console.log('__LANGUAGE__: ', __LANGUAGE__);
    const { date, onChange, ...reset } = this.props;
    return (
      <div className="date-picker-container">
        <Calendar
          onChange={onChange || this.onChange}
          value={date}
          locale={__LANGUAGE__}
          calendarType="US"
          minDate={new Date()}
          allowPartialRange
          {...reset}
        />
        <div className="date-picker-footer">
          <span className="footer-btn today" onClick={this.onToday}>
            {t('DATE_PICKER_TODAY')}
          </span>
          {!this.props.isHideClear && (
            <span className="footer-btn clear" onClick={this.onClear}>
              {t('DATE_PICKER_CLEAR')}
            </span>
          )}
          <span className="footer-btn close" onClick={this.onClose}>
            {t('DATE_PICKER_CLOSE')}
          </span>
        </div>
      </div>
    );
  }
}

export default DatePicker;

DatePicker.propTypes = {
  date: Proptypes.object.isRequired,
  onDateChange: Proptypes.func.isRequired,
  onDateToday: Proptypes.func.isRequired,
  onDateClear: Proptypes.func.isRequired,
  onDateClose: Proptypes.func.isRequired,
};

DatePicker.defaultProps = {};
