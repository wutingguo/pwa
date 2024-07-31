import React, { Fragment, useMemo, useRef, useState } from 'react';

import Success from '@apps/live/components/Icons/IconSuccess';
import Waring from '@apps/live/components/Icons/waring';

import Message from './Message';
import { Container } from './Message/layout';

function getKey() {
  return Math.random().toString(16).slice(2);
}

/**
 * 默认值
 */
const defaultOptions = {
  style: {},
};

/**
 * 公共消息弹窗
 */
export default function useMessage(options = defaultOptions) {
  const { style } = options;
  const messages = useRef([]);
  const [num, update] = useState(0);

  const Placeholder = useMemo(() => {
    if (messages.current.length === 0) return null;

    return (
      <Container style={{ ...style }}>
        {messages.current.map(item => {
          return <Fragment key={item.key}>{item.el}</Fragment>;
        })}
      </Container>
    );
  }, [num]);

  function pushMsg(type, options) {
    const key = options.key || getKey();
    const { text, icon, delay = 3 } = options;
    const time = delay * 1000;
    messages.current.push({
      key,
      el: <Message text={text} icon={icon || <Success />} />,
    });
    update(c => c + 1);
    const timeId = setTimeout(() => {
      messages.current = messages.current.filter(item => item.key !== key);
      update(c => c + 1);
      clearTimeout(timeId);
    }, time);
  }

  function success(text, delay) {
    pushMsg('success', { text, delay });
  }

  function error(text, delay) {
    pushMsg('success', { text, delay, icon: <Waring fill="red" /> });
  }

  function waring(text, delay) {
    pushMsg('success', { text, delay, icon: <Waring /> });
  }

  const dispatch = { success, error, waring };

  return [Placeholder, dispatch];
}
