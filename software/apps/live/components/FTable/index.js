import React from 'react';
import { Container } from './layout';
import Table from 'rc-table';

export default function FTable(props) {
  const { style, emptyText = '暂无数据', ...rest } = props;

  return (
    <Container style={style}>
      <Table emptyText={emptyText} {...rest} />
    </Container>
  );
}
