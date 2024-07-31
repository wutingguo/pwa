import React from 'react';

export default function IcondownList(props) {
  const { style, className, fill = '#222', width = 20 } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height="13px"
      viewBox="0 0 14 13"
      version="1.1"
      style={style}
      className={className}
    >
      <title>向下收起_expand-down-one备份</title>
      <desc>Created with Sketch.</desc>
      <g
        id="直播工作台"
        stroke="none"
        stroke-width="1"
        fill="none"
        fill-rule="evenodd"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <g
          id="向下收起_expand-down-one备份"
          transform="translate(1.000000, 1.000000)"
          stroke={fill}
        >
          <line x1="0" y1="0.333333333" x2="12" y2="0.333333333" id="路径" />
          <line x1="0" y1="3.66666667" x2="12" y2="3.66666667" id="路径" />
          <polyline id="路径" points="0 6 6 10.6666667 12 6" />
        </g>
      </g>
    </svg>
  );
}
