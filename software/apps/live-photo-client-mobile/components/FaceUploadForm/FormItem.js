import classNames from 'classnames';
import React from 'react';

import { Field } from '@apps/live/components/Form';

import { Input } from './layout';

/**
 * 表单项
 * @typedef {Object} FormItemProps
 * @property {string} className 自定义类名
 * @property {string} name 字段名
 * @property {string} label 标签名
 * @property {Array} rules 校验规则
 * @param {FormItemProps} props
 */
const FormItem = props => {
  const { className, name, label, rules } = props;
  const newClassName = classNames('faceItem', {
    [className]: className,
  });

  return (
    <Field className={newClassName} name={name} label={label} rules={rules}>
      <Input />
    </Field>
  );
};

export default FormItem;
