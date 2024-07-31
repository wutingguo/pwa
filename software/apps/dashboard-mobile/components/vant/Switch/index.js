import cls from 'classnames';
import React from 'react';
import { Switch } from 'react-vant';

import './index.scss';

export default props => {
  const {
    rootClassName,
    activeColor = '#222222',
    inactiveColor = '#dcdee0',
    children,
    ...rest
  } = props;
  return (
    <Switch
      activeColor={activeColor}
      inactiveColor={inactiveColor}
      className={cls('cxSwitch', rootClassName)}
      {...rest}
    />
  );
};
