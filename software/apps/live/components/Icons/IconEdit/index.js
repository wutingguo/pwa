import React from 'react';

export default function Icon(props) {
  const { fill = '#e6e6e6', style, className, width = 20 } = props;
  return (
    <svg
      t="1692079188613"
      className={className}
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="15906"
      style={style}
      width={width}
    >
      <path
        d="M879.322872 1024H96.715169a36.519258 36.519258 0 0 1-36.519258-36.519258V84.481217a36.519258 36.519258 0 0 1 
        36.519258-36.519258h577.917261v73.038517H133.234427v829.961008h709.569187V319.239182h73.038516v668.24156a36.519258 
        36.519258 0 0 1-36.519258 36.519258z"
        p-id="15907"
        fill={fill}
      ></path>
      <path
        d="M253.504517 694.596291h469.089872v73.038516H253.504517zM912.190204 0l51.613885 51.613885-388.808369 388.869234h-51.67475v-51.67475L912.190204 
        0zM253.504517 507.009035h175.901094v73.038516h-175.901094z"
        fill={fill}
        p-id="15908"
      ></path>
    </svg>
  );
}
