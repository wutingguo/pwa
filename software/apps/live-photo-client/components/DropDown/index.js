import React, { useEffect, useRef, useState } from 'react';

import { Container, List } from './layout';

export default React.memo(DropDown);
function DropDown(props) {
  const { children, overlay, defaultValue, open, onClick, type = 'click', style } = props;
  const [visible, setVisible] = useState(defaultValue || false);
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  const domRef = useRef(null);

  function _onClick(e) {
    if (type !== 'click') return;
    onClick && onClick(e);
    handleVisible(!visible);
  }

  useEffect(() => {
    if (typeof open === 'boolean') {
      setVisible(open);
    }
  }, [open]);

  useEffect(() => {
    if (!visible) return;
    const { height } = domRef.current.getBoundingClientRect();
    setTop(() => -height);
  }, [visible]);

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);
  function handleClick() {
    handleVisible(false);
  }

  function handleVisible(v = true) {
    setVisible(v);
  }

  function stopPropagationClick(e) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  }

  function _onMouseMove() {
    if (type !== 'hover') return;
    handleVisible(true);
  }

  function _onMouseLeave() {
    if (type !== 'hover') return;
    handleVisible(false);
  }

  return (
    <Container
      onClick={stopPropagationClick}
      onMouseMove={_onMouseMove}
      onMouseLeave={_onMouseLeave}
    >
      {React.cloneElement(children, { onClick: _onClick })}
      <List ref={domRef} style={{ top, left, display: visible ? '' : 'none', ...style }}>
        {overlay}
      </List>
    </Container>
  );
}
