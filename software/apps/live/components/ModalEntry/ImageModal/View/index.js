import React from 'react';
import { Container } from './layout';
import IconLeft from '@apps/live/components/Icons/IconLeft';
import datasource from './mock';
import ImageBox from './ImageBox';

export default function View(props) {
  const { baseUrl, onSlideChange, initialSlide, list } = props;

  return (
    <Container>
      <ImageBox
        list={list}
        baseUrl={baseUrl}
        onSlideChange={onSlideChange}
        initialSlide={initialSlide}
      />
    </Container>
  );
}
