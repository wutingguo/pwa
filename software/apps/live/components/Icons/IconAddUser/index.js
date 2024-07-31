import React from 'react';

export default function Icon(props) {
  const { fill = '#5E6570', style, className, width = 20, height, ...rest } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 26 26"
      version="1.1"
      style={style}
      width={width}
      height={height}
      className={className}
      {...rest}
    >
      <g
        id="AI人脸识别新增Selfie-Check-in模式"
        stroke="none"
        stroke-width="1"
        fill="none"
        fill-rule="evenodd"
      >
        <g id="Adjusting-facial-information" transform="translate(-358.000000, -363.000000)">
          <g id="添加人群" transform="translate(359.000000, 364.000000)">
            <path
              d="M8.66666667,9.33333333 C11.244,9.33333333 13.3333333,7.244 13.3333333,4.66666667 C13.3333333,2.08934 11.244,0 8.66666667,0 C6.08933333,0 4,2.08934 4,4.66666667 C4,7.244 6.08933333,9.33333333 8.66666667,9.33333333 Z"
              id="路径"
              stroke={fill}
              stroke-width="2"
              stroke-linejoin="round"
            />
            <path d="M20,15.3333333 L20,23.3333333 L20,15.3333333 Z" id="路径" />
            <path d="M16,19.3333333 L24,19.3333333 L16,19.3333333 Z" id="路径" />
            <path
              d="M20,15.3333333 L20,23.3333333 M16,19.3333333 L24,19.3333333"
              id="形状"
              stroke={fill}
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M14,14.6666667 L8.53333333,14.6666667 C5.5464,14.6666667 4.05293333,14.6666667 2.91206667,15.2479333 C1.90852,15.7592667 1.09262,16.5752 0.5813,17.5787333 C0,18.7196 0,20.2130667 0,23.2 L0,24 L14,24"
              id="路径"
              stroke={fill}
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
        </g>
      </g>
    </svg>
  );
}
