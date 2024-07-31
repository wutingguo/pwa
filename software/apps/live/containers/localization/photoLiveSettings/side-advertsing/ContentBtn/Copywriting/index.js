import React from 'react';

import FInput from '@apps/live/components/FInput';

import { Container } from './layout';

export default function Copywriting(props) {
  const { value, onChange } = props;

  return (
    <Container>
      <FInput value={value} onChange={onChange} placeholder="查看详情" max={4} />
    </Container>
  );
}
