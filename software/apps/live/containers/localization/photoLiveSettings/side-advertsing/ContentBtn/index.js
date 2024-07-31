import React from 'react';

import { Field } from '@apps/live/components/Form';

import Copywriting from './Copywriting';
import Picture from './Picture';
import { Container } from './layout';

export default function ContentBtn(props) {
  const { value, onChange, baseUrl, boundGlobalActions, defaultValueObj = {}, name } = props;
  const tabs = [
    {
      key: 1,
      label: '图片',
    },
    {
      key: 2,
      label: '文案',
    },
  ];
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
              name="button_content_value"
              rules={[{ required: true, message: '按钮内容不能为空！' }]}
              defaultValue={
                defaultValueObj[name] === 1 ? defaultValueObj.button_content_value : undefined
              }
            >
              <Picture baseUrl={baseUrl} boundGlobalActions={boundGlobalActions} />
            </Field>
          ) : null}
          {value === 2 ? (
            <Field
              name="button_content_value"
              rules={[{ required: true, message: '按钮内容不能为空！' }]}
              defaultValue={
                defaultValueObj[name] === 2 ? defaultValueObj.button_content_value : undefined
              }
            >
              <Copywriting />
            </Field>
          ) : null}
        </div>
      </div>
    </Container>
  );
}
