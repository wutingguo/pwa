import React from 'react';

import { Field } from '@apps/live/components/Form';

import OpenLink from './OpenLink';
import Phone from './Phone';
import Picture from './Picture';
import { Container } from './layout';

export default function OperatorBtn(props) {
  const { value, onChange, baseUrl, boundGlobalActions, defaultValueObj = {}, name } = props;
  const tabs = [
    {
      key: 1,
      label: '打开图片',
    },
    {
      key: 2,
      label: '打开链接',
    },
    {
      key: 3,
      label: '拨打电话',
    },
  ];

  console.log(value, 'value');
  return (
    <Container>
      <div className="instantEffect">
        <div className="tabWrpper">
          {tabs.map((item, i) => (
            <div
              className={`tab ${item.key === value ? 'cur' : ''}`}
              key={item.key}
              onClick={() => onChange(item.key, i)}
            >
              {item.label}
            </div>
          ))}
        </div>
        <div className="effectContent">
          {value === 1 ? (
            <Field
              name="button_function_value"
              rules={[{ required: true, message: '按钮功能不能为空！' }]}
              defaultValue={
                defaultValueObj[name] === 1 ? defaultValueObj.button_function_value : undefined
              }
            >
              <Picture baseUrl={baseUrl} boundGlobalActions={boundGlobalActions} />
            </Field>
          ) : null}
          {value === 2 ? (
            <Field
              name="button_function_value"
              rules={[{ required: true, message: '按钮功能不能为空！' }]}
              defaultValue={
                defaultValueObj[name] === 2 ? defaultValueObj.button_function_value : undefined
              }
            >
              <OpenLink />
            </Field>
          ) : null}
          {value === 3 ? (
            <Field
              name="button_function_value"
              rules={[{ required: true, message: '按钮功能不能为空！' }]}
              defaultValue={
                defaultValueObj[name] === 3 ? defaultValueObj.button_function_value : undefined
              }
            >
              <Phone />
            </Field>
          ) : null}
        </div>
      </div>
    </Container>
  );
}
