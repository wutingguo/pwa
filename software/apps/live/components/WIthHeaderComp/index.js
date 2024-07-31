import React from 'react';
import './index.scss';

const WithHeaderComp = props => {
  const { title, className, extra, titleStyle } = props;
  return (
    <div className={`WithHeaderCompWrapper ${className}`}>
      <div className="moduleTitle">
        <div className="moduleTitle_left" style={titleStyle}>
          {title}
        </div>
        <div className="moduleTitle_right">{extra}</div>
      </div>
      {props.children}
    </div>
  );
};

export default WithHeaderComp;
