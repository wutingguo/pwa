import React from 'react';
import styled from 'styled-components';

import infoSrc from './info.png';

const Container = styled.div`
  background: #f6f6f6;
  border-radius: 4px;
  img {
    width: 100%;
  }
`;
export default function MenuList(props) {
  // const panelImg = '/clientassets-cunxin-saas/portal/images/pc/live/panel.png';
  const panelImg = infoSrc;
  const { task } = props;
  return (
    <Container>
      <img src={panelImg} />
    </Container>
  );
}
