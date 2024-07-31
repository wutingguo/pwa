import React, { useEffect, useRef, useState } from 'react';
import { Group, Image } from 'react-konva';
import useImage from 'use-image';

import * as renderHelper from '@apps/ai-matting/utils/canvas/helper';

function PhotoElement(props) {
  const { element, children, sceneFunc, filters = [] } = props;
  const { x, y, width, height, rot, offset, zIndex, imgUrl } =
    renderHelper.getRenderElementOptions(element);

  const [image] = useImage(imgUrl);
  const imageRef = useRef();

  useEffect(() => {
    if (image) {
      imageRef.current.cache();
    }
  }, [image]);

  const groupsProps = {
    id: element.get('id'),
    name: 'element',
    x,
    y,
    width,
    height,
    offset,
    zIndex,
    rotation: rot,
  };

  const imageProps = {
    ref: imageRef,
    x: 0,
    y: 0,
    width,
    height,
    image: image,
    filters,
  };

  if (sceneFunc) {
    imageProps.sceneFunc = sceneFunc;
  }

  return (
    <>
      <Group {...groupsProps}>
        <Image {...imageProps} />
        {children}
      </Group>
    </>
  );
}

export default PhotoElement;
