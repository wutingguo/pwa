import React, { useEffect, useState } from 'react';
import { Container, Image } from './layout';

export default function Item(props) {
  const [url, setUrl] = useState(undefined);
  const [sourceUrl, setSourceUrl] = useState(undefined);
  const { src, sourceSrc, style } = props;

  useEffect(() => {
    getUrl();
    getSource();
  }, [src]);

  async function getUrl() {
    if (typeof src === 'string') {
      setUrl(src);
    } else {
      const res = await src();
      setUrl(res);
    }
  }

  async function getSource() {
    if (typeof sourceSrc === 'string') {
      setSourceUrl(sourceSrc);
    } else {
      const res = await sourceSrc();
      setSourceUrl(res);
    }
  }
  return (
    <Container style={{ ...style }}>
      <Image src={url} />
      <Image src={sourceUrl} loading="lazy" />
    </Container>
  );
}
