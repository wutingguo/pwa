import React, { Component } from 'react';
import { getDayNameItems, getMonthDates, getSelectedDate } from './handle';
import './index.scss';

class DatePicker extends Component {
  constructor(props) {
    super(props);
    const today = new Date();
    this.state = {
      year: today.getFullYear(),
      month: today.getMonth(),
      date: today.getDate(),
      today: {
        year: today.getFullYear(),
        month: today.getMonth(),
        date: today.getDate()
      }
    };

    this.monthStrings = [
      '一月',
      '二月',
      '三月',
      '四月',
      '五月',
      '六月',
      '七月',
      '八月',
      '九月',
      '十月',
      '十一月',
      '十二月'
    ];
    this.dayStrings = [
      
      '一',
      '二',
      '三',
      '四',
      '五',
      '六',
      '日'
    ];

    this.turnPrevMonth = this.turnPrevMonth.bind(this);
    this.turnNextMonth = this.turnNextMonth.bind(this);
    this.getMonthDates = () => getMonthDates(this);
  }

  componentWillMount() {
    const { selected } = this.props;
    const selectedDate = getSelectedDate(selected);
    this.setState({
      year: selectedDate.year,
      month: selectedDate.month,
      date: selectedDate.date
    });
  }

  turnPrevMonth() {
    this.setState({
      year: this.state.month > 0 ? this.state.year : this.state.year - 1,
      month: this.state.month > 0 ? this.state.month - 1 : 11
    });
  }

  turnNextMonth() {
    this.setState({
      year: this.state.month < 11 ? this.state.year : this.state.year + 1,
      month: this.state.month < 11 ? this.state.month + 1 : 0
    });
  }

  getIsShowTurnPrevMonthIcon() {
    const { selected, disablePastMonth } = this.props;
    if (!disablePastMonth) return true;
    const currentYear = this.state.today.year;
    const currentMonth = this.state.today.month;
    const selectedDate = getSelectedDate(selected);
    const startYear = Math.min(currentYear, selectedDate.year);
    let startMonth = 0;
    if (selectedDate.year < currentYear) {
      startMonth = selectedDate.month;
    } else if (selectedDate.year == currentYear) {
      startMonth = Math.min(currentMonth, selectedDate.month);
    } else if (selectedDate.year > currentYear) {
      startMonth = currentMonth;
    }
    const stateYear = this.state.year;
    const stateMonth = this.state.month;

    return (
      stateYear > startYear ||
      (stateYear === startYear && stateMonth > startMonth)
    );
  }

  render() {
    const isShowTurnPrevMonthIcon = this.getIsShowTurnPrevMonthIcon();
    const turnPrevMonthClassName = isShowTurnPrevMonthIcon
      ? 'prev-month'
      : 'prev-month hide';
    return (
      <div className="date-picker">
        <div className="picker-header">
          <div className={turnPrevMonthClassName} onClick={this.turnPrevMonth}>
            <i className="icon" />
          </div>
          <div className="date-content">
            {`${this.state.year} ${this.monthStrings[this.state.month]}`}
          </div>
          <div className="next-month" onClick={this.turnNextMonth}>
            <i className="icon" />
          </div>
        </div>
        <div className="picker-decribtion">
          {getDayNameItems(this.dayStrings)}
        </div>
        <div className="date-container clearfix">{this.getMonthDates()}</div>
      </div>
    );
  }
}

export default DatePicker;
