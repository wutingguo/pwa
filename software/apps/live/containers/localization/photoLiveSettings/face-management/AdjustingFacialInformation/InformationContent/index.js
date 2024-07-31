import React, { useState } from 'react';

import Empty from '@apps/live/components/Empty';

import ImageItem from './ImageItem';
import { Container, Content, Header, List } from './layout';

export default function InformationContent(props) {
  const { onSwitchUser, record } = props;
  return (
    <Container>
      {record ? (
        <>
          <Header>{/* <span className="header_count">{`（${data.length}）`}</span> */}</Header>
          <Content>
            <List>
              <ImageItem key={record.id} item={record} onSwitchUser={onSwitchUser} />
            </List>
          </Content>
        </>
      ) : (
        <Empty style={{ height: '100%' }} />
      )}
    </Container>
  );
}
