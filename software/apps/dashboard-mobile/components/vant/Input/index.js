import cls from 'classnames';
import React from 'react';
import { Input } from 'react-vant';

import './index.scss';

const XInput = props => {
  const { rootClassName, children, ...rest } = props;
  return (
    <Input className={cls('cxInput', rootClassName)} {...rest}>
      {children}
    </Input>
  );
};

function XTextArea(props) {
  const { rootClassName, children, ...rest } = props;
  return (
    <Input.TextArea className={cls('cxTextArea', rootClassName)} {...rest}>
      {children}
    </Input.TextArea>
  );
}

const XInputContainer = XInput;
XInputContainer.TextArea = XTextArea;
export default XInputContainer;
