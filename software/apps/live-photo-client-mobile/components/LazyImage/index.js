import { Image } from 'antd-mobile';
import React, { useEffect, useRef, useState } from 'react';

import ImgMaskSelect from '@apps/live-photo-client-mobile/components/ImgMaskSelect';

import loadingSrc from './img/loading.png';
import { Container, Loading, Text } from './layout';

export default function LazyImage(props) {
  const { src, style = {}, className, lazy = true, fit = 'cover', imgStyle, info, puzzle } = props;
  const [loaded, setLoaded] = useState(false);
  function onload() {
    setLoaded(true);
  }

  const width = style?.width || '';
  const height = style.height || '';
  return (
    <Container
      style={{ height: '100%', width: '100%', overflow: 'hidden', ...style }}
      className={className}
    >
      {!loaded ? (
        <Loading>
          <div className="loading-content">
            <img src={loadingSrc} style={{ width: 76, height: 76 }} />
            <Text>{t('LPCM_PHOTO_LOADING')}</Text>
          </div>
        </Loading>
      ) : null}
      <Image
        lazy={lazy}
        fit={fit}
        onLoad={onload}
        src={src}
        style={{ opacity: loaded ? 1 : 0, width: loaded ? width : 0, ...imgStyle }}
      />
      {info ? <ImgMaskSelect info={info} src={src} puzzle={puzzle} /> : null}
    </Container>
  );
}
