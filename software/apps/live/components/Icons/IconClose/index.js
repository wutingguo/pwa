import React from 'react';

export default function IconClose(props) {
  const { style, className, fill = '#5E6570', width = 20, ...rest } = props;

  return (
    <svg
      t="1688611616012"
      className={className}
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="2287"
      style={style}
      width={width}
      {...rest}
    >
      <path
        d="M570.514286 512l292.571428-292.571429c14.628571-14.628571 14.628571-43.885714 0-58.514285-14.628571-14.628571-43.885714-14.628571-58.514285 
        0l-292.571429 292.571428-292.571429-292.571428c-14.628571-14.628571-43.885714-14.628571-58.514285 0-21.942857 14.628571-21.942857 43.885714 
        0 58.514285l292.571428 292.571429-292.571428 292.571429c-14.628571 14.628571-14.628571 43.885714 0 58.514285 14.628571 14.628571 43.885714 
        14.628571 58.514285 0l292.571429-292.571428 292.571429 292.571428c14.628571 14.628571 43.885714 14.628571 58.514285 0 14.628571-14.628571 
        14.628571-43.885714 0-58.514285l-292.571428-292.571429z"
        fill={fill}
        p-id="2288"
      ></path>
    </svg>
  );
}