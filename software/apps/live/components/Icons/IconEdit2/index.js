import React from 'react';

export default function Icon(props) {
  const { fill = '#e6e6e6', style, className, width = 20 } = props;
  return (
    <svg
      t="1693796164195"
      className={className}
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="4405"
      width={width}
      fill={fill}
      style={style}
    >
      <path
        d="M775.84 392.768l-155.2-172.352L160.768 643.264l-38.368 187.936 190.56-12.832zM929.952 229.952l-131.2-150.944-0.288-0.32a16 
        16 0 0 0-22.592-0.96l-131.168 120.576 155.168 172.352 128.832-118.464a15.936 15.936 0 0 0 1.248-22.24zM96 896h832v64H96z"
        p-id="4406"
      ></path>
    </svg>
  );
}