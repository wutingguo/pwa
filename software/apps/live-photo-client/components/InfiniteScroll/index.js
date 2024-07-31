import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Container } from './layout';
import IconLoading from '@apps/live/components/Icons/IconLoading';

function isWindow(element) {
  return element === window;
}
export default function InfiniteScroll(props) {
  const { children, onload, loding = false } = props;
  const el = useRef(null);
  const scrollTimer = useRef(null);
  const [parentScroll, setParentScroll] = useState(null);

  useLayoutEffect(() => {
    if (!parentScroll) return;
    parentScroll.addEventListener('scroll', onscroll);
    return () => {
      clearTimeout(scrollTimer.current);
      parentScroll.removeEventListener('scroll', onscroll);
    };
  }, [parentScroll]);
  useLayoutEffect(() => {
    onscroll();
  }, []);
  function onscroll() {
    const footer = el.current;
    if (scrollTimer.current) {
      clearTimeout(scrollTimer.current);
      scrollTimer.current = null;
    }
    const parent = getScrollParent(footer);
    setParentScroll(parent);
    const height = isWindow(parent) ? window.innerHeight : parent.getBoundingClientRect().bottom;
    const top = footer.getBoundingClientRect().top;
    if (height >= top) {
      scrollTimer.current = setTimeout(() => {
        onload && onload();
        scrollTimer.current = null;
      }, 300);
    }
  }

  const child = useMemo(() => {
    if (loding === false) {
      return children;
    }
    return <IconLoading />;
  }, [children, loding]);

  return <Container ref={el}>{child}</Container>;
}

const defaultRoot = window;
const overflowStylePatterns = ['scroll', 'auto', 'overlay'];
function isElement(node) {
  const ELEMENT_NODE_TYPE = 1;
  return node.nodeType === ELEMENT_NODE_TYPE;
}

function getScrollParent(el, root = defaultRoot) {
  let node = el;

  while (node && node !== root && isElement(node)) {
    if (node === document.body) {
      return root;
    }
    const { overflowY } = window.getComputedStyle(node);
    if (overflowStylePatterns.includes(overflowY) && node.scrollHeight > node.clientHeight) {
      return node;
    }
    node = node.parentNode;
  }
  return root;
}
