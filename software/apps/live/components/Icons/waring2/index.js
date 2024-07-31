import React from 'react';

export default function Success(props) {
  const { fill = '#222', style, className, width = 20 } = props;
  return (
    <svg
      t="1688976680695"
      className={className}
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      p-id="2628"
      width={width}
    >
      <path
        d="M571.134931 546.559428a59.134803 59.134803 0 1 1-118.269605 0V270.853011a59.134803 59.134803 0 1 1 
        118.269605 0z m-59.134803 255.994816a58.878808 58.878808 0 1 1 41.727155-17.151652 57.086844 57.086844 
        0 0 1-41.727155 17.151652zM512.000128 0.010496a501.74984 501.74984 0 0 0-199.419962 39.935191A509.685679 
        509.685679 0 0 0 39.945687 312.580166 501.74984 501.74984 0 0 0 0.010496 512.000128a501.74984 501.74984 0 0 
        0 39.935191 199.419962 509.685679 509.685679 0 0 0 272.634479 272.634479A501.74984 501.74984 0 0 0 512.000128 
        1023.98976a501.74984 501.74984 0 0 0 199.419962-39.935191 509.685679 509.685679 0 0 0 272.634479-272.634479A501.74984 
        501.74984 0 0 0 1023.98976 512.000128a501.74984 501.74984 0 0 0-39.935191-199.419962A509.685679 509.685679 0 0 0 711.42009 
        39.945687 501.74984 501.74984 0 0 0 512.000128 0.010496z"
        fill={fill}
        p-id="2629"
      ></path>
    </svg>
  );
}
