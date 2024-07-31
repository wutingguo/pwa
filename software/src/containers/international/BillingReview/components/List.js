import React from 'react';

export default ({ className, labelClass, valueClass, listConfig = [], data = {} }) => {
  return (
    <ul className={className}>
      {
        Array.isArray(listConfig) && listConfig.map((item, i) => {
          const { className = '', key, label, hide, renderValue } = item;
          const value = data[key];
          if (hide) {
            return null;
          }
          return (
            <li key={key} className={className}>
              {label && <span className={labelClass}>{label}: </span>}
              {
                renderValue ? renderValue(value, i, data) : <span className={valueClass}>{value}</span>
              }
            </li>
          )
        })
      }
    </ul>
  )
}