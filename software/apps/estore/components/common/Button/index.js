import React, { memo, useMemo } from 'react';
import classnames from 'classnames';
import './index.scss';

const iconImageUrlMap = {
  add: '+',
  edit: '',
  delete: ''
};

const Button = ({
  className,
  style = {},
  type = 'primary',
  optionType = '',
  label = '',
  labelStyle = {},
  size = 'large',
  Icon,
  children,
  onClick
}) => {
  const buttonClassName = classnames(
    'store-components-button',
    `size-${size}`,
    `store-components-button--${type}`,
    className
  );
  const ButtonIcon = useMemo(() => {
    if (!optionType) return null;
    const iconUrl = iconImageUrlMap[optionType];
    if (!iconUrl) {
      return null;
    }
    // 支持字符作为 “图标”  以结尾是否有后缀区分imgUrl与普通字符串
    const isImgUrl = /\..+$/.test(iconUrl);
    // TODO: img icon
    return (
      <span className="store-components-button__icon">
        {isImgUrl ? <img src={iconUrl} /> : <span>{iconUrl}</span>}
      </span>
    );
  }, [optionType]);

  return (
    <button className={buttonClassName} style={style} onClick={onClick}>
      {children || (
        <>
          {Icon || ButtonIcon}
          <span className="store-components-button__label" style={labelStyle}>
            {label}
          </span>
        </>
      )}
    </button>
  );
};

export default memo(Button);

// TODO: propTypes
