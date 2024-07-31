import React, { Component } from 'react';
import './index.scss';
export default function OrderHeader(props) {
  const { headList } = props;
  return (
    <div className="order_header">
      {headList &&
        headList.map(item => {
          return <div className="header_item">{item.title}</div>;
        })}
    </div>
  );
}
