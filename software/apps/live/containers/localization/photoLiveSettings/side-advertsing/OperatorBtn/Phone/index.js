import React from 'react';

import FInput from '@apps/live/components/FInput';

import { Container } from './layout';

export default function OpenLink(props) {
  const { value, onChange } = props;

  return (
    <Container>
      <FInput value={value} onChange={onChange} placeholder="请输入电话号码" max={20} />
    </Container>
  );
}
