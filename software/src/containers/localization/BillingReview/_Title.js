import React from 'react';
import classnames from 'classnames';

export default ({className, title, rightText, rightClick=()=>{}}) => {
  const wrapClass = classnames('title-wrapper', {
    [className]: !!className
  })
  return (
    <div className={wrapClass}>
      <div className="title">{title}</div>
      {rightText && <div className="right-text" onClick={rightClick}>{rightText}</div>}
    </div>
  )
}
