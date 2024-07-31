import React from 'react';

export default function IconPrint(props) {
  const { style, className, fill = '#222', width = 20 } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={width}
      height="14px"
      viewBox="0 0 14 14"
      version="1.1"
      style={style}
    >
      <title>打印机_printer-two备份</title>
      <desc>Created with Sketch.</desc>
      <g id="直播工作台" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="打印机_printer-two备份" transform="translate(1.000000, 1.000000)" stroke={fill}>
          <path
            d="M10.6666667,4.66666667 L10.6666667,0.666666667 C10.6666667,0.298476667 10.3682,0 10,0 L2,0 C1.6318,0 1.33333333,0.298476667 1.33333333,0.666666667 L1.33333333,4.66666667"
            id="路径"
            stroke-linecap="round"
          />
          <rect id="矩形" x="0" y="4.66666667" width="12" height="7.33333333" rx="1" />
          <polygon
            id="路径"
            stroke-linecap="round"
            stroke-linejoin="round"
            points="4.66666667 9.33333333 9.66666667 9.33333333 9.66666667 12 4.66666667 12"
          />
          <line
            x1="2"
            y1="6.66666667"
            x2="3"
            y2="6.66666667"
            id="路径"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
      </g>
    </svg>
  );
}
