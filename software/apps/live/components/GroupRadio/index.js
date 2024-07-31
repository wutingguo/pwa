import cls from 'classnames';
import React from 'react';

import { RcRadio } from '@resource/components/XRadio';

import './index.scss';

const GroupRadioContext = React.createContext({});
export default function GroupRadio(props) {
  const { children, value, onChange, style, className = 'group_box' } = props;

  return (
    <GroupRadioContext.Provider value={{ value, onChange }}>
      <div className={cls(className)} style={style}>
        {children}
      </div>
    </GroupRadioContext.Provider>
  );
}

export function Radio(props) {
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
