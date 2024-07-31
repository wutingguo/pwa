import React from 'react';

import FInput from '@apps/live/components/FInput';

import { Container } from './layout';

export default function OpenLink(props) {
  const { value, onChange } = props;

  return (
    <Container>
      <FInput
        value={value}
        onChange={onChange}
        placeholder="链接地址，如：https://www.cunxin.com"
        max={500}
      />
    </Container>
  );
}
