import cls from 'classnames';
import React from 'react';

const Checkbox = props => {
  const { label, checked, onChange, className } = props;

  return (
    <span className={cls('pm-checkbox', className)}>
      {checked ? (
        <span className="pm-checkbox-input checked" onClick={onChange}>
          ✔
        </span>
      ) : (
        <span className="pm-checkbox-input" onClick={onChange}></span>
      )}
      {label && <span className="pm-checkbox-label">{label}</span>}
    </span>
  );
};

export default Checkbox;
