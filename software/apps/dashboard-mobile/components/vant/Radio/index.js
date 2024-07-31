import { Circle, Delete, Edit, StopCircleO } from '@react-vant/icons';
import cls from 'classnames';
import React from 'react';
import { Radio } from 'react-vant';

import './index.scss';

const XRadio = props => {
  const { rootClassName, iconRender, children, options, checkedColor = '#222222', ...rest } = props;
  const renderIcon = ({ checked, disabled }) => {
    return (
      <span className={cls('checked-radio', disabled && 'disabled')}>
        {checked && <span className="checked-radio-bg"></span>}
      </span>
    );
  };
  return (
    <Radio iconRender={iconRender && renderIcon} checkedColor={checkedColor} {...rest}>
      {children}
    </Radio>
  );
};

function XGroup(props, ref) {
  const { rootClassName, children, options, ...rest } = props;
  return (
    <Radio.Group className={cls('cxRadio', rootClassName)} {...rest} ref={ref}>
      {children}
    </Radio.Group>
  );
}

const XRadioContainer = XRadio;
XRadioContainer.Group = XGroup;

export default XRadioContainer;
