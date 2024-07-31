import React, { useMemo, useState } from 'react';

import { ChildBox, Container } from './layout';

export default function ImageBox(props) {
  const { backgroundUrl, width, height, options } = props;

  const data = useMemo(() => {
    const newOpt =
      options?.map(item => {
        const {
          top = 0,
          left = 0,
          right = '.',
          bottom = '.',
          scale = 1,
          opacity = 1,
          marginLeft,
          marginTop,
          marginRight,
          marginBottom,
          bannerWidth, // 上、下边栏width为100%
          bannerHeight, // 左、右边栏height为100%
          url,
        } = item;
        // console.log('item///', item);
        const offsetTop = top * height;
        const offsetLeft = left * width;
        const offsetBottom = bottom * height;
        const offsetRight = right * width;
        const boxWidth = width * scale;
        return {
          offsetTop,
          offsetLeft,
          offsetBottom,
          offsetRight,
          boxWidth,
          opacity,
          url,
          marginLeft,
          marginTop,
          marginRight,
          marginBottom,
          bannerWidth,
          bannerHeight,
        };
      }) || [];
    return newOpt;
  }, [options, width, height]); // 修复data在width、height变化时数据不更新
  // console.log('data', data);
  return (
    <Container backgroundUrl={backgroundUrl} width={width} height={height}>
      {data.map(item => {
        return (
          <ChildBox
            src={item.url}
            top={item.offsetTop}
            left={item.offsetLeft}
            bottom={item.offsetBottom}
            right={item.offsetRight}
            opacity={item.opacity}
            width={item.boxWidth}
            marginLeft={item.marginLeft}
            marginTop={item.marginTop}
            marginRight={item.marginRight}
            marginBottom={item.marginBottom}
            style={{
              width: item.bannerWidth,
              height: item.bannerHeight,
            }}
          />
        );
      })}
    </Container>
  );
}
