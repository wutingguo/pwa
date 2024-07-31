import React from 'react';

export default function IconLeft(props) {
  const { style, className, fill = '#5E6570', width = 18, height = 18, ...rest } = props;

  return (
    <svg
      t="1687761107982"
      className={className}
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="2375"
      style={style}
      width={width}
      height={height}
      {...rest}
    >
      <path
        d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8c-16.4 12.8-16.4 37.5 0 50.3l450.8 352.1c5.3 4.1 12.9 0.4 
        12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"
        p-id="2376"
        fill={fill}
      ></path>
    </svg>
  );
}
