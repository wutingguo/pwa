import cls from 'classnames';
import React from 'react';
import { Cell } from 'react-vant';

import './index.scss';

export default props => {
  const { rootClassName, children, ...rest } = props;
  return (
    <Cell className={cls('cxCell', rootClassName)} {...rest}>
      {children}
    </Cell>
  );
};
