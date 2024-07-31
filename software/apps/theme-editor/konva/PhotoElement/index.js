import React, { useCallback } from 'react';
import * as renderHelper from '@apps/theme-editor/utils/canvas/helper';
import BaseElement from '../BaseElement';

const PhotoElement = props => {
  const { element } = props;
  const { width, height, image } = renderHelper.getRenderElementOptions(element);
  const sceneFunc = useCallback(
    ctx => {
      const tmpCanvas = document.createElement('canvas');
      tmpCanvas.width = width;
      tmpCanvas.height = height;
      const tCtx = tmpCanvas.getContext('2d');
      tCtx.fillStyle = '#90DAFF';
      tCtx.fillRect(0, 0, width, height);
      tCtx.globalCompositeOperation = 'destination-atop';
      tCtx.drawImage(image, 0, 0, width, height);
      ctx.drawImage(tmpCanvas, 0, 0, width, height);
    },
    [width, height]
  );
  return <BaseElement {...props} sceneFunc={sceneFunc} />;
};

export default PhotoElement;
