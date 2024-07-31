import React from 'react';

/**
 * @typedef {Object} MoveIconProps
 * @property {React.CSSProperties} style
 * @property {string} className
 * @property {string} fill
 * @property {number} width
 */

/**
 * 移动照片图标的props
 * @param {MoveIconProps} props
 */
export default function MoveIcon(props) {
  const { style, className, width = 14 } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height="14px"
      viewBox="0 0 14 14"
      version="1.1"
      style={style}
      className={className}
    >
      <g
        id="【CN】【US】【PC】【APP】直播相册支持创建多个分组（tab）"
        stroke="none"
        stroke-width="1"
        fill="none"
        fill-rule="evenodd"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <g id="移动照片" transform="translate(-851.000000, -240.000000)" stroke="#FFFFFF">
          <g id="移动_move-in-one" transform="translate(852.000000, 241.000000)">
            <polygon
              id="路径"
              points="7.33333333 7.33333333 12 8.26666667 10.6 9.2 12 10.6 10.6 12 9.2 10.6 8.26666667 12"
            ></polygon>
            <path
              d="M12,5.33333333 L12,0.666666667 C12,0.298476667 11.7015333,0 11.3333333,0 L0.666666667,0 C0.298476667,0 0,0.298476667 0,0.666666667 L0,11.3333333 C0,11.7015333 0.298476667,12 0.666666667,12 L5,12"
              id="路径"
            ></path>
          </g>
        </g>
      </g>
    </svg>
  );
}
