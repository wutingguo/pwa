import React from 'react';
import { Container } from './layout';
import IconEmpty from '@apps/live/components/Icons/IconEmpty';

export default function Empty(props) {
  const { style } = props;

  return (
    <Container style={style}>
      <IconEmpty />
    </Container>
  );
}
