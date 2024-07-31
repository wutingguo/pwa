import React from 'react';
import { Content, Icon, Text } from './layout';

export default function Message(props) {
  const { icon, text } = props;

  return (
    <Content>
      <Icon>{icon}</Icon>
      <Text>{text}</Text>
    </Content>
  );
}
