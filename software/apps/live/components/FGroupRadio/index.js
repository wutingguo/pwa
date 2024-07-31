import cls from 'classnames';
import React from 'react';

import { RcRadio } from '@resource/components/XRadio';

import './index.scss';

const GroupRadioContext = React.createContext({});
export default function FGroupRadio(props) {
  const { children, value, onChange, style, classname } = props;

  return (
    <GroupRadioContext.Provider value={{ value, onChange }}>
      <div className={cls('group_box', classname)} style={style}>
        {children}
      </div>
    </GroupRadioContext.Provider>
  );
}

export function FRadio(props) {
  const { value: radioValue, children, style, className } = props;
  const { onChange, value } = React.useContext(GroupRadioContext);
  function handleChange() {
    onChange(radioValue);
  }
  return (
    <span style={style} className={cls('radio_box', className)}>
      <RcRadio checked={value === radioValue} onChange={handleChange}>
        {children}
      </RcRadio>
    </span>
  );
}
