import React from 'react';

import Card from './Card';
import { Container } from './layout';

export default function Test(props) {
  const { urls, baseInfo } = props;
  const baseUrl = urls.get('galleryBaseUrl');
  console.log('baseInfo', baseInfo);
  return (
    <Container>
      <Card baseUrl={baseUrl} baseInfo={baseInfo} />
    </Container>
  );
}
