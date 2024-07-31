import React, { cloneElement, memo, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import classnames from 'classnames';
import './index.scss';

const Popover = ({
  className,
  Target,
  visible,
  container = document.body,
  onVisibleChange,
  offsetTop = 6,
  children
}) => {
  const ref = useRef();
  const targetRef = useRef();
  const [state, setState] = useState({
    position: null
  });

  const set = useCallback((payload = {}) => {
    setState(v => ({ ...v, ...payload }));
  }, []);

  const handleOnClickOutside = useCallback(
    e => {
      if (visible && !ref.current?.contains(e.target) && !targetRef.current?.contains(e.target)) {
        onVisibleChange && onVisibleChange(false);
      }
    },
    [visible, onVisibleChange]
  );

  useEffect(() => {
    const targetEl = targetRef.current;
    if (!targetEl) return;
    const { right, bottom, width } = targetEl.getBoundingClientRect();
    console.log('targetEl rect', targetEl.getBoundingClientRect());
    const triangleHeightAndWidth = Math.sqrt(2 * Math.pow(10, 2)) / 2;
    set({
      position: {
        top: bottom + offsetTop + triangleHeightAndWidth + window.scrollY,
        right: window.innerWidth - right + width / 2 - 30 - triangleHeightAndWidth
      }
    });
    window.addEventListener('click', handleOnClickOutside);
    return () => {
      window.removeEventListener('click', handleOnClickOutside);
    };
  }, [handleOnClickOutside, offsetTop, visible]);

  const { position } = state;

  if (!visible) return Target;

  return [
    cloneElement(Target, {
      ref: targetRef
    }),
    position &&
      createPortal(
        <div
          ref={ref}
          className="print-store-popover"
          style={{
            visibility: visible ? 'visible' : 'hidden',
            top: position.top,
            right: position.right
          }}
        >
          <div className={classnames('print-store-popover__inner', className)}>{children}</div>
        </div>,
        typeof container === 'string' ? document.querySelector(container) : container
      )
  ];
};

export default memo(Popover);
