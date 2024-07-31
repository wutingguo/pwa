import CheckBox from 'rc-checkbox';
import 'rc-checkbox/assets/index.css';
import React from 'react';

import { Container, Label } from './layout';

/**
 * CheckBox组件
 * @typedef {Object} FCheckBoxProps
 * @property {boolean} checked - 是否选中
 * @property {function} onChange - 选中状态改变时的回调
 * @property {string} labelText - label文案
 * @property {import('react').CSSProperties} style - 自定义样式
 * @param {FCheckBoxProps} props
 */
const FCheckBox = props => {
  const { checked, onChange, labelText = '隐藏', style } = props;

  /**
   * checkbox改变事件
   */
  const handleChange = e => {
    onChange?.(e.target.checked);
  };

  return (
    <Container style={style}>
      <CheckBox checked={checked} onChange={handleChange} />
      <Label>{labelText}</Label>
    </Container>
  );
};

export default FCheckBox;
