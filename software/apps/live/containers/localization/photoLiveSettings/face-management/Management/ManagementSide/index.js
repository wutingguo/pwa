import React from 'react';

import ImageItem from './ImageItem';
import { Container, MenuList, Title } from './layout';

export default function ManagementSide(props) {
  const { onChange, value, users, baseUrl } = props;

  const title = `Facial information (${users.length})`;
  return (
    <Container>
      <Title>{title}</Title>
      <MenuList>
        {users.map((item, index) => {
          return (
            <ImageItem
              index={index}
              item={item}
              baseUrl={baseUrl}
              value={value}
              onChange={onChange}
            />
          );
        })}
      </MenuList>
    </Container>
  );
}
