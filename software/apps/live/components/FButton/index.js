import React from 'react';
import { ButtonBox } from './layout';

export default function FButton(props) {
  const { children, ...rest } = props;

  return <ButtonBox {...rest}>{children}</ButtonBox>;
}
