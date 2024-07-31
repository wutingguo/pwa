import React, { memo } from 'react';

import { useWatch } from '@apps/live/components/Form';

import { CouponDate, CouponField } from '../index';

import './index.scss';

const ActiveDates = props => {
  //监听字段值改变控制UI变化
  const { form } = props;
  const { start_date, end_date } = useWatch(['end_date', 'start_date'], form);
  return (
    <div className="ActiveDates">
      <div className="title">Active Dates</div>
      <div className="myTimeBox">
        <CouponField
          name="start_date"
          placeholder="Optional"
          label="Start date"
          desc={['0:00:00 PST']}
          defaultValue={new Date().getTime()}
        >
          <CouponDate
            minDate={new Date('')}
            type="start"
            maxDate={end_date ? new Date(end_date) : null}
            isHideClear={true}
          />
        </CouponField>
        <CouponField name="end_date" label="End date" desc={['23:59:59 PST']}>
          <CouponDate
            minDate={start_date ? new Date(start_date) : new Date()}
            maxDate={new Date('')}
            placeholder="Optional"
            type="end"
          />
        </CouponField>
      </div>
    </div>
  );
};

export default memo(ActiveDates);
