import cls from 'classnames';
import React from 'react';
import { Calendar } from 'react-vant';

import Cell from '../Cell';

import './index.scss';

export default props => {
  const { rootClassName, title, isLink, children, color = '#222222', ...rest } = props;
  return (
    <Calendar color={color} className={cls('cxCalendar', rootClassName)} {...rest}>
      {(val, actions) => (
        <Cell
          isLink={isLink}
          title={title}
          value={val ? val.toLocaleDateString() : '请选择日期'}
          onClick={() => actions.open()}
        />
      )}
    </Calendar>
  );
};
