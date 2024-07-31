import React from 'react';

export default function IconBannerClose(props) {
  const { style, className, fill = '#FD4443', width = 20, ...rest } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      width={width}
      className={className}
      viewBox="0 0 20 20"
      version="1.1"
      {...rest}
    >
      <title></title>
      <desc>Created with Sketch.</desc>
      <g id="直播工作台" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="相理设置-banner" transform="translate(-672.000000, -434.000000)">
          <g id="编组-4" transform="translate(672.000000, 434.000000)">
            <circle id="椭圆形" fill={fill} cx="10" cy="10" r="10" />
            <line
              x1="6"
              y1="6"
              x2="13.7781746"
              y2="13.7781746"
              id="路径-8"
              stroke="#FFFFFF"
              stroke-width="2"
              stroke-linecap="round"
            />
            <line
              x1="6"
              y1="6"
              x2="13.7781746"
              y2="13.7781746"
              id="路径-8"
              stroke="#FFFFFF"
              stroke-width="2"
              stroke-linecap="round"
              transform="translate(9.889087, 9.889087) scale(-1, 1) translate(-9.889087, -9.889087) "
            />
          </g>
        </g>
      </g>
    </svg>
  );
}
