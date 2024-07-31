import React, { useMemo, useState } from 'react';

import XRadio from '@resource/components/XRadio';

import { Container, Content, Overlay } from './layout';

export default function RadioImage(props) {
  const {
    src,
    text,
    imgStyle,
    style,
    onChange,
    checked,
    value,
    overlay,
    renderContent,
    onMouseMove,
    onMouseOut,
  } = props;
  const [isShow, setIsShow] = useState(false);

  function handleMouseMove(e) {
    onMouseMove?.(e);
    setIsShow(true);
  }

  function handleMouseOut(e) {
    onMouseOut?.(e);
    setIsShow(false);
  }
  return (
    <Container style={style}>
      <Content>
        <div onMouseMove={handleMouseMove} onMouseOut={handleMouseOut}>
          {typeof renderContent === 'function' ? (
            renderContent()
          ) : (
            <img src={src} style={imgStyle} />
          )}
        </div>
        <div>
          {checked ? (
            <XRadio checked={true} text={text} onClicked={() => onChange && onChange(value)} />
          ) : (
            <XRadio checked={false} text={text} onClicked={() => onChange && onChange(value)} />
          )}
        </div>
      </Content>
      {overlay ? <Overlay show={isShow}>{overlay}</Overlay> : null}
    </Container>
  );
}
