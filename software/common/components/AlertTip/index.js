import React, { memo, useState, useEffect, useCallback } from 'react';
import cls from 'classnames';
import Popover from '@resource/components/Popover';
import jingshiPng from './jingshi.png';
import './index.scss';

const AlertTip = ({ className, message = '', maxWidth = '165px', icon, placement }) => {
  return (
    <Popover
      className={'estore-alert-tip-popover'}
      theme="black"
      placement={placement || 'right'}
      offsetLeft={0}
      rectToEdge={30}
      trigger="hover"
      hideOnOutsideDelay={200}
      Target={
        <span
          className={cls('estore-alert-tip', className)}
          onMouseOver={e => e.stopPropagation()}
          onClick={e => e.stopPropagation()}
        >
          <span className="estore-alert-tip__image-container">
            <img src={icon || jingshiPng} />
          </span>
        </span>
      }
    >
      <div className="estore-alert-tip-popover__message" style={{ maxWidth }}>
        {message}
      </div>
    </Popover>
  );
};

export default memo(AlertTip);
