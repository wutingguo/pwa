import React, { useContext, useEffect, useLayoutEffect, useReducer, useRef } from 'react';
import { useState } from 'react';
import styled from 'styled-components';

import { FormContext } from '../formContext';

const Container = styled.div`
  font-size: 16px;
  .msg {
    color: red;
    min-height: 20px;
  }
`;

const Item = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
`;

const Label = styled.label`
  &.horizontal {
    flex: 1;
    min-width: 80px;
    font-weight: 400;
    color: #222222;
    line-height: 16px;
    margin-right: 10px;
    margin-top: 22px;
  }

  &.vertical {
    width: 100%;
    min-width: 80px;
    font-weight: 400;
    color: #222222;
    line-height: 16px;
    margin-right: 10px;
    margin-top: 10px;
  }

  .star {
    color: red;
  }
`;

const Content = styled.div`
  &.horizontal {
    flex: 23;
    margin-top: 10px;
  }

  &.vertical {
    width: 100%;
    margin-top: 10px;
  }
`;

const Message = styled.div`
  transform: translateY(-20px);
  opacity: 0;
  transition: all 0.2s;
  &.form-message-show {
    transform: translateY(0px);
    opacity: 1;
  }
`;

export default function Field(props) {
  const { form, layout: formLayout = 'v', wrapCol = {}, formStateChange } = useContext(FormContext);
  const pageView = useRef(null);
  const [, dispatch] = useReducer(c => c + 1, 0);
  const {
    children,
    name,
    rules,
    label,
    defaultValue,
    style,
    className,
    labelStyle,
    required,
    layout: fieldLayout,
    isScrollError = false, //是否支持定位到错误位置
    ruleTrigger = 'submit',
  } = props;

  const layout = fieldLayout || formLayout;
  useLayoutEffect(() => {
    if (typeof name === 'string') {
      form.boundField(name, { subscribe: updataField, rules, defaultValue, getRules });
    }

    return () => {
      form.unountField(name || '');
    };
  }, []);
  useEffect(() => {
    if (typeof name === 'string') {
      form.updateProperty(name, 'rules', rules);
    }
  });
  function getRules() {
    if (rules) return rules;
    return [];
  }
  function updataField() {
    dispatch();
  }
  const message = form.getFieldError(name || '');
  function onChange(e) {
    const value = e.target ? e.target.value : e;
    if (children && typeof children !== 'function' && children.props.onChange) {
      children.props.onChange(e);
    }
    // console.log(value);
    if (!name) return;
    formStateChange?.(name, value);
    ruleTrigger === 'onChange' &&
      message?.status !== 'done' &&
      form.setFieldError(name, {
        status: 'done',
        value: '',
      });
    form.setFieldValue(name, value);
  }

  const value = typeof name === 'string' ? form.getFieldValue(name) : undefined;

  // 定位到错误位置
  useEffect(() => {
    if (isScrollError && message?.value) {
      pageView.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [message?.value]);
  const el = () => {
    if (!children) return null;
    if (typeof name === 'string' && typeof children !== 'function') {
      return React.cloneElement(children, {
        onChange,
        value: value || '',
        defaultValue,
        name,
      });
    } else if (typeof name === 'string' && typeof children === 'function') {
      return children(value, onChange, { message, name });
    }
    return React.cloneElement(children);
  };
  return (
    <Container {...style} className={className} ref={pageView}>
      <Item>
        {label ? (
          <Label
            name={name}
            style={{ ...labelStyle, flex: layout === 'h' ? wrapCol.labelCol : '' }}
            className={`${layout === 'h' ? 'horizontal' : 'vertical'}`}
          >
            <span className="text">{label}</span>
            {required ? <span className="star">*</span> : null}
          </Label>
        ) : null}
        <Content className="horizontal" style={{ flex: wrapCol.textCol }}>
          <div>{el()}</div>
          <div
            style={{ visibility: message?.status !== 'done' ? 'inherit' : 'hidden' }}
            className="msg"
          >
            <Message className={message?.value ? 'form-message-show' : ''}>
              {message?.value}
            </Message>
          </div>
        </Content>
      </Item>
    </Container>
  );
}
