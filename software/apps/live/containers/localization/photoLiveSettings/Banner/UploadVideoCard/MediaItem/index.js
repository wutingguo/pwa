import React from 'react';

import ImageCard from './ImageCard';
import VideoCard from './VideoCard';
import { Container } from './layout';

export default function MediaItem(props) {
  const { type, style, className, ...rest } = props;
  function getCard() {
    switch (type) {
      case 'video':
        return <VideoCard {...rest} />;
      case 'image':
        return <ImageCard {...rest} />;
      default:
        return null;
    }
  }
  return (
    <Container style={style} className={className}>
      {getCard()}
    </Container>
  );
}
