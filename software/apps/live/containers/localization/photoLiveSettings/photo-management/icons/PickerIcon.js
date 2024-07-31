import React from 'react';

/**
 * @typedef {Object} MoveIconProps
 * @property {React.CSSProperties} style
 * @property {string} className
 * @property {string} fill
 * @property {number} width
 */

/**
 * 批量挑图图标的props
 * @param {MoveIconProps} props
 */
export default function PickerIcon(props) {
  const { style, className, width = 13 } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height="13px"
      viewBox="0 0 13 13"
      version="1.1"
      style={style}
      className={className}
    >
      <g
        id="人员"
        stroke="none"
        stroke-width="1"
        fill="none"
        fill-rule="evenodd"
        stroke-linecap="round"
      >
        <g id="移动照片备份-2" transform="translate(-673.000000, -232.000000)" stroke="#FFFFFF">
          <g id="图片收集_collect-picture" transform="translate(673.500000, 232.500000)">
            <path
              d="M12,5.13435182 L12,11 C12,11.5522847 11.5522847,12 11,12 L1,12 C0.44771525,12 0,11.5522847 0,11 L0,1 C0,0.44771525 0.44771525,0 1,0 L6.04701889,0 L6.04701889,0"
              id="路径"
            ></path>
            <path
              d="M0.15,9.575 L3.6252575,6.38935 C3.8676425,6.1671475 4.2378175,6.1609725 4.4874825,6.374985 L8.6,9.9"
              id="路径"
              stroke-linejoin="round"
            ></path>
            <path
              d="M7.3,8.275 L8.8513875,6.7236125 C9.08009,6.49491 9.442205,6.46917 9.7010025,6.66326 L11.85,8.275"
              id="路径"
              stroke-linejoin="round"
            ></path>
            <path
              d="M9.0225,0.15 C8.4301875,0.15 7.95,0.61628725 7.95,1.19147875 C7.95,2.2329575 9.2175,3.1797475 9.9,3.4 C10.5825,3.1797475 11.85,2.2329575 11.85,1.19147875 C11.85,0.61628725 11.3698125,0.15 10.7775,0.15 C10.4147675,0.15 10.09409,0.324863 9.9,0.59252 C9.70591,0.324863 9.3852325,0.15 9.0225,0.15 Z"
              id="路径"
              stroke-linejoin="round"
            ></path>
          </g>
        </g>
      </g>
    </svg>
  );
}
