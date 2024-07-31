import React from 'react';

export default function Icon(props) {
  const { fill = '#5E6570', style, className, width = 20 } = props;
  return (
    <svg
      t="1685946951235"
      className={className}
      style={style}
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="2394"
      width={width}
    >
      <path
        d="M863.328 482.56l-317.344-1.12L545.984 162.816c0-17.664-14.336-32-32-32s-32 
            14.336-32 32l0 318.4L159.616 480.064c-0.032 0-0.064 0-0.096 0-17.632 0-31.936 
            14.24-32 31.904C127.424 529.632 141.728 544 159.392 544.064l322.592 1.152 0 319.168c0 
            17.696 14.336 32 32 32s32-14.304 32-32l0-318.944 317.088 1.12c0.064 0 0.096 0 0.128 0 17.632 0 
            31.936-14.24 32-31.904C895.264 496.992 880.96 482.624 863.328 482.56z"
        fill={fill}
        p-id="2395"
      ></path>
    </svg>
  );
}
